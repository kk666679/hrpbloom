import { AIBaseAgent } from './ai-base-agent'
import { AgentConfig, AgentTask, AgentResponse, AgentContext, ConversationMessage, AgentTaskType, AIAgentType } from '@/types/ai-agents'
import { AI_MODELS } from './openai-client'

export class CandidateMatcherAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'candidate_matcher',
      type: AIAgentType.CANDIDATE_MATCHER,
      capabilities: [
        {
          name: 'candidate_job_matching',
          description: 'Match candidates to job openings based on skills and requirements',
          inputSchema: {
            candidates: 'array',
            jobDescription: 'object',
            matchingCriteria: 'object'
          },
          outputSchema: {
            matches: 'array',
            ranking: 'array',
            insights: 'object'
          }
        },
        {
          name: 'skill_gap_analysis',
          description: 'Analyze skill gaps between candidates and job requirements',
          inputSchema: {
            candidateProfile: 'object',
            jobRequirements: 'object'
          },
          outputSchema: {
            skillGaps: 'array',
            matchPercentage: 'number',
            trainingRecommendations: 'array'
          }
        },
        {
          name: 'diversity_matching',
          description: 'Ensure diverse candidate matching for inclusive hiring',
          inputSchema: {
            candidatePool: 'array',
            diversityTargets: 'object',
            jobPosition: 'object'
          },
          outputSchema: {
            diversityScore: 'number',
            recommendations: 'array',
            balancedShortlist: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.1,
      maxTokens: 1200,
      systemPrompt: 'You are the Candidate Matcher Agent for a Malaysian HRMS system. Your role focuses on intelligent candidate-job matching:\n\n- Match candidates to job openings based on skills and experience\n- Analyze skill gaps and provide training recommendations\n- Ensure diverse and inclusive hiring practices\n- Support fair hiring processes\n- Comply with Malaysian employment laws\n- Provide data-driven matching insights.',
      isActive: true,
      priority: 3
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.CANDIDATE_MATCH,
      AgentTaskType.ANALYZE
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.input.analysisType || task.input.matchType) {
        case 'candidate_job_matching':
          return await this.handleCandidateJobMatching(task.input)
        case 'skill_gap_analysis':
          return await this.handleSkillGapAnalysis(task.input)
        case 'diversity_matching':
          return await this.handleDiversityMatching(task.input)
        default:
          throw new Error('Unsupported task type: ' + (task.input.analysisType || task.input.matchType))
      }
    } catch (error) {
      throw new Error('Candidate Matcher processing failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  private async handleCandidateJobMatching(input: any): Promise<AgentResponse> {
    const { candidates, jobDescription, matchingCriteria } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Match candidates to this job opening:\n\nCandidates: ' + JSON.stringify(candidates, null, 2) + '\nJob Description: ' + JSON.stringify(jobDescription, null, 2) + '\nMatching Criteria: ' + JSON.stringify(matchingCriteria, null, 2) + '\n\nProvide matches, ranking, and insights.',
        timestamp: new Date()
      }
    ]

    const schema = {
      matches: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            candidateId: { type: 'string' },
            matchScore: { type: 'number', minimum: 0, maximum: 100 },
            matchedSkills: { type: 'array', items: { type: 'string' } },
            experienceMatch: { type: 'number', minimum: 0, maximum: 100 }
          }
        }
      },
      ranking: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            candidateId: { type: 'string' },
            rank: { type: 'number' },
            overallScore: { type: 'number' }
          }
        }
      },
      insights: {
        type: 'object',
        properties: {
          topSkills: { type: 'array', items: { type: 'string' } },
          commonGaps: { type: 'array', items: { type: 'string' } },
          diversityNotes: { type: 'string' }
        }
      }
    }

    const analysis = await this.generateStructuredResponse(messages, schema, {
      temperature: 0.1,
      maxTokens: 1000
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

  private async handleSkillGapAnalysis(input: any): Promise<AgentResponse> {
    const { candidateProfile, jobRequirements } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Analyze skill gaps for this candidate:\n\nCandidate Profile: ' + JSON.stringify(candidateProfile, null, 2) + '\nJob Requirements: ' + JSON.stringify(jobRequirements, null, 2) + '\n\nProvide skill gaps, match percentage, and training recommendations.',
        timestamp: new Date()
      }
    ]

    const schema = {
      skillGaps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            skill: { type: 'string' },
            currentLevel: { type: 'string' },
            requiredLevel: { type: 'string' },
            gap: { type: 'string' }
          }
        }
      },
      matchPercentage: { type: 'number', minimum: 0, maximum: 100 },
      trainingRecommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            skill: { type: 'string' },
            trainingType: { type: 'string' },
            duration: { type: 'string' },
            priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] }
          }
        }
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

  private async handleDiversityMatching(input: any): Promise<AgentResponse> {
    const { candidatePool, diversityTargets, jobPosition } = input

    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: 'Ensure diverse candidate matching:\n\nCandidate Pool: ' + JSON.stringify(candidatePool, null, 2) + '\nDiversity Targets: ' + JSON.stringify(diversityTargets, null, 2) + '\nJob Position: ' + JSON.stringify(jobPosition, null, 2) + '\n\nProvide diversity score, recommendations, and balanced shortlist.',
        timestamp: new Date()
      }
    ]

    const schema = {
      diversityScore: { type: 'number', minimum: 0, maximum: 100 },
      recommendations: {
        type: 'array',
        items: { type: 'string' }
      },
      balancedShortlist: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            candidateId: { type: 'string' },
            diversityCategory: { type: 'string' },
            qualificationScore: { type: 'number' }
          }
        }
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
      confidence: 0.8,
      processingTime: 0,
      completedAt: new Date()
    }
  }
}
