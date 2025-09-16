import { AIBaseAgent } from './ai-agents'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class CBAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'cb',
      type: AIAgentType.CB,
      capabilities: [
        {
          name: 'compensation_analysis',
          description: 'Analyze compensation structures and market competitiveness',
          inputSchema: {
            employeeData: 'object',
            marketData: 'object',
            companyPolicies: 'object'
          },
          outputSchema: {
            competitivenessScore: 'number',
            recommendations: 'array',
            riskAreas: 'array'
          }
        },
        {
          name: 'benefits_optimization',
          description: 'Optimize employee benefits packages',
          inputSchema: {
            currentBenefits: 'object',
            employeeDemographics: 'object',
            costConstraints: 'object'
          },
          outputSchema: {
            optimizedPackage: 'object',
            costSavings: 'number',
            employeeSatisfaction: 'number'
          }
        },
        {
          name: 'salary_benchmarking',
          description: 'Benchmark salaries against market standards',
          inputSchema: {
            position: 'string',
            experience: 'number',
            location: 'string',
            industry: 'string'
          },
          outputSchema: {
            marketRange: 'object',
            recommendedSalary: 'number',
            justification: 'string'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.1,
      maxTokens: 1000,
      systemPrompt: 'You are the Compensation & Benefits (CB) Agent for a Malaysian HRMS system. Your role focuses on designing and managing competitive compensation and benefits programs:\n\n- Salary structure design and benchmarking\n- Benefits package optimization\n- Incentive and bonus program design\n- Cost-benefit analysis of compensation programs\n- Compliance with Malaysian employment laws\n- Market competitiveness analysis\n- Employee retention through compensation strategies\n\nYou must ensure all recommendations comply with Malaysian labor regulations and consider local market conditions.',
      isActive: true,
      priority: 4
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.ANALYZE
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.input.analysisType) {
        case 'compensation':
          return await this.handleCompensationAnalysis(task.input)
        case 'benefits':
          return await this.handleBenefitsOptimization(task.input)
        case 'benchmarking':
          return await this.handleSalaryBenchmarking(task.input)
        default:
          throw new Error('Unsupported analysis type: ' + task.input.analysisType)
      }
    } catch (error) {
      throw new Error('CB processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handleCompensationAnalysis(input: any): Promise<AgentResponse> {
    const { employeeData, marketData, companyPolicies } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Analyze the following compensation structure for market competitiveness:\n\nEmployee Data: ' + JSON.stringify(employeeData, null, 2) + '\nMarket Data: ' + JSON.stringify(marketData, null, 2) + '\nCompany Policies: ' + JSON.stringify(companyPolicies, null, 2) + '\n\nProvide competitiveness assessment and recommendations for improvement.',
        timestamp: new Date()
      }
    ]

    const schema = {
      competitivenessScore: { type: 'number', minimum: 0, maximum: 100 },
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            impact: { type: 'string' },
            cost: { type: 'string' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] }
          }
        }
      },
      riskAreas: {
        type: 'array',
        items: { type: 'string' }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.1,
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

  private async handleBenefitsOptimization(input: any): Promise<AgentResponse> {
    const { currentBenefits, employeeDemographics, costConstraints } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Optimize the employee benefits package based on:\n\nCurrent Benefits: ' + JSON.stringify(currentBenefits, null, 2) + '\nEmployee Demographics: ' + JSON.stringify(employeeDemographics, null, 2) + '\nCost Constraints: ' + JSON.stringify(costConstraints, null, 2) + '\n\nProvide optimized benefits package with cost analysis.',
        timestamp: new Date()
      }
    ]

    const schema = {
      optimizedPackage: {
        type: 'object',
        properties: {
          mandatoryBenefits: { type: 'array', items: { type: 'string' } },
          optionalBenefits: { type: 'array', items: { type: 'string' } },
          wellnessPrograms: { type: 'array', items: { type: 'string' } },
          retirementBenefits: { type: 'array', items: { type: 'string' } }
        }
      },
      costSavings: { type: 'number' },
      employeeSatisfaction: { type: 'number', minimum: 0, maximum: 100 }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.1,
      maxTokens: 600
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

  private async handleSalaryBenchmarking(input: any): Promise<AgentResponse> {
    const { position, experience, location, industry } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Benchmark salary for position:\n\nPosition: ' + position + '\nExperience: ' + experience + ' years\nLocation: ' + location + '\nIndustry: ' + industry + '\n\nProvide market salary range and recommendations for Malaysian market.',
        timestamp: new Date()
      }
    ]

    const schema = {
      marketRange: {
        type: 'object',
        properties: {
          minimum: { type: 'number' },
          median: { type: 'number' },
          maximum: { type: 'number' },
          currency: { type: 'string' }
        }
      },
      recommendedSalary: { type: 'number' },
      justification: { type: 'string' }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.1,
      maxTokens: 400
    })

    return {
      taskId: '',
      agentId: this.config.name,
      success: true,
      output: analysis as Record<string, any>,
      confidence: 0.9,
      processingTime: 0,
      completedAt: new Date()
    }
  }
}
