export const runtime = "nodejs"
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { agentRegistry, createTask, createContext } from '@/lib/ai-agents'
import { AgentTaskType, TaskPriority } from '@/types/ai-agents'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { basicSalary, allowances = 0, deductions = 0, tabungHajiOptIn = false, state } = body

    // Validate required fields
    if (!basicSalary || basicSalary <= 0) {
      return NextResponse.json(
        { error: 'Valid basicSalary is required' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    try {
      // Create task for payroll validation
      const task = createTask(AgentTaskType.PAYROLL_VALIDATE, {
        basicSalary: parseFloat(basicSalary),
        allowances: parseFloat(allowances),
        deductions: parseFloat(deductions),
        tabungHajiOptIn: Boolean(tabungHajiOptIn),
        state: state || 'Selangor'
      }, {
        priority: TaskPriority.HIGH,
        userId: parseInt(session.user.id),
        metadata: { source: 'compliance_api' }
      })

      // Create context
      const context = createContext(
        parseInt(session.user.id),
        parseInt(session.user.companyId),
        {
          role: session.user.role,
          sessionId: `compliance_${Date.now()}`
        }
      )

      // Execute task through coordinator
      const response = await agentRegistry.executeTask(task, context)

      const processingTime = Date.now() - startTime

      if (!response.success) {
        return NextResponse.json(
          { error: response.error || 'Payroll calculation failed' },
          { status: 500 }
        )
      }

      // Return formatted response
      const result = {
        success: true,
        data: response.output,
        processingTime,
        agentUsed: response.agentId,
        confidence: response.confidence,
        alerts: response.output.alerts || []
      }

      return NextResponse.json(result)

    } catch (executionError) {
      console.error('Payroll calculation error:', executionError)

      const processingTime = Date.now() - startTime

      return NextResponse.json(
        {
          error: executionError instanceof Error ? executionError.message : 'Payroll calculation failed',
          processingTime
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Compliance calculate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return compliance calculation template/example
    const example = {
      description: 'Malaysian Payroll Compliance Calculator',
      endpoint: '/api/compliance/calculate',
      method: 'POST',
      requiredFields: {
        basicSalary: 'number (required) - Monthly basic salary in RM'
      },
      optionalFields: {
        allowances: 'number (default: 0) - Monthly allowances in RM',
        deductions: 'number (default: 0) - Monthly deductions in RM',
        tabungHajiOptIn: 'boolean (default: false) - Whether employee opts for Tabung Haji',
        state: 'string (default: "Selangor") - State for Zakat calculation'
      },
      responseFormat: {
        success: 'boolean',
        data: {
          grossSalary: 'number',
          epfEmployee: 'number',
          epfEmployer: 'number',
          socsoEmployee: 'number',
          socsoEmployer: 'number',
          eisAmount: 'number',
          tabungHajiAmount: 'number',
          taxAmount: 'number',
          zakatAmount: 'number',
          netSalary: 'number',
          alerts: 'array'
        },
        processingTime: 'number',
        agentUsed: 'string',
        confidence: 'number'
      },
      exampleRequest: {
        basicSalary: 3000,
        allowances: 500,
        deductions: 100,
        tabungHajiOptIn: true,
        state: 'Selangor'
      }
    }

    return NextResponse.json(example)

  } catch (error) {
    console.error('Compliance API info error:', error)
    return NextResponse.json(
      { error: 'Failed to get API information' },
      { status: 500 }
    )
  }
}
