export const runtime = "nodejs"
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { agentRegistry, createTask, createContext } from '@/lib/ai-agents'
import { AgentTaskType, TaskPriority } from '@/types/ai-agents'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { employeeId, type, description, allegations, riskLevel } = body

    // Validate required fields
    if (!employeeId || !type || !description) {
      return NextResponse.json(
        { error: 'employeeId, type, and description are required' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    try {
      // Create IR case in database
      const caseNumber = `IR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      const irCase = await (prisma as any).iRCase.create({
        data: {
          caseNumber,
          employeeId: parseInt(employeeId),
          type,
          description,
          allegations: allegations || [],
          riskLevel: riskLevel || 'LOW',
          assignedTo: user.role === 'hr' ? parseInt(user.id) : null
        }
      })

      // Create task for dispute prediction
      const task = createTask(AgentTaskType.DISPUTE_PREDICT, {
        caseId: irCase.id,
        caseNumber,
        employeeId: parseInt(employeeId),
        type,
        description,
        allegations: allegations || [],
        riskLevel: riskLevel || 'LOW'
      }, {
        priority: TaskPriority.HIGH,
        userId: parseInt(user.id),
        metadata: { source: 'ir_api', caseId: irCase.id }
      })

      // Create context
      const context = createContext(
        parseInt(user.id),
        parseInt(user.companyId),
        {
          role: user.role,
          sessionId: `ir_${irCase.id}`
        }
      )

      // Execute task through coordinator
      const response = await agentRegistry.executeTask(task, context)

      const processingTime = Date.now() - startTime

      if (!response.success) {
        return NextResponse.json(
          { error: response.error || 'IR case processing failed' },
          { status: 500 }
        )
      }

      // Update case with AI predictions
      await (prisma as any).iRCase.update({
        where: { id: irCase.id },
        data: {
          riskLevel: response.output.predictedRiskLevel || irCase.riskLevel
        }
      })

      // Return formatted response
      const result = {
        success: true,
        case: {
          id: irCase.id,
          caseNumber: irCase.caseNumber,
          type: irCase.type,
          status: irCase.status,
          riskLevel: response.output.predictedRiskLevel || irCase.riskLevel,
          description: irCase.description,
          createdAt: irCase.createdAt
        },
        predictions: response.output,
        processingTime,
        agentUsed: response.agentId,
        confidence: response.confidence
      }

      return NextResponse.json(result)

    } catch (executionError) {
      console.error('IR case creation error:', executionError)

      const processingTime = Date.now() - startTime

      return NextResponse.json(
        {
          error: executionError instanceof Error ? executionError.message : 'IR case creation failed',
          processingTime
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('IR API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const riskLevel = searchParams.get('riskLevel')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (riskLevel) where.riskLevel = riskLevel

    // Get IR cases
    const cases = await (prisma as any).iRCase.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            position: true
          }
        },
        actions: {
          orderBy: { timestamp: 'desc' },
          take: 3
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await (prisma as any).iRCase.count({ where })

    return NextResponse.json({
      cases,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('IR cases fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch IR cases' },
      { status: 500 }
    )
  }
}
