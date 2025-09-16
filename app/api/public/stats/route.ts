import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // If user is not authenticated, return basic public stats
    if (!session) {
      // Return aggregated stats across all companies (for demo purposes)
      const [totalCompanies, totalEmployees, totalLeaves] = await Promise.all([
        prisma.company.count(),
        prisma.employee.count(),
        prisma.leave.count({ where: { status: "APPROVED" } }),
      ])

      return NextResponse.json({
        public: true,
        stats: {
          companies: totalCompanies,
          employees: totalEmployees,
          leavesProcessed: totalLeaves,
          satisfaction: 98.5, // Static satisfaction rate for demo
        }
      })
    }

    // If user is authenticated, return company-specific stats
    const companyId = Number.parseInt(session.user.companyId)
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const [
      totalEmployees,
      activeEmployees,
      pendingLeaves,
      currentMonthPayroll,
      totalDocuments,
      recentActivities
    ] = await Promise.all([
      prisma.employee.count({
        where: { companyId },
      }),
      prisma.employee.count({
        where: { companyId, status: "ACTIVE" },
      }),
      prisma.leave.count({
        where: {
          employee: { companyId },
          status: "PENDING",
        },
      }),
      prisma.payroll.aggregate({
        where: {
          employee: { companyId },
          month: currentMonth,
          year: currentYear,
        },
        _sum: { netSalary: true },
      }),
      prisma.document.count({
        where: { employee: { companyId } },
      }),
      // Get recent employees (last 5)
      prisma.employee.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      public: false,
      companyStats: {
        employees: {
          total: totalEmployees,
          active: activeEmployees,
        },
        leaves: {
          pending: pendingLeaves,
        },
        payroll: {
          currentMonth: currentMonthPayroll._sum.netSalary || 0,
        },
        documents: {
          total: totalDocuments,
        },
      },
      recentActivities: {
        employees: recentActivities,
      },
    })
  } catch (error) {
    console.error("Error fetching public stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
