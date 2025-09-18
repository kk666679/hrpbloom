import { AIBaseAgent } from './ai-base-agent'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class ResumeParserAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'resume_parser',
      type: AIAgentType.RESUME_PARSER,
      capabilities: [
        {
          name: 'resume_parsing',
          description: 'Parse and extract structured data from resume text',
          inputSchema: {
            resumeText: 'string',
            format: 'string'
          },
          outputSchema: {
            personalInfo: 'object',
            experience: 'array',
            education: 'array',
            skills: 'array',
            certifications: 'array'
          }
        },
        {
          name: 'resume_scoring',
          description: 'Score resume against job requirements',
          inputSchema: {
            parsedResume: 'object',
            jobRequirements: 'object'
          },
          outputSchema: {
            matchScore: 'number',
            matchedSkills: 'array',
            missingSkills: 'array',
            recommendations: 'array'
          }
        },
        {
          name: 'resume_optimization',
          description: 'Provide suggestions to optimize resume',
          inputSchema: {
            resumeData: 'object',
            targetJob: 'object'
          },
          outputSchema: {
            suggestions: 'array',
            optimizedSections: 'object'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.1,
      maxTokens: 1500,
      systemPrompt: 'You are the Resume Parser Agent for a Malaysian HRMS system. Your role focuses on parsing and analyzing resumes:\n\n- Extract structured data from resume text\n- Score resumes against job requirements\n- Provide resume optimization suggestions\n- Support both English and Bahasa Malaysia resumes\n- Ensure fair and unbiased parsing\n- Comply with Malaysian data protection laws.',
      isActive: true,
      priority: 3
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.RESUME_PARSE,
      AgentTaskType.ANALYZE
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.input.analysisType || task.input.parseType) {
        case 'resume_parsing':
          return await this.handleResumeParsing(task.input)
        case 'resume_scoring':
          return await this.handleResumeScoring(task.input)
        case 'resume_optimization':
          return await this.handleResumeOptimization(task.input)
        default:
          throw new Error('Unsupported task type: ' + (task.input.analysisType || task.input.parseType))
      }
    } catch (error) {
      throw new Error('Resume Parser processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handleResumeParsing(input: any): Promise<AgentResponse> {
    const { resumeText, format = 'text' } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Parse the following resume text and extract structured information:\n\nResume Text:\n' + resumeText + '\n\nFormat: ' + format + '\n\nExtract personal information, work experience, education, skills, and certifications.',
        timestamp: new Date()
      }
    ]

    const schema = {
      personalInfo: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          location: { type: 'string' },
          linkedin: { type: 'string' }
        }
      },
      experience: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            company: { type: 'string' },
            position: { type: 'string' },
            duration: { type: 'string' },
            responsibilities: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      education: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            institution: { type: 'string' },
            degree: { type: 'string' },
            year: { type: 'string' }
          }
        }
      },
      skills: {
        type: 'array',
        items: { type: 'string' }
      },
      certifications: {
        type: 'array',
        items: { type: 'string' }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.1,
      maxTokens: 1200
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

  private async handleResumeScoring(input: any): Promise<AgentResponse> {
    const { parsedResume, jobRequirements } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Score this resume against job requirements:\n\nParsed Resume: ' + JSON.stringify(parsedResume, null, 2) + '\nJob Requirements: ' + JSON.stringify(jobRequirements, null, 2) + '\n\nProvide match score, matched skills, missing skills, and recommendations.',
        timestamp: new Date()
      }
    ]

    const schema = {
      matchScore: { type: 'number', minimum: 0, maximum: 100 },
      matchedSkills: {
        type: 'array',
        items: { type: 'string' }
      },
      missingSkills: {
        type: 'array',
        items: { type: 'string' }
      },
      recommendations: {
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
      confidence: 0.9,
      processingTime: 0,
      completedAt: new Date()
    }
  }

  private async handleResumeOptimization(input: any): Promise<AgentResponse> {
    const { resumeData, targetJob } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Provide suggestions to optimize this resume for the target job:\n\nResume Data: ' + JSON.stringify(resumeData, null, 2) + '\nTarget Job: ' + JSON.stringify(targetJob, null, 2) + '\n\nProvide optimization suggestions and improved sections.',
        timestamp: new Date()
      }
    ]

    const schema = {
      suggestions: {
        type: 'array',
        items: { type: 'string' }
      },
      optimizedSections: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          experience: { type: 'array', items: { type: 'string' } },
          skills: { type: 'array', items: { type: 'string' } }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.2,
      maxTokens: 1000
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
