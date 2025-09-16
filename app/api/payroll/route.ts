import { type NextRequest, NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { calculateMalaysianPayroll } from "@/lib/malaysian-compliance"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = token ? getAuthToken() : null
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const month = searchParams.get("month")
    const year = searchParams.get("year")
    const employeeId = searchParams.get("employeeId")
    const skip = (page - 1) * limit

    const where: any = {}

    // If not admin/HR, only show own payroll
    if (!["admin", "hr"].includes(user.role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: user.email },
      })
      if (employee) {
        where.employeeId = employee.id
      }
    } else {
      // Admin/HR can filter by employee
      if (employeeId) {
        where.employeeId = Number.parseInt(employeeId)
      }
    }

    if (month) {
      where.month = Number.parseInt(month)
    }

    if (year) {
      where.year = Number.parseInt(year)
    }

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        skip,
        take: limit,
        include: {
          employee: {
            select: {
              employeeId: true,
              firstName: true,
              lastName: true,
              department: true,
              position: true,
            },
          },
        },
        orderBy: [{ year: "desc" }, { month: "desc" }],
      }),
      prisma.payroll.count({ where }),
    ])

    return NextResponse.json({
      payrolls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payrolls:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = token ? getAuthToken() : null
    if (!user || !["admin", "hr"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { employeeId, month, year, allowances = 0, deductions = 0, tabungHajiOptIn = false, state } = body

    // Check if payroll already exists for this employee and period
    const existingPayroll = await prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId: Number.parseInt(employeeId),
          month: Number.parseInt(month),
          year: Number.parseInt(year),
        },
      },
    })

    if (existingPayroll) {
      return NextResponse.json({ error: "Payroll already exists for this period" }, { status: 400 })
    }

    // Get employee details
    const employee = await prisma.employee.findUnique({
      where: { id: Number.parseInt(employeeId) },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Calculate payroll using Malaysian compliance
    const payrollCalculation = calculateMalaysianPayroll({
      basicSalary: employee.salary,
      allowances: Number.parseFloat(allowances),
      deductions: Number.parseFloat(deductions),
      tabungHajiOptIn,
      state,
    })

    // Create payroll record
    const payroll = await prisma.payroll.create({
      data: {
        employeeId: Number.parseInt(employeeId),
        month: Number.parseInt(month),
        year: Number.parseInt(year),
        basicSalary: employee.salary,
        allowances: Number.parseFloat(allowances),
        deductions: Number.parseFloat(deductions),
        epfAmount: payrollCalculation.epfEmployee,
        socsoAmount: payrollCalculation.socsoEmployee,
        eisAmount: payrollCalculation.eisAmount,
        tabungHajiAmount: payrollCalculation.tabungHajiAmount,
        taxAmount: payrollCalculation.taxAmount,
        zakatAmount: payrollCalculation.zakatAmount,
        netSalary: payrollCalculation.netSalary,
      },
      include: {
        employee: {
          select: {
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
            position: true,
          },
        },
      },
    })

    return NextResponse.json(payroll)
  } catch (error) {
    console.error("Error creating payroll:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
