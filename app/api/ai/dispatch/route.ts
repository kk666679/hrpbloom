export const runtime = "nodejs"
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'
import { agentRegistry, createTask, createContext } from '@/lib/ai-agents'
import { 
  AgentTaskType, 
  TaskPriority, 
  OrchestrationRequest, 
  OrchestrationResponse 
} from '@/types/ai-agents'

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
    const { taskType, input, priority, metadata, preferredAgents, timeout } = body

    // Validate required fields
    if (!taskType || !input) {
      return NextResponse.json(
        { error: 'Missing required fields: taskType and input' },
        { status: 400 }
      )
    }

    // Validate task type
    if (!Object.values(AgentTaskType).includes(taskType)) {
      return NextResponse.json(
        { error: `Invalid task type: ${taskType}` },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    try {
      // Create task
      const task = createTask(taskType as AgentTaskType, input, {
        priority: priority || TaskPriority.MEDIUM,
        userId: parseInt(session.user.id),
        metadata
      })

      // Create context
      const context = createContext(
        parseInt(session.user.id),
        parseInt(session.user.companyId),
        {
          role: session.user.role,
          sessionId: `api_${Date.now()}`
        }
      )

      // Execute task through coordinator
      const response = await agentRegistry.executeTask(task, context)

      const processingTime = Date.now() - startTime

      const orchestrationResponse: OrchestrationResponse = {
        success: response.success,
        assignedAgent: response.output.routingDecision?.selectedAgent || 'coordinator',
        response,
        processingTime,
        fallbackUsed: false
      }

      return NextResponse.json(orchestrationResponse)

    } catch (executionError) {
      console.error('Task execution error:', executionError)
      
      const processingTime = Date.now() - startTime
      
      const orchestrationResponse: OrchestrationResponse = {
        success: false,
        error: executionError instanceof Error ? executionError.message : 'Task execution failed',
        processingTime,
        fallbackUsed: false
      }

      return NextResponse.json(orchestrationResponse, { status: 500 })
    }

  } catch (error) {
    console.error('AI dispatch error:', error)
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

    // Get system health and available agents
    const systemHealth = await agentRegistry.getSystemHealth()
    const availableAgents = agentRegistry.getAllAgents().map(agent => ({
      name: agent.config.name,
      type: agent.config.type,
      isActive: agent.config.isActive,
      capabilities: agent.config.capabilities.map(cap => cap.name),
      status: agent.getStatus()
    }))

    return NextResponse.json({
      systemHealth,
      availableAgents,
      coordinator: {
        name: 'coordinator',
        type: 'COORDINATOR',
        registeredAgents: agentRegistry.getCoordinator().getRegisteredAgents()
      }
    })

  } catch (error) {
    console.error('AI system status error:', error)
    return NextResponse.json(
      { error: 'Failed to get system status' },
      { status: 500 }
    )
  }
}
