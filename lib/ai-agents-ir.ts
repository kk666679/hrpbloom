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
import { AIBaseAgent } from './ai-agents'

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
            recommendations: 'array'
