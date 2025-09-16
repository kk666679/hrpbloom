export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""
    const status = searchParams.get("status") || ""
    const skip = (page - 1) * limit

    const where: any = {
      companyId: Number.parseInt(session.user.companyId),
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (department) {
      where.department = department
    }

    if (status) {
      where.status = status
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.employee.count({ where }),
    ])

    // Remove password from response
    const sanitizedEmployees = employees.map(({ password, ...employee }) => employee)

    return NextResponse.json({
      employees: sanitizedEmployees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      employeeId,
      firstName,
      lastName,
      nric,
      passportNo,
      email,
      phone,
      address,
      dateOfBirth,
      dateJoined,
      department,
      position,
      salary,
      epfNo,
      socsoNo,
      taxNo,
      bankAccount,
      role = "EMPLOYEE",
    } = body

    // Check if employee ID or email already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [{ employeeId }, { email }, { nric }],
      },
    })

    if (existingEmployee) {
      return NextResponse.json({ error: "Employee ID, email, or NRIC already exists" }, { status: 400 })
    }

    // Generate temporary password
    const tempPassword = `temp${Math.random().toString(36).slice(-8)}`
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName,
        lastName,
        nric,
        passportNo,
        email,
        phone,
        address,
        dateOfBirth: new Date(dateOfBirth),
        dateJoined: new Date(dateJoined),
        department,
        position,
        salary: Number.parseFloat(salary),
        epfNo,
        socsoNo,
        taxNo,
        bankAccount,
        role,
        password: hashedPassword,
        companyId: Number.parseInt(session.user.companyId),
      },
    })

    // Remove password from response
    const { password, ...sanitizedEmployee } = employee

    return NextResponse.json({
      employee: sanitizedEmployee,
      tempPassword, // Return temp password for initial setup
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
