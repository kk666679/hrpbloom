import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: Number.parseInt(params.id),
        companyId: Number.parseInt(session.user.companyId),
      },
      include: {
        company: true,
        documents: true,
        leaves: {
          orderBy: { appliedAt: "desc" },
          take: 5,
        },
        attendances: {
          orderBy: { date: "desc" },
          take: 10,
        },
        payrolls: {
          orderBy: { createdAt: "desc" },
          take: 6,
        },
      },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...sanitizedEmployee } = employee

    return NextResponse.json(sanitizedEmployee)
  } catch (error) {
    console.error("Error fetching employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
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
      status,
      role,
    } = body

    const employee = await prisma.employee.update({
      where: {
        id: Number.parseInt(params.id),
        companyId: Number.parseInt(session.user.companyId),
      },
      data: {
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
        status,
        role,
      },
    })

    // Remove password from response
    const { password, ...sanitizedEmployee } = employee

    return NextResponse.json(sanitizedEmployee)
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.employee.delete({
      where: {
        id: Number.parseInt(params.id),
        companyId: Number.parseInt(session.user.companyId),
      },
    })

    return NextResponse.json({ message: "Employee deleted successfully" })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
