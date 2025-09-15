import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { calculateMalaysianPayroll } from "@/lib/malaysian-compliance"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { month, year, employeeIds, allowances = {}, deductions = {} } = body

    // Get all active employees if no specific IDs provided
    let employees
    if (employeeIds && employeeIds.length > 0) {
      employees = await prisma.employee.findMany({
        where: {
          id: { in: employeeIds.map((id: string) => Number.parseInt(id)) },
          status: "ACTIVE",
          companyId: Number.parseInt(session.user.companyId),
        },
      })
    } else {
      employees = await prisma.employee.findMany({
        where: {
          status: "ACTIVE",
          companyId: Number.parseInt(session.user.companyId),
        },
      })
    }

    const payrollsToCreate = []
    const errors = []

    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existingPayroll = await prisma.payroll.findUnique({
          where: {
            employeeId_month_year: {
              employeeId: employee.id,
              month: Number.parseInt(month),
              year: Number.parseInt(year),
            },
          },
        })

        if (existingPayroll) {
          errors.push(`Payroll already exists for ${employee.firstName} ${employee.lastName}`)
          continue
        }

        // Get employee-specific allowances and deductions
        const empAllowances = allowances[employee.id] || 0
        const empDeductions = deductions[employee.id] || 0

        // Calculate payroll
        const payrollCalculation = calculateMalaysianPayroll({
          basicSalary: employee.salary,
          allowances: Number.parseFloat(empAllowances),
          deductions: Number.parseFloat(empDeductions),
        })

        payrollsToCreate.push({
          employeeId: employee.id,
          month: Number.parseInt(month),
          year: Number.parseInt(year),
          basicSalary: employee.salary,
          allowances: Number.parseFloat(empAllowances),
          deductions: Number.parseFloat(empDeductions),
          epfAmount: payrollCalculation.epfEmployee,
          socsoAmount: payrollCalculation.socsoEmployee,
          taxAmount: payrollCalculation.taxAmount,
          netSalary: payrollCalculation.netSalary,
        })
      } catch (error) {
        errors.push(`Error processing ${employee.firstName} ${employee.lastName}: ${error}`)
      }
    }

    // Create all payrolls
    const createdPayrolls = await prisma.payroll.createMany({
      data: payrollsToCreate,
    })

    return NextResponse.json({
      success: true,
      created: createdPayrolls.count,
      errors,
    })
  } catch (error) {
    console.error("Error creating bulk payroll:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
