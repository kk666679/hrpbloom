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

    const payroll = await prisma.payroll.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        employee: {
          include: {
            company: true,
          },
        },
      },
    })

    if (!payroll) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 })
    }

    // Check if user can access this payroll
    if (!["ADMIN", "HR"].includes(session.user.role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: session.user.email },
      })
      if (!employee || employee.id !== payroll.employeeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    return NextResponse.json(payroll)
  } catch (error) {
    console.error("Error fetching payroll:", error)
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
    const { paidAt } = body

    const payroll = await prisma.payroll.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        paidAt: paidAt ? new Date(paidAt) : null,
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
    console.error("Error updating payroll:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
