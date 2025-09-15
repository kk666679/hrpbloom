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

    const companyId = Number.parseInt(session.user.companyId)
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    // Get employee statistics
    const [totalEmployees, activeEmployees, newHiresThisMonth, employeesByDepartment, employeesByStatus] =
      await Promise.all([
        prisma.employee.count({
          where: { companyId },
        }),
        prisma.employee.count({
          where: { companyId, status: "ACTIVE" },
        }),
        prisma.employee.count({
          where: {
            companyId,
            dateJoined: {
              gte: new Date(currentYear, currentMonth - 1, 1),
              lt: new Date(currentYear, currentMonth, 1),
            },
          },
        }),
        prisma.employee.groupBy({
          by: ["department"],
          where: { companyId, status: "ACTIVE" },
          _count: { id: true },
        }),
        prisma.employee.groupBy({
          by: ["status"],
          where: { companyId },
          _count: { id: true },
        }),
      ])

    // Get leave statistics
    const [pendingLeaves, approvedLeavesThisMonth, leavesByType] = await Promise.all([
      prisma.leave.count({
        where: {
          employee: { companyId },
          status: "PENDING",
        },
      }),
      prisma.leave.count({
        where: {
          employee: { companyId },
          status: "APPROVED",
          startDate: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      }),
      prisma.leave.groupBy({
        by: ["type"],
        where: {
          employee: { companyId },
          status: "APPROVED",
          startDate: {
            gte: new Date(currentYear, 0, 1),
            lt: new Date(currentYear + 1, 0, 1),
          },
        },
        _count: { id: true },
      }),
    ])

    // Get payroll statistics
    const [currentMonthPayroll, pendingPayments, totalPayrollThisYear] = await Promise.all([
      prisma.payroll.aggregate({
        where: {
          employee: { companyId },
          month: currentMonth,
          year: currentYear,
        },
        _sum: { netSalary: true },
        _count: { id: true },
      }),
      prisma.payroll.count({
        where: {
          employee: { companyId },
          paidAt: null,
        },
      }),
      prisma.payroll.aggregate({
        where: {
          employee: { companyId },
          year: currentYear,
        },
        _sum: { netSalary: true },
      }),
    ])

    // Get document statistics
    const [totalDocuments, recentDocuments] = await Promise.all([
      prisma.document.count({
        where: { employee: { companyId } },
      }),
      prisma.document.count({
        where: {
          employee: { companyId },
          uploadedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ])

    // Get recent activities
    const recentActivities = await Promise.all([
      // Recent employees
      prisma.employee.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          createdAt: true,
        },
      }),
      // Recent leaves
      prisma.leave.findMany({
        where: { employee: { companyId } },
        orderBy: { appliedAt: "desc" },
        take: 5,
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true,
            },
          },
        },
      }),
    ])

    return NextResponse.json({
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        newHires: newHiresThisMonth,
        byDepartment: employeesByDepartment,
        byStatus: employeesByStatus,
      },
      leaves: {
        pending: pendingLeaves,
        approvedThisMonth: approvedLeavesThisMonth,
        byType: leavesByType,
      },
      payroll: {
        currentMonth: {
          total: currentMonthPayroll._sum.netSalary || 0,
          count: currentMonthPayroll._count.id || 0,
        },
        pendingPayments,
        totalThisYear: totalPayrollThisYear._sum.netSalary || 0,
      },
      documents: {
        total: totalDocuments,
        recent: recentDocuments,
      },
      recentActivities: {
        employees: recentActivities[0],
        leaves: recentActivities[1],
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
