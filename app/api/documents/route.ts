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
    const type = searchParams.get("type")

    const where: any = {}

    // If not admin/HR, only show own documents
    if (!["ADMIN", "HR"].includes(session.user.role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: session.user.email },
      })
      if (employee) {
        where.employeeId = employee.id
      }
    } else if (employeeId) {
      where.employeeId = Number.parseInt(employeeId)
    }

    if (type) {
      where.type = type
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        employee: {
          select: {
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const employeeId = formData.get("employeeId") as string
    const type = formData.get("type") as string
    const name = formData.get("name") as string

    if (!file || !employeeId || !type || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user can upload documents for this employee
    if (!["ADMIN", "HR"].includes(session.user.role)) {
      const employee = await prisma.employee.findUnique({
        where: { email: session.user.email },
      })
      if (!employee || employee.id !== Number.parseInt(employeeId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Convert file to base64 for storage (in production, use cloud storage)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Generate unique key
    const key = `${employeeId}-${Date.now()}-${file.name}`

    // Create document record
    const document = await prisma.document.create({
      data: {
        name,
        type,
        key,
        url: dataUrl, // In production, this would be a cloud storage URL
        employeeId: Number.parseInt(employeeId),
      },
      include: {
        employee: {
          select: {
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
