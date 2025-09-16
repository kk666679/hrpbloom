import { AIBaseAgent } from './ai-agents'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class LDAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'ld',
      type: AIAgentType.LD,
      capabilities: [
        {
          name: 'learning_path_recommendation',
          description: 'Recommend personalized learning and development paths',
          inputSchema: {
            employeeProfile: 'object',
            skillsGap: 'object',
            careerGoals: 'object'
          },
          outputSchema: {
            learningPaths: 'array',
            recommendedCourses: 'array',
            timelines: 'object'
          }
        },
        {
          name: 'training_needs_analysis',
          description: 'Analyze training needs based on performance and feedback',
          inputSchema: {
            performanceData: 'object',
            feedbackData: 'object',
            companyGoals: 'object'
          },
          outputSchema: {
            trainingNeeds: 'array',
            priorityAreas: 'array',
            recommendations: 'array'
          }
        },
        {
          name: 'course_content_generation',
          description: 'Generate course content outlines and materials',
          inputSchema: {
            topic: 'string',
            audience: 'string',
            learningObjectives: 'array'
          },
          outputSchema: {
            courseOutline: 'string',
            materials: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.3,
      maxTokens: 1200,
      systemPrompt: 'You are the Learning & Development (LD) Agent for a Malaysian HRMS system. Your role focuses on employee training and development:\n\n- Personalized learning path recommendations\n- Training needs analysis\n- Course content generation\n- Skills gap analysis\n- Career development support\n- Compliance with Malaysian training regulations\n- Support for Bahasa Malaysia and English learning materials.',
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
        case 'learning_path':
          return await this.handleLearningPathRecommendation(task.input)
        case 'training_needs':
          return await this.handleTrainingNeedsAnalysis(task.input)
        case 'course_content':
          return await this.handleCourseContentGeneration(task.input)
        default:
          throw new Error('Unsupported task type: ' + (task.input.analysisType || task.input.generationType))
      }
    } catch (error) {
      throw new Error('LD processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handleLearningPathRecommendation(input: any): Promise<AgentResponse> {
    const { employeeProfile, skillsGap, careerGoals } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Recommend personalized learning paths for:\n\nEmployee Profile: ' + JSON.stringify(employeeProfile, null, 2) + '\nSkills Gap: ' + JSON.stringify(skillsGap, null, 2) + '\nCareer Goals: ' + JSON.stringify(careerGoals, null, 2) + '\n\nProvide learning paths, recommended courses, and timelines.',
        timestamp: new Date()
      }
    ]

    const schema = {
      learningPaths: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            pathName: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'string' }
          }
        }
      },
      recommendedCourses: {
        type: 'array',
        items: { type: 'string' }
      },
      timelines: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.3,
      maxTokens: 1000
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

  private async handleTrainingNeedsAnalysis(input: any): Promise<AgentResponse> {
    const { performanceData, feedbackData, companyGoals } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Analyze training needs based on:\n\nPerformance Data: ' + JSON.stringify(performanceData, null, 2) + '\nFeedback Data: ' + JSON.stringify(feedbackData, null, 2) + '\nCompany Goals: ' + JSON.stringify(companyGoals, null, 2) + '\n\nProvide training needs, priority areas, and recommendations.',
        timestamp: new Date()
      }
    ]

    const schema = {
      trainingNeeds: {
        type: 'array',
        items: { type: 'string' }
      },
      priorityAreas: {
        type: 'array',
        items: { type: 'string' }
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
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

  private async handleCourseContentGeneration(input: any): Promise<AgentResponse> {
    const { topic, audience, learningObjectives } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Generate course content for:\n\nTopic: ' + topic + '\nAudience: ' + audience + '\nLearning Objectives: ' + JSON.stringify(learningObjectives, null, 2) + '\n\nProvide course outline and materials.',
        timestamp: new Date()
      }
    ]

    const schema = {
      courseOutline: { type: 'string' },
      materials: {
        type: 'array',
        items: { type: 'string' }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.4,
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
}
