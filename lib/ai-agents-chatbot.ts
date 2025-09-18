import { AIBaseAgent } from './ai-base-agent'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class ChatbotAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'chatbot',
      type: AIAgentType.CHATBOT,
      capabilities: [
        {
          name: 'hr_query_response',
          description: 'Respond to HR-related queries and provide information',
          inputSchema: {
            query: 'string',
            context: 'object',
            userRole: 'string'
          },
          outputSchema: {
            response: 'string',
            confidence: 'number',
            followUpQuestions: 'array',
            actions: 'array'
          }
        },
        {
          name: 'policy_explanation',
          description: 'Explain company policies and procedures',
          inputSchema: {
            policyTopic: 'string',
            userContext: 'object'
          },
          outputSchema: {
            explanation: 'string',
            relevantSections: 'array',
            additionalResources: 'array'
          }
        },
        {
          name: 'procedural_guidance',
          description: 'Guide users through HR processes and procedures',
          inputSchema: {
            processType: 'string',
            userSituation: 'object'
          },
          outputSchema: {
            steps: 'array',
            requiredDocuments: 'array',
            timeline: 'string',
            contacts: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: 'You are the HR Chatbot Agent for a Malaysian HRMS system. Your role is to assist employees and managers with HR-related queries and information:\n\n- Provide accurate HR information and policy explanations\n- Guide users through HR processes and procedures\n- Support both Bahasa Malaysia and English communications\n- Maintain confidentiality and data privacy\n- Escalate complex issues to appropriate HR personnel\n- Be culturally sensitive to Malaysian workplace norms\n- Direct users to relevant resources and contacts.',
      isActive: true,
      priority: 2
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.CHAT,
      AgentTaskType.QUESTION_ANSWER
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.input.chatType || task.input.queryType) {
        case 'hr_query_response':
          return await this.handleHRQueryResponse(task.input, context)
        case 'policy_explanation':
          return await this.handlePolicyExplanation(task.input)
        case 'procedural_guidance':
          return await this.handleProceduralGuidance(task.input)
        default:
          return await this.handleGeneralChat(task.input, context)
      }
    } catch (error) {
      throw new Error('Chatbot processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handleHRQueryResponse(input: any, context?: AgentContext): Promise<AgentResponse> {
    const { query, userRole } = input

    const conversationHistory = context?.conversationHistory || []
    const messages: ConversationMessage[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: 'HR Query: ' + query + '\nUser Role: ' + userRole + '\n\nProvide a helpful response to this HR-related query.',
        timestamp: new Date()
      }
    ]

    const schema = {
      response: { type: 'string' },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
      followUpQuestions: {
        type: 'array',
        items: { type: 'string' }
      },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            type: { type: 'string', enum: ['FORM_SUBMISSION', 'DOCUMENT_UPLOAD', 'CONTACT_HR', 'SELF_SERVICE'] }
          }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.3,
      maxTokens: 800
    })

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis as Record<string, any>,
      confidence: 0.8,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handlePolicyExplanation(input: any): Promise<AgentResponse> {
    const { policyTopic, userContext } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Explain this HR policy: ' + policyTopic + '\nUser Context: ' + JSON.stringify(userContext, null, 2) + '\n\nProvide clear explanation of the policy and relevant sections.',
        timestamp: new Date()
      }
    ]

    const schema = {
      explanation: { type: 'string' },
      relevantSections: {
        type: 'array',
        items: { type: 'string' }
      },
      additionalResources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resource: { type: 'string' },
            type: { type: 'string' },
            location: { type: 'string' }
          }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 600
    })

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis as Record<string, any>,
      confidence: 0.85,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleProceduralGuidance(input: any): Promise<AgentResponse> {
    const { processType, userSituation } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Guide through this HR process: ' + processType + '\nUser Situation: ' + JSON.stringify(userSituation, null, 2) + '\n\nProvide step-by-step guidance for this HR process.',
        timestamp: new Date()
      }
    ]

    const schema = {
      steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            step: { type: 'number' },
            description: { type: 'string' },
            required: { type: 'boolean' }
          }
        }
      },
      requiredDocuments: {
        type: 'array',
        items: { type: 'string' }
      },
      timeline: { type: 'string' },
      contacts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            role: { type: 'string' },
            name: { type: 'string' },
            contact: { type: 'string' }
          }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 800
    })

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis as Record<string, any>,
      confidence: 0.8,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleGeneralChat(input: any, context?: AgentContext): Promise<AgentResponse> {
    const { message } = input

    const conversationHistory = context?.conversationHistory || []
    const messages: ConversationMessage[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: message,
        timestamp: new Date()
      }
    ]

    const response = await this.generateResponse(messages, {
      temperature: 0.4,
      maxTokens: 500
    })

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: { response },
      confidence: 0.7,
      processingTime: 0,
      completedAt: new Date()
    }
  }
}
