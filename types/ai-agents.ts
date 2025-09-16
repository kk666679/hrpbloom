// Core AI Agent Types and Interfaces

export interface AgentTask {
  id: string
  type: AgentTaskType
  priority: TaskPriority
  input: Record<string, any>
  context?: AgentContext
  userId?: number
  metadata?: Record<string, any>
  createdAt: Date
}

export interface AgentResponse {
  taskId: string
  agentId: string
  success: boolean
  output: Record<string, any>
  error?: string
  confidence?: number
  processingTime: number
  recommendations?: AgentRecommendation[]
  nextActions?: AgentTask[]
  completedAt: Date
}

export interface AgentContext {
  userId?: number
  companyId?: number
  department?: string
  role?: string
  sessionId?: string
  conversationHistory?: ConversationMessage[]
  previousTasks?: string[]
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AgentRecommendation {
  type: RecommendationType
  title: string
  description: string
  confidence: number
  actionRequired: boolean
  priority: TaskPriority
  data?: Record<string, any>
}

export interface AgentCapability {
  name: string
  description: string
  inputSchema: Record<string, any>
  outputSchema: Record<string, any>
  examples?: AgentExample[]
}

export interface AgentExample {
  input: Record<string, any>
  expectedOutput: Record<string, any>
  description: string
}

export interface AgentConfig {
  name: string
  type: AIAgentType
  capabilities: AgentCapability[]
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  isActive: boolean
  priority: number
  rateLimits?: RateLimit
  dependencies?: string[]
}

export interface RateLimit {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
}

// Enums
export enum AgentTaskType {
  // General
  ANALYZE = 'ANALYZE',
  GENERATE = 'GENERATE',
  CLASSIFY = 'CLASSIFY',
  SUMMARIZE = 'SUMMARIZE',
  TRANSLATE = 'TRANSLATE',
  
  // HR Specific
  RESUME_PARSE = 'RESUME_PARSE',
  CANDIDATE_MATCH = 'CANDIDATE_MATCH',
  PAYROLL_VALIDATE = 'PAYROLL_VALIDATE',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  SENTIMENT_ANALYSIS = 'SENTIMENT_ANALYSIS',
  DISPUTE_PREDICT = 'DISPUTE_PREDICT',
  SKILLS_GAP_ANALYSIS = 'SKILLS_GAP_ANALYSIS',
  PERFORMANCE_REVIEW = 'PERFORMANCE_REVIEW',
  
  // Conversational
  CHAT = 'CHAT',
  QUESTION_ANSWER = 'QUESTION_ANSWER',
  RECOMMENDATION = 'RECOMMENDATION'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RecommendationType {
  ACTION = 'ACTION',
  INSIGHT = 'INSIGHT',
  WARNING = 'WARNING',
  OPTIMIZATION = 'OPTIMIZATION',
  COMPLIANCE = 'COMPLIANCE'
}

export enum AIAgentType {
  COORDINATOR = 'COORDINATOR',
  COMPLIANCE = 'COMPLIANCE',
  IR = 'IR', // Industrial Relations
  ER = 'ER', // Employee Relations
  CB = 'CB', // Compensation & Benefits
  TA = 'TA', // Talent Acquisition
  LD = 'LD', // Learning & Development
  PERFORMANCE = 'PERFORMANCE',
  RESUME_PARSER = 'RESUME_PARSER',
  CANDIDATE_MATCHER = 'CANDIDATE_MATCHER',
  CHATBOT = 'CHATBOT',
  RECOMMENDER = 'RECOMMENDER'
}

// Agent Status and Metrics
export interface AgentStatus {
  agentId: string
  isActive: boolean
  isHealthy: boolean
  lastHeartbeat: Date
  currentLoad: number
  averageResponseTime: number
  successRate: number
  errorCount: number
  totalRequests: number
}

export interface AgentMetrics {
  agentId: string
  period: MetricsPeriod
  requestCount: number
  successCount: number
  errorCount: number
  averageResponseTime: number
  averageConfidence: number
  topTaskTypes: Array<{ type: AgentTaskType; count: number }>
  performanceScore: number
}

export enum MetricsPeriod {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

// Orchestration Types
export interface OrchestrationRequest {
  task: AgentTask
  preferredAgents?: string[]
  fallbackStrategy?: FallbackStrategy
  timeout?: number
}

export interface OrchestrationResponse {
  success: boolean
  assignedAgent?: string
  response?: AgentResponse
  error?: string
  fallbackUsed?: boolean
  processingTime: number
}

export enum FallbackStrategy {
  RETRY_SAME_AGENT = 'RETRY_SAME_AGENT',
  TRY_DIFFERENT_AGENT = 'TRY_DIFFERENT_AGENT',
  ESCALATE_TO_COORDINATOR = 'ESCALATE_TO_COORDINATOR',
  FAIL_GRACEFULLY = 'FAIL_GRACEFULLY'
}

// Agent Communication
export interface InterAgentMessage {
  fromAgentId: string
  toAgentId: string
  messageType: MessageType
  payload: Record<string, any>
  correlationId?: string
  timestamp: Date
}

export enum MessageType {
  TASK_REQUEST = 'TASK_REQUEST',
  TASK_RESPONSE = 'TASK_RESPONSE',
  COLLABORATION_REQUEST = 'COLLABORATION_REQUEST',
  STATUS_UPDATE = 'STATUS_UPDATE',
  ERROR_NOTIFICATION = 'ERROR_NOTIFICATION'
}
