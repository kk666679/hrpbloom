export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/db"
import type { Session } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
      where: { email: session.user.email },
      include: {
        leaves: {
          orderBy: { appliedAt: "desc" },
          take: 5,
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
          take: 5,
        },
      },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeId: employee.employeeId,
      department: employee.department,
      position: employee.position,
      leaveBalance: employee.leaveBalance,
      recentLeaves: employee.leaves,
      recentDocuments: employee.documents,
    })
  } catch (error) {
    console.error("Error fetching employee profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
