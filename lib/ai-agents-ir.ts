import {
  AgentTask,
  AgentResponse,
  AgentConfig,
  AgentContext,
  AgentTaskType,
  TaskPriority,
  AIAgentType,
  AgentStatus,
  AgentMetrics,
  ConversationMessage,
  AgentRecommendation
} from '@/types/ai-agents'
import { generateCompletion, generateStructuredCompletion, AIModel, AI_MODELS } from './openai-client'
import { prisma } from './db'
import { AIBaseAgent } from './ai-base-agent'

// IR Agent - Handles Industrial Relations, disputes, legal precedents
export class IRAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'ir',
      type: AIAgentType.IR,
      capabilities: [
        {
          name: 'dispute_prediction',
          description: 'Predict potential industrial disputes based on employee data and patterns',
          inputSchema: {
            employeeData: 'object',
            companyData: 'object',
            historicalIncidents: 'array'
          },
          outputSchema: {
            riskLevel: 'string',
            predictedIssues: 'array',
            recommendations: 'array',
            confidence: 'number'
          }
        },
        {
          name: 'legal_precedent_search',
          description: 'Search and analyze legal precedents for IR cases',
          inputSchema: {
            caseType: 'string',
            keywords: 'array',
            jurisdiction: 'string'
          },
          outputSchema: {
            relevantCases: 'array',
            analysis: 'string',
            recommendations: 'array',
            confidence: 'number'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.3,
      maxTokens: 1200,
      systemPrompt: `You are the Industrial Relations (IR) Agent for a Malaysian HRMS system. Your role focuses on managing workplace disputes, legal compliance, and industrial relations:

- Predict potential industrial disputes based on employee data patterns
- Search and analyze legal precedents for IR cases
- Provide guidance on dispute resolution and mediation
- Ensure compliance with Malaysian labor laws and regulations
- Support both Bahasa Malaysia and English communications

You must be knowledgeable about Malaysian employment law, industrial relations practices, and culturally sensitive to workplace dynamics.`,
      isActive: true,
      priority: 2
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.DISPUTE_PREDICT,
      AgentTaskType.ANALYZE
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.type) {
        case AgentTaskType.DISPUTE_PREDICT:
          return await this.handleDisputePrediction(task.input)
        case AgentTaskType.ANALYZE:
          if (task.input.analysisType === 'legal_precedent') {
            return await this.handleLegalPrecedentSearch(task.input)
          }
          break
      }
      throw new Error(`Unsupported task type or analysis type: ${task.type}`)
    } catch (error) {
      throw new Error(`IR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handleDisputePrediction(input: any): Promise<AgentResponse> {
    const { employeeData, companyData, historicalIncidents } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: `Predict potential industrial disputes based on the following data:

Employee Data: ${JSON.stringify(employeeData, null, 2)}
Company Data: ${JSON.stringify(companyData, null, 2)}
Historical Incidents: ${JSON.stringify(historicalIncidents, null, 2)}

Assess risk level, predict potential issues, and provide recommendations.`,
        timestamp: new Date()
      }
    ]

    const schema = {
      riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
      predictedIssues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            issue: { type: 'string' },
            likelihood: { type: 'number', minimum: 0, maximum: 1 },
            timeline: { type: 'string' },
            impact: { type: 'string' }
          }
        }
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      },
      confidence: { type: 'number', minimum: 0, maximum: 1 }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 1000
    }) as any

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis,
      confidence: analysis.confidence || 0.8,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleLegalPrecedentSearch(input: any): Promise<AgentResponse> {
    const { caseType, keywords, jurisdiction = 'Malaysia' } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: `Search and analyze legal precedents for the following IR case:

Case Type: ${caseType}
Keywords: ${JSON.stringify(keywords, null, 2)}
Jurisdiction: ${jurisdiction}

Provide relevant cases, analysis, and recommendations.`,
        timestamp: new Date()
      }
    ]

    const schema = {
      relevantCases: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            caseName: { type: 'string' },
            citation: { type: 'string' },
            summary: { type: 'string' },
            relevance: { type: 'number', minimum: 0, maximum: 1 },
            outcome: { type: 'string' }
          }
        }
      },
      analysis: { type: 'string' },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      },
      confidence: { type: 'number', minimum: 0, maximum: 1 }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 1000
    }) as any

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis,
      confidence: analysis.confidence || 0.8,
      processingTime: 0,
      completedAt: new Date()
    }
  }
}
