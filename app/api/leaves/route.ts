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
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const employeeId = searchParams.get("employeeId")
    const skip = (page - 1) * limit

    const where: any = {}

    // If not admin/HR/manager, only show own leaves
    if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: session.user.email },
      })
      if (employee) {
        where.employeeId = employee.id
      }
    } else if (employeeId) {
      where.employeeId = Number.parseInt(employeeId)
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const [leaves, total] = await Promise.all([
      prisma.leave.findMany({
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
        orderBy: {
          appliedAt: "desc",
        },
      }),
      prisma.leave.count({ where }),
    ])

    return NextResponse.json({
      leaves,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching leaves:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, startDate, endDate, reason } = body

    // Get current user's employee record
    const employee = await prisma.employee.findUnique({
      where: { email: session.user.email },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Calculate leave days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Check if employee has sufficient leave balance for annual leave
    if (type === "ANNUAL" && diffDays > employee.leaveBalance) {
      return NextResponse.json({ error: "Insufficient leave balance" }, { status: 400 })
    }

    // Check for overlapping leaves
    const overlappingLeave = await prisma.leave.findFirst({
      where: {
        employeeId: employee.id,
        status: { in: ["PENDING", "APPROVED"] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    })

    if (overlappingLeave) {
      return NextResponse.json({ error: "Leave dates overlap with existing leave application" }, { status: 400 })
    }

    const leave = await prisma.leave.create({
      data: {
        type,
        startDate: start,
        endDate: end,
        reason,
        employeeId: employee.id,
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

    return NextResponse.json(leave)
  } catch (error) {
    console.error("Error creating leave:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
