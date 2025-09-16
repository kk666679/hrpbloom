export const runtime = "nodejs"
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getUserFromRequest } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get fresh user data
    const userData = await prisma.employee.findUnique({
      where: { id: user.id },
      include: { company: true },
    })

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.position,
        department: userData.department,
        company: userData.company.name,
      },
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
