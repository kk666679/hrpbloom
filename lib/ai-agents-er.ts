import { AIBaseAgent } from './ai-agents'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class ERAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'er',
      type: AIAgentType.ER,
      capabilities: [
        {
          name: 'sentiment_analysis',
          description: 'Analyze employee sentiment from surveys, feedback, and communications',
          inputSchema: {
            textData: 'array',
            context: 'object',
            language: 'string'
          },
          outputSchema: {
            overallSentiment: 'string',
            sentimentScore: 'number',
            keyThemes: 'array',
            recommendations: 'array'
          }
        },
        {
          name: 'dei_monitoring',
          description: 'Monitor diversity, equity, and inclusion metrics',
          inputSchema: {
            employeeDemographics: 'object',
            policies: 'object',
            incidents: 'array'
          },
          outputSchema: {
            deiScore: 'number',
            gaps: 'array',
            recommendations: 'array',
            riskAreas: 'array'
          }
        },
        {
          name: 'case_escalation_prediction',
          description: 'Predict potential ER case escalations',
          inputSchema: {
            employeeData: 'object',
            incidentHistory: 'array',
            communicationPatterns: 'array'
          },
          outputSchema: {
            escalationRisk: 'string',
            predictedTimeline: 'string',
            preventiveActions: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.3,
      maxTokens: 1200,
      systemPrompt: `You are the Employee Relations (ER) Agent for a Malaysian HRMS system. Your role focuses on employee experience, workplace culture, and relationship management:

- Sentiment analysis of employee feedback and communications (supporting BM/EN)
- Diversity, Equity, and Inclusion (DEI) monitoring and recommendations
- Workplace culture health assessment
- Conflict resolution and mediation guidance
- Employee engagement analysis
- Harassment and discrimination case handling
- Performance feedback analysis
- Career development counseling

You must be culturally sensitive to Malaysian workplace dynamics and support both Bahasa Malaysia and English communications.`,
      isActive: true,
      priority: 3
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.SENTIMENT_ANALYSIS,
      AgentTaskType.ANALYZE
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.type) {
        case AgentTaskType.SENTIMENT_ANALYSIS:
          return await this.handleSentimentAnalysis(task.input)
        case AgentTaskType.ANALYZE:
          if (task.input.analysisType === 'dei') {
            return await this.handleDEIMonitoring(task.input)
          } else if (task.input.analysisType === 'escalation') {
            return await this.handleCaseEscalationPrediction(task.input)
          }
          break
      }
      throw new Error(`Unsupported task type or analysis type: ${task.type}`)
    } catch (error) {
      throw new Error(`ER processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handleSentimentAnalysis(input: any): Promise<AgentResponse> {
    const { textData, context, language = 'en' } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: `Analyze the sentiment of the following employee communications in ${language === 'ms' ? 'Bahasa Malaysia' : 'English'}:

Communications: ${JSON.stringify(textData, null, 2)}
Context: ${JSON.stringify(context, null, 2)}

Provide:
1. Overall sentiment (POSITIVE/NEUTRAL/NEGATIVE)
2. Sentiment score (-1 to 1)
3. Key themes and topics
4. Actionable recommendations for improving employee satisfaction`,
        timestamp: new Date()
      }
    ]

    const schema = {
      overallSentiment: { type: 'string', enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] },
      sentimentScore: { type: 'number', minimum: -1, maximum: 1 },
      keyThemes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            theme: { type: 'string' },
            sentiment: { type: 'string' },
            frequency: { type: 'number' },
            examples: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 800
    }) as any

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis,
      confidence: 0.8,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleDEIMonitoring(input: any): Promise<AgentResponse> {
    const { employeeDemographics, policies, incidents } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: `Analyze the following data for Diversity, Equity, and Inclusion (DEI) metrics:

Employee Demographics: ${JSON.stringify(employeeDemographics, null, 2)}
Company Policies: ${JSON.stringify(policies, null, 2)}
Reported Incidents: ${JSON.stringify(incidents, null, 2)}

Provide DEI assessment and recommendations for improvement.`,
        timestamp: new Date()
      }
    ]

    const schema = {
      deiScore: { type: 'number', minimum: 0, maximum: 100 },
      gaps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            area: { type: 'string' },
            severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            description: { type: 'string' }
          }
        }
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      },
      riskAreas: {
        type: 'array',
        items: { type: 'string' }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 800
    }) as any

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis,
      confidence: 0.75,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleCaseEscalationPrediction(input: any): Promise<AgentResponse> {
    const { employeeData, incidentHistory, communicationPatterns } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: `Predict the likelihood and timeline of ER case escalation based on:

Employee Data: ${JSON.stringify(employeeData, null, 2)}
Incident History: ${JSON.stringify(incidentHistory, null, 2)}
Communication Patterns: ${JSON.stringify(communicationPatterns, null, 2)}

Assess escalation risk and recommend preventive actions.`,
        timestamp: new Date()
      }
    ]

    const schema = {
      escalationRisk: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
      predictedTimeline: { type: 'string' },
      preventiveActions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            rationale: { type: 'string' }
          }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 600
    }) as any

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis,
      confidence: 0.7,
      processingTime: 0,
      completedAt: new Date()
    }
  }
}
