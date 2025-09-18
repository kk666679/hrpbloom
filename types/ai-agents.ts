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
  RECOMMENDATION = 'RECOMMENDATION',

  // IR Agent Tasks
  LEGAL_SEARCH = 'LEGAL_SEARCH',
  FORM_34_GENERATE = 'FORM_34_GENERATE',
  CASE_ANALYZE = 'CASE_ANALYZE',
  CASE_DOCUMENT = 'CASE_DOCUMENT',
  AUDIT_LOG = 'AUDIT_LOG',
  IR_DASHBOARD = 'IR_DASHBOARD',

  // ER Agent Tasks
  SENTIMENT_ANALYZE = 'SENTIMENT_ANALYZE',
  MEDIATION_CHAT = 'MEDIATION_CHAT',
  CULTURE_DASHBOARD = 'CULTURE_DASHBOARD',
  ER_ESCALATION_PREDICT = 'ER_ESCALATION_PREDICT',
  INVESTIGATION_DOC = 'INVESTIGATION_DOC',

  // C&B Agent Tasks
  SALARY_BENCHMARK = 'SALARY_BENCHMARK',
  BENEFITS_PERSONALIZE = 'BENEFITS_PERSONALIZE',
  PAY_EQUITY_ANALYZE = 'PAY_EQUITY_ANALYZE',
  REWARDS_STATEMENT = 'REWARDS_STATEMENT',
  COLA_FORECAST = 'COLA_FORECAST',

  // TA Agent Tasks
  INTERVIEW_ANALYTICS = 'INTERVIEW_ANALYTICS',
  JOB_POST_OPTIMIZE = 'JOB_POST_OPTIMIZE',
  APPLICATION_TRACK = 'APPLICATION_TRACK',
  MYWORKID_VERIFY = 'MYWORKID_VERIFY',
  CANDIDATE_RANKING = 'CANDIDATE_RANKING',

  // L&D Agent Tasks
  SKILLS_GAP_ANALYZE = 'SKILLS_GAP_ANALYZE',
  LEARNING_PATH_GENERATE = 'LEARNING_PATH_GENERATE',
  TRAINING_ROI_PREDICT = 'TRAINING_ROI_PREDICT',
  MICRO_LEARNING_RECOMMEND = 'MICRO_LEARNING_RECOMMEND',
  HRDF_CLAIMS_AUTOMATE = 'HRDF_CLAIMS_AUTOMATE',

  // Performance Agent Tasks
  OKR_TRACK = 'OKR_TRACK',
  FEEDBACK_ANALYZE = 'FEEDBACK_ANALYZE',
  PERFORMANCE_MATRIX = 'PERFORMANCE_MATRIX',
  CAREER_SIMULATE = 'CAREER_SIMULATE',
  SUCCESSION_PLAN = 'SUCCESSION_PLAN',

  // Analytics Agent Tasks
  DASHBOARD_GENERATE = 'DASHBOARD_GENERATE',
  ATTRITION_PREDICT = 'ATTRITION_PREDICT',
  WORKFORCE_SIMULATE = 'WORKFORCE_SIMULATE',
  COMPLIANCE_SCAN = 'COMPLIANCE_SCAN',
  CULTURE_ANALYZE = 'CULTURE_ANALYZE'
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
