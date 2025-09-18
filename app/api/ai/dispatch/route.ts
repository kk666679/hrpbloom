export const runtime = "nodejs"
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { agentRegistry, createTask, createContext } from '@/lib/ai-agents'
import { AgentTaskType } from '@/lib/ai-agents'
import { prisma } from '@/lib/db'
import {
  TaskPriority,
  OrchestrationRequest,
  OrchestrationResponse
} from '@/types/ai-agents'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as any
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const user = session.user

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
    if (!Object.values(AgentTaskType as any).includes(taskType)) {
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
      userId: parseInt(user.id),
      metadata
    })

    // Load existing conversation for conversational tasks
    let conversationHistory: any[] = []
    let conversationId: number | null = null

    if ([(AgentTaskType as any).CHAT, (AgentTaskType as any).QUESTION_ANSWER].includes(taskType)) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          userId: parseInt(user.id),
          agent: {
            name: 'chatbot' // Assuming chatbot handles conversational tasks
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      if (existingConversation) {
        conversationHistory = existingConversation.messages as any[]
        conversationId = existingConversation.id
      }
    }

    // Create context with conversation history
    const context = createContext(
      parseInt(user.id),
      parseInt(user.companyId),
      {
        role: user.role,
        sessionId: `api_${Date.now()}`,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }))
      }
    )

      // Execute task through coordinator
      const response = await agentRegistry.executeTask(task, context)

    // Save conversation for conversational tasks
    if ([(AgentTaskType as any).CHAT, (AgentTaskType as any).QUESTION_ANSWER].includes(taskType)) {
      // Add user message to conversation
      const userMessage = {
        role: 'user',
        content: typeof input === 'string' ? input : JSON.stringify(input),
        timestamp: new Date().toISOString()
      }
      conversationHistory.push(userMessage)

      // Add assistant response to conversation
      const assistantMessage = {
        role: 'assistant',
        content: response.output.response || JSON.stringify(response.output),
        timestamp: new Date().toISOString()
      }
      conversationHistory.push(assistantMessage)

      // Save or update conversation in DB
      const chatbotAgent = await prisma.aIAgent.findFirst({
        where: { name: 'chatbot' }
      })

      if (chatbotAgent) {
        if (conversationId) {
          // Update existing conversation
          await prisma.conversation.update({
            where: { id: conversationId },
            data: {
              messages: conversationHistory,
              updatedAt: new Date()
            }
          })
        } else {
          // Create new conversation
          await prisma.conversation.create({
            data: {
              userId: parseInt(user.id),
              agentId: chatbotAgent.id,
              messages: conversationHistory
            }
          })
        }
      }
    }

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
    const session = await getServerSession(authOptions) as any
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get system health and available agents
    const systemHealth = { status: 'healthy', uptime: Date.now() }
    const availableAgents: any[] = [] // TODO: implement getAllAgents

    return NextResponse.json({
      systemHealth,
      availableAgents,
      coordinator: {
        name: 'coordinator',
        type: 'COORDINATOR',
        registeredAgents: [] // TODO: implement getRegisteredAgents
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
