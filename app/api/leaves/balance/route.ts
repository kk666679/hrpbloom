export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    let targetEmployeeId: number

    if (employeeId && ["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
      targetEmployeeId = Number.parseInt(employeeId)
    } else {
      // Get current user's employee record
      const employee = await prisma.employee.findUnique({
        where: { email: session.user.email },
      })
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 })
      }
      targetEmployeeId = employee.id
    }

    // Get employee with leave balance
    const employee = await prisma.employee.findUnique({
      where: { id: targetEmployeeId },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        leaveBalance: true,
        dateJoined: true,
      },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Get leave statistics for current year
    const currentYear = new Date().getFullYear()
    const leaveStats = await prisma.leave.groupBy({
      by: ["type", "status"],
      where: {
        employeeId: targetEmployeeId,
        startDate: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
      _count: {
        id: true,
      },
    })

    // Calculate used leaves by type
    const usedLeaves = leaveStats.reduce(
      (acc, stat) => {
        if (stat.status === "APPROVED") {
          acc[stat.type] = (acc[stat.type] || 0) + stat._count.id
        }
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate pending leaves by type
    const pendingLeaves = leaveStats.reduce(
      (acc, stat) => {
        if (stat.status === "PENDING") {
          acc[stat.type] = (acc[stat.type] || 0) + stat._count.id
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        dateJoined: employee.dateJoined,
      },
      balance: {
        annual: employee.leaveBalance,
        used: usedLeaves,
        pending: pendingLeaves,
      },
    })
  } catch (error) {
    console.error("Error fetching leave balance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
