import { AIBaseAgent } from './ai-base-agent'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class TAAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'ta',
      type: AIAgentType.TA,
      capabilities: [
        {
          name: 'job_description_creation',
          description: 'Create comprehensive job descriptions and requirements',
          inputSchema: {
            position: 'string',
            department: 'string',
            requirements: 'object',
            companyInfo: 'object'
          },
          outputSchema: {
            jobDescription: 'string',
            requirements: 'array',
            responsibilities: 'array'
          }
        },
        {
          name: 'candidate_screening',
          description: 'Screen and rank candidates based on job requirements',
          inputSchema: {
            candidates: 'array',
            jobRequirements: 'object',
            screeningCriteria: 'array'
          },
          outputSchema: {
            rankedCandidates: 'array',
            screeningReport: 'object',
            recommendations: 'array'
          }
        },
        {
          name: 'interview_question_generation',
          description: 'Generate relevant interview questions for positions',
          inputSchema: {
            position: 'string',
            level: 'string',
            skills: 'array',
            experience: 'string'
          },
          outputSchema: {
            technicalQuestions: 'array',
            behavioralQuestions: 'array',
            situationalQuestions: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.3,
      maxTokens: 1200,
      systemPrompt: 'You are the Talent Acquisition (TA) Agent for a Malaysian HRMS system. Your role focuses on recruitment and hiring processes:\n\n- Job description creation and optimization\n- Candidate sourcing and screening\n- Interview question generation\n- Diversity hiring initiatives\n- Employer branding support\n- Compliance with Malaysian employment laws\n- Candidate experience management\n\nYou must ensure fair hiring practices and compliance with Malaysian labor regulations while supporting both Bahasa Malaysia and English recruitment processes.',
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
        case 'job_description':
          return await this.handleJobDescriptionCreation(task.input)
        case 'candidate_screening':
          return await this.handleCandidateScreening(task.input)
        case 'interview_questions':
          return await this.handleInterviewQuestionGeneration(task.input)
        default:
          throw new Error('Unsupported task type: ' + (task.input.analysisType || task.input.generationType))
      }
    } catch (error) {
      throw new Error('TA processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handleJobDescriptionCreation(input: any): Promise<AgentResponse> {
    const { position, department, requirements, companyInfo } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Create a comprehensive job description for:\n\nPosition: ' + position + '\nDepartment: ' + department + '\nRequirements: ' + JSON.stringify(requirements, null, 2) + '\nCompany Info: ' + JSON.stringify(companyInfo, null, 2) + '\n\nGenerate an attractive and comprehensive job description suitable for Malaysian job market.',
        timestamp: new Date()
      }
    ]

    const schema = {
      jobDescription: { type: 'string' },
      requirements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            items: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      responsibilities: {
        type: 'array',
        items: { type: 'string' }
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

  private async handleCandidateScreening(input: any): Promise<AgentResponse> {
    const { candidates, jobRequirements, screeningCriteria } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Screen and rank candidates for the position:\n\nCandidates: ' + JSON.stringify(candidates, null, 2) + '\nJob Requirements: ' + JSON.stringify(jobRequirements, null, 2) + '\nScreening Criteria: ' + JSON.stringify(screeningCriteria, null, 2) + '\n\nRank candidates and provide detailed screening report.',
        timestamp: new Date()
      }
    ]

    const schema = {
      rankedCandidates: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            candidateId: { type: 'string' },
            score: { type: 'number', minimum: 0, maximum: 100 },
            strengths: { type: 'array', items: { type: 'string' } },
            gaps: { type: 'array', items: { type: 'string' } },
            recommendation: { type: 'string' }
          }
        }
      },
      screeningReport: {
        type: 'object',
        properties: {
          totalCandidates: { type: 'number' },
          qualifiedCandidates: { type: 'number' },
          averageScore: { type: 'number' },
          topSkills: { type: 'array', items: { type: 'string' } }
        }
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
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

  private async handleInterviewQuestionGeneration(input: any): Promise<AgentResponse> {
    const { position, level, skills, experience } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Generate interview questions for:\n\nPosition: ' + position + '\nLevel: ' + level + '\nSkills: ' + JSON.stringify(skills, null, 2) + '\nExperience: ' + experience + '\n\nCreate relevant technical, behavioral, and situational questions.',
        timestamp: new Date()
      }
    ]

    const schema = {
      technicalQuestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            skill: { type: 'string' },
            difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] }
          }
        }
      },
      behavioralQuestions: {
        type: 'array',
        items: { type: 'string' }
      },
      situationalQuestions: {
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

  // Public method to match a candidate to a job
  async matchCandidateToJob(candidate: any, job: any): Promise<{ score: number; reasons: string[] }> {
    // Simple matching logic for now
    const candidateSkills = candidate.skills ? candidate.skills.toLowerCase().split(',').map((s: string) => s.trim()) : [];
    const jobRequirements = job.requirements ? job.requirements.toLowerCase() : '';
    const jobDescription = job.description ? job.description.toLowerCase() : '';

    let score = 0;
    const reasons: string[] = [];

    // Check skills match
    const matchingSkills = candidateSkills.filter((skill: string) =>
      jobRequirements.includes(skill) || jobDescription.includes(skill)
    );

    if (matchingSkills.length > 0) {
      score += matchingSkills.length * 20; // 20 points per matching skill
      reasons.push(`Matching skills: ${matchingSkills.join(', ')}`);
    }

    // Check experience
    if (candidate.experienceYears && candidate.experienceYears > 0) {
      score += Math.min(candidate.experienceYears * 5, 30); // Up to 30 points for experience
      reasons.push(`Experience: ${candidate.experienceYears} years`);
    }

    // Location match
    if (candidate.address && job.location && candidate.address.toLowerCase().includes(job.location.toLowerCase())) {
      score += 10;
      reasons.push('Location match');
    }

    // Department match
    if (candidate.department && job.department && candidate.department.toLowerCase() === job.department.toLowerCase()) {
      score += 15;
      reasons.push('Department match');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    if (score === 0) {
      reasons.push('No significant matches found');
    }

    return { score, reasons };
  }
}
