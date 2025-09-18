export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions) as any
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leave = await prisma.leave.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        employee: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 })
    }

    // Check if user can access this leave
    if (!["ADMIN", "HR", "MANAGER"].includes((session.user as any).role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: (session.user as any).email },
      })
      if (!employee || employee.id !== leave.employeeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    return NextResponse.json(leave)
  } catch (error) {
    console.error("Error fetching leave:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions) as any
    if (!session || !["ADMIN", "HR", "MANAGER"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, approvedBy } = body

    const leave = await prisma.leave.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: { employee: true },
    })

    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 })
    }

    // Get approver's employee record
    const approver = await prisma.employee.findUnique({
      where: { email: (session.user as any).email },
    })

    if (!approver) {
      return NextResponse.json({ error: "Approver not found" }, { status: 404 })
    }

    // Calculate leave days
    const start = new Date(leave.startDate)
    const end = new Date(leave.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // Update leave status
    const updatedLeave = await prisma.leave.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        status,
        approvedAt: status === "APPROVED" ? new Date() : null,
        approvedBy: approver.id,
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

    // Update employee leave balance if approved annual leave
    if (status === "APPROVED" && leave.type === "ANNUAL") {
      await prisma.employee.update({
        where: { id: leave.employeeId },
        data: {
          leaveBalance: {
            decrement: diffDays,
          },
        },
      })
    }

    return NextResponse.json(updatedLeave)
  } catch (error) {
    console.error("Error updating leave:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const session = await getServerSession(authOptions) as any
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leave = await prisma.leave.findUnique({
      where: { id: Number.parseInt(params.id) },
    })

    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 })
    }

    // Only allow deletion by the applicant or admin/HR
    if (!["ADMIN", "HR"].includes((session.user as any).role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: (session.user as any).email },
      })
      if (!employee || employee.id !== leave.employeeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Only allow deletion of pending leaves
    if (leave.status !== "PENDING") {
      return NextResponse.json({ error: "Can only delete pending leave applications" }, { status: 400 })
    }

    await prisma.leave.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ message: "Leave deleted successfully" })
  } catch (error) {
    console.error("Error deleting leave:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
