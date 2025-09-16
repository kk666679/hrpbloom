import { AIBaseAgent } from './ai-agents'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class PerformanceAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'performance',
      type: AIAgentType.PERFORMANCE,
      capabilities: [
        {
          name: 'performance_review_analysis',
          description: 'Analyze performance review data and provide insights',
          inputSchema: {
            reviewData: 'object',
            employeeData: 'object',
            kpis: 'array'
          },
          outputSchema: {
            performanceScore: 'number',
            strengths: 'array',
            improvementAreas: 'array',
            recommendations: 'array'
          }
        },
        {
          name: 'goal_setting_assistance',
          description: 'Help set SMART goals and performance objectives',
          inputSchema: {
            employeeRole: 'string',
            currentPerformance: 'object',
            companyObjectives: 'object'
          },
          outputSchema: {
            smartGoals: 'array',
            kpis: 'array',
            timelines: 'object'
          }
        },
        {
          name: 'feedback_analysis',
          description: 'Analyze 360-degree feedback and performance data',
          inputSchema: {
            feedbackData: 'array',
            performanceMetrics: 'object',
            peerReviews: 'array'
          },
          outputSchema: {
            feedbackSummary: 'object',
            developmentAreas: 'array',
            actionItems: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.2,
      maxTokens: 1000,
      systemPrompt: 'You are the Performance Management Agent for a Malaysian HRMS system. Your role focuses on performance evaluation and development:\n\n- Performance review analysis and scoring\n- SMART goal setting assistance\n- 360-degree feedback analysis\n- Development planning\n- Performance improvement recommendations\n- Career progression guidance\n- Compliance with Malaysian performance management practices.',
      isActive: true,
      priority: 4
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.ANALYZE,
      AgentTaskType.GENERATE
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.input.analysisType || task.input.generationType) {
        case 'performance_review':
          return await this.handlePerformanceReviewAnalysis(task.input)
        case 'goal_setting':
          return await this.handleGoalSettingAssistance(task.input)
        case 'feedback_analysis':
          return await this.handleFeedbackAnalysis(task.input)
        default:
          throw new Error('Unsupported task type: ' + (task.input.analysisType || task.input.generationType))
      }
    } catch (error) {
      throw new Error('Performance processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handlePerformanceReviewAnalysis(input: any): Promise<AgentResponse> {
    const { reviewData, employeeData, kpis } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Analyze performance review data:\n\nReview Data: ' + JSON.stringify(reviewData, null, 2) + '\nEmployee Data: ' + JSON.stringify(employeeData, null, 2) + '\nKPIs: ' + JSON.stringify(kpis, null, 2) + '\n\nProvide performance score, strengths, improvement areas, and recommendations.',
        timestamp: new Date()
      }
    ]

    const schema = {
      performanceScore: { type: 'number', minimum: 0, maximum: 100 },
      strengths: {
        type: 'array',
        items: { type: 'string' }
      },
      improvementAreas: {
        type: 'array',
        items: { type: 'string' }
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
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
      confidence: 0.85,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleGoalSettingAssistance(input: any): Promise<AgentResponse> {
    const { employeeRole, currentPerformance, companyObjectives } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Help set SMART goals for:\n\nEmployee Role: ' + employeeRole + '\nCurrent Performance: ' + JSON.stringify(currentPerformance, null, 2) + '\nCompany Objectives: ' + JSON.stringify(companyObjectives, null, 2) + '\n\nProvide SMART goals, KPIs, and timelines.',
        timestamp: new Date()
      }
    ]

    const schema = {
      smartGoals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            goal: { type: 'string' },
            specific: { type: 'string' },
            measurable: { type: 'string' },
            achievable: { type: 'string' },
            relevant: { type: 'string' },
            timeBound: { type: 'string' }
          }
        }
      },
      kpis: {
        type: 'array',
        items: { type: 'string' }
      },
      timelines: {
        type: 'object',
        properties: {
          quarterly: { type: 'array', items: { type: 'string' } },
          annual: { type: 'array', items: { type: 'string' } }
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

  private async handleFeedbackAnalysis(input: any): Promise<AgentResponse> {
    const { feedbackData, performanceMetrics, peerReviews } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Analyze 360-degree feedback:\n\nFeedback Data: ' + JSON.stringify(feedbackData, null, 2) + '\nPerformance Metrics: ' + JSON.stringify(performanceMetrics, null, 2) + '\nPeer Reviews: ' + JSON.stringify(peerReviews, null, 2) + '\n\nProvide feedback summary, development areas, and action items.',
        timestamp: new Date()
      }
    ]

    const schema = {
      feedbackSummary: {
        type: 'object',
        properties: {
          overallRating: { type: 'number', minimum: 0, maximum: 5 },
          positiveThemes: { type: 'array', items: { type: 'string' } },
          constructiveThemes: { type: 'array', items: { type: 'string' } }
        }
      },
      developmentAreas: {
        type: 'array',
        items: { type: 'string' }
      },
      actionItems: {
        type: 'array',
        items: { type: 'string' }
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
}
