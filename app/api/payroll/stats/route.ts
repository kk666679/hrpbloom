import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "HR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    const where: any = {}
    if (month) where.month = Number.parseInt(month)
    if (year) where.year = Number.parseInt(year)

    // Get payroll statistics
    const [payrollStats, pendingCount] = await Promise.all([
      prisma.payroll.aggregate({
        where,
        _sum: {
          netSalary: true,
          basicSalary: true,
        },
        _avg: {
          netSalary: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.payroll.count({
        where: {
          ...where,
          paidAt: null,
        },
      }),
    ])

    return NextResponse.json({
      totalPayroll: payrollStats._sum.netSalary || 0,
      totalEmployees: payrollStats._count.id || 0,
      avgSalary: Math.round(payrollStats._avg.netSalary || 0),
      pendingPayments: pendingCount,
    })
  } catch (error) {
    console.error("Error fetching payroll stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
