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

// Base AI Agent Class
export abstract class AIBaseAgent {
  public config: AgentConfig
  protected status: AgentStatus
  protected metrics: AgentMetrics

  constructor(config: AgentConfig) {
    this.config = config
    this.status = {
      agentId: config.name,
      isActive: config.isActive,
      isHealthy: true,
      lastHeartbeat: new Date(),
      currentLoad: 0,
      averageResponseTime: 0,
      successRate: 1.0,
      errorCount: 0,
      totalRequests: 0
    }
    this.metrics = {
      agentId: config.name,
      period: 'DAY' as any,
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      averageConfidence: 0,
      topTaskTypes: [],
      performanceScore: 1.0
    }
  }

  // Abstract methods that must be implemented by specific agents
  abstract canHandle(task: AgentTask): boolean
  abstract processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse>

  // Common agent functionality
  async execute(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    const startTime = Date.now()
    
    try {
      // Update metrics
      this.status.currentLoad++
      this.status.totalRequests++
      this.metrics.requestCount++

      // Log task start
      await this.logActivity('TASK_START', { taskId: task.id, type: task.type }, {})

      // Check if agent can handle the task
      if (!this.canHandle(task)) {
        throw new Error(`Agent ${this.config.name} cannot handle task type ${task.type}`)
      }

      // Process the task
      const response = await this.processTask(task, context)
      
      // Update success metrics
      this.status.currentLoad--
      this.metrics.successCount++
      
      const processingTime = Date.now() - startTime
      this.updateResponseTime(processingTime)

      // Log successful completion
      await this.logActivity('TASK_COMPLETE', { taskId: task.id }, response.output)

      return {
        ...response,
        processingTime
      }

    } catch (error) {
      // Update error metrics
      this.status.currentLoad--
      this.status.errorCount++
      this.metrics.errorCount++
      
      const processingTime = Date.now() - startTime
      
      // Log error
      await this.logActivity('TASK_ERROR', { taskId: task.id, error: error instanceof Error ? error.message : 'Unknown error' }, {})

      return {
        taskId: task.id,
        agentId: this.config.name,
        success: false,
        output: {},
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
        completedAt: new Date()
      }
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      this.status.lastHeartbeat = new Date()
      this.status.isHealthy = true
      return true
    } catch (error) {
      this.status.isHealthy = false
      return false
    }
  }

  // Get agent status
  getStatus(): AgentStatus {
    return { ...this.status }
  }

  // Get agent metrics
  getMetrics(): AgentMetrics {
    return { ...this.metrics }
  }

  // Update configuration
  updateConfig(newConfig: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Protected helper methods
  protected async generateResponse(
    messages: ConversationMessage[],
    options: {
      model?: AIModel
      temperature?: number
      maxTokens?: number
    } = {}
  ): Promise<string> {
    const openAIMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }))

    return await generateCompletion(openAIMessages, {
      model: options.model || AI_MODELS.GPT_3_5_TURBO,
      temperature: options.temperature || this.config.temperature || 0.7,
      maxTokens: options.maxTokens || this.config.maxTokens || 1000,
      systemPrompt: this.config.systemPrompt
    })
  }

  protected async generateStructuredResponse<T>(
    messages: ConversationMessage[],
    schema: any,
    options: {
      model?: AIModel
      temperature?: number
      maxTokens?: number
    } = {}
  ): Promise<T> {
    const openAIMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }))

    return await generateStructuredCompletion<T>(openAIMessages, schema, {
      model: options.model || AI_MODELS.GPT_3_5_TURBO,
      temperature: options.temperature || this.config.temperature || 0.3,
      maxTokens: options.maxTokens || this.config.maxTokens || 2000,
      systemPrompt: this.config.systemPrompt
    })
  }

  protected async logActivity(action: string, input: any, output: any): Promise<void> {
    try {
      // Find or create AI agent in database
      let dbAgent = await prisma.aIAgent.findFirst({
        where: { name: this.config.name }
      })

      if (!dbAgent) {
        dbAgent = await prisma.aIAgent.create({
          data: {
            name: this.config.name,
            type: this.config.type as any,
            config: this.config as any,
            isActive: this.config.isActive
          }
        })
      }

      // Log the activity
      await prisma.aILog.create({
        data: {
          agentId: dbAgent.id,
          action,
          input: input as any,
          output: output as any
        }
      })
    } catch (error) {
      console.error('Failed to log agent activity:', error)
    }
  }

  private updateResponseTime(processingTime: number): void {
    const totalTime = this.status.averageResponseTime * (this.status.totalRequests - 1) + processingTime
    this.status.averageResponseTime = totalTime / this.status.totalRequests
    this.metrics.averageResponseTime = this.status.averageResponseTime
  }
}

// Coordinator Agent - Routes tasks to appropriate specialized agents
export class CoordinatorAgent extends AIBaseAgent {
  private registeredAgents: Map<string, AIBaseAgent> = new Map()

  constructor() {
    const config: AgentConfig = {
      name: 'coordinator',
      type: AIAgentType.COORDINATOR,
      capabilities: [
        {
          name: 'task_routing',
          description: 'Route tasks to appropriate specialized agents',
          inputSchema: { task: 'AgentTask', availableAgents: 'string[]' },
          outputSchema: { selectedAgent: 'string', confidence: 'number', reasoning: 'string' }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: `You are the Coordinator Agent for an AI-powered HRMS system. Your role is to analyze incoming tasks and route them to the most appropriate specialized agent.

Available agent types:
- COMPLIANCE: Handles payroll calculations, tax compliance, EPF/SOCSO/EIS calculations
- IR: Industrial Relations - handles disputes, legal precedents, compliance alerts
- ER: Employee Relations - monitors sentiment, DEI metrics, case predictions
- CB: Compensation & Benefits - salary benchmarking, benefits optimization
- TA: Talent Acquisition - resume parsing, candidate matching, interview analysis
- LD: Learning & Development - skills gap detection, learning paths
- PERFORMANCE: OKR tracking, performance reviews, career simulations
- RESUME_PARSER: Specialized resume parsing and data extraction
- CANDIDATE_MATCHER: Job-candidate matching algorithms
- CHATBOT: General conversational AI for HR queries
- RECOMMENDER: General recommendation engine

Analyze each task and determine the best agent to handle it based on the task type, input data, and required expertise.`,
      isActive: true,
      priority: 1
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    // Coordinator can handle routing for any task
    return true
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      // Get available agents
      const availableAgents = Array.from(this.registeredAgents.keys())
      
      if (availableAgents.length === 0) {
        throw new Error('No agents available for task routing')
      }

      // Analyze task and determine best agent
      const routingDecision = await this.analyzeTaskForRouting(task, availableAgents, context)
      
      // Get the selected agent
      const selectedAgent = this.registeredAgents.get(routingDecision.selectedAgent)
      
      if (!selectedAgent) {
        throw new Error(`Selected agent ${routingDecision.selectedAgent} not found`)
      }

      // Execute task with selected agent
      const response = await selectedAgent.execute(task, context)

      return {
        taskId: task.id,
        agentId: this.config.name,
        success: true,
        output: {
          routingDecision,
          delegatedResponse: response
        },
        confidence: routingDecision.confidence,
        processingTime: Date.now() - Date.now(), // Will be set by parent execute method
        completedAt: new Date()
      }

    } catch (error) {
      throw new Error(`Coordination failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Register a specialized agent
  registerAgent(agent: AIBaseAgent): void {
    this.registeredAgents.set(agent.config.name, agent)
  }

  // Unregister an agent
  unregisterAgent(agentName: string): void {
    this.registeredAgents.delete(agentName)
  }

  // Get all registered agents
  getRegisteredAgents(): string[] {
    return Array.from(this.registeredAgents.keys())
  }

  private async analyzeTaskForRouting(
    task: AgentTask, 
    availableAgents: string[], 
    context?: AgentContext
  ): Promise<{ selectedAgent: string; confidence: number; reasoning: string }> {
    const messages: ConversationMessage[] = [
      {
        role: 'user',
        content: `Analyze this task and select the best agent to handle it:

Task Details:
- ID: ${task.id}
- Type: ${task.type}
- Priority: ${task.priority}
- Input: ${JSON.stringify(task.input, null, 2)}
- Context: ${context ? JSON.stringify(context, null, 2) : 'None'}

Available Agents: ${availableAgents.join(', ')}

Select the most appropriate agent and provide your reasoning. Consider the task type, input data complexity, and required expertise.`,
        timestamp: new Date()
      }
    ]

    const schema = {
      selectedAgent: { type: 'string', enum: availableAgents },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
      reasoning: { type: 'string' }
    }

    return await this.generateStructuredResponse(messages, schema, {
      temperature: 0.3,
      maxTokens: 500
    })
  }
}

// Agent Registry - Manages all agents in the system
export class AgentRegistry {
  private static instance: AgentRegistry
  private agents: Map<string, AIBaseAgent> = new Map()
  private coordinator: CoordinatorAgent

  private constructor() {
    this.coordinator = new CoordinatorAgent()
  }

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry()
    }
    return AgentRegistry.instance
  }

  // Register an agent
  registerAgent(agent: AIBaseAgent): void {
    this.agents.set(agent.config.name, agent)
    this.coordinator.registerAgent(agent)
  }

  // Unregister an agent
  unregisterAgent(agentName: string): void {
    this.agents.delete(agentName)
    this.coordinator.unregisterAgent(agentName)
  }

  // Get agent by name
  getAgent(agentName: string): AIBaseAgent | undefined {
    return this.agents.get(agentName)
  }

  // Get coordinator
  getCoordinator(): CoordinatorAgent {
    return this.coordinator
  }

  // Get all agents
  getAllAgents(): AIBaseAgent[] {
    return Array.from(this.agents.values())
  }

  // Get agents by type
  getAgentsByType(type: AIAgentType): AIBaseAgent[] {
    return Array.from(this.agents.values()).filter(agent => agent.config.type === type)
  }

  // Execute task through coordinator
  async executeTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    return await this.coordinator.execute(task, context)
  }

  // Get system health status
  async getSystemHealth(): Promise<{
    totalAgents: number
    activeAgents: number
    healthyAgents: number
    averageResponseTime: number
    totalRequests: number
    successRate: number
  }> {
    const allAgents = [this.coordinator, ...this.getAllAgents()]
    const healthChecks = await Promise.all(allAgents.map(agent => agent.healthCheck()))
    
    const totalAgents = allAgents.length
    const activeAgents = allAgents.filter(agent => agent.getStatus().isActive).length
    const healthyAgents = healthChecks.filter(Boolean).length
    
    const totalRequests = allAgents.reduce((sum, agent) => sum + agent.getStatus().totalRequests, 0)
    const totalErrors = allAgents.reduce((sum, agent) => sum + agent.getStatus().errorCount, 0)
    const successRate = totalRequests > 0 ? (totalRequests - totalErrors) / totalRequests : 1
    
    const avgResponseTime = allAgents.reduce((sum, agent) => sum + agent.getStatus().averageResponseTime, 0) / totalAgents

    return {
      totalAgents,
      activeAgents,
      healthyAgents,
      averageResponseTime: avgResponseTime,
      totalRequests,
      successRate
    }
  }
}

// Utility functions
export function createTask(
  type: AgentTaskType,
  input: Record<string, any>,
  options: {
    priority?: TaskPriority
    userId?: number
    metadata?: Record<string, any>
  } = {}
): AgentTask {
  return {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    priority: options.priority || TaskPriority.MEDIUM,
    input,
    userId: options.userId,
    metadata: options.metadata,
    createdAt: new Date()
  }
}

export function createContext(
  userId?: number,
  companyId?: number,
  additionalContext: Partial<AgentContext> = {}
): AgentContext {
  return {
    userId,
    companyId,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    conversationHistory: [],
    previousTasks: [],
    ...additionalContext
  }
}

// Compliance Agent - Handles payroll calculations and Malaysian compliance
export class ComplianceAgent extends AIBaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'compliance',
      type: AIAgentType.COMPLIANCE,
      capabilities: [
        {
          name: 'payroll_calculation',
          description: 'Calculate Malaysian payroll with EPF, SOCSO, EIS, tax, and Zakat',
          inputSchema: {
            basicSalary: 'number',
            allowances: 'number',
            deductions: 'number',
            tabungHajiOptIn: 'boolean',
            state: 'string'
          },
          outputSchema: {
            grossSalary: 'number',
            epfEmployee: 'number',
            epfEmployer: 'number',
            socsoEmployee: 'number',
            socsoEmployer: 'number',
            eisAmount: 'number',
            tabungHajiAmount: 'number',
            taxAmount: 'number',
            zakatAmount: 'number',
            netSalary: 'number',
            alerts: 'array'
          }
        },
        {
          name: 'compliance_validation',
          description: 'Validate payroll data against Malaysian statutory requirements',
          inputSchema: {
            payrollData: 'object',
            employeeData: 'object'
          },
          outputSchema: {
            isCompliant: 'boolean',
            violations: 'array',
            recommendations: 'array'
          }
        }
      ],
      model: AI_MODELS.GPT_3_5_TURBO,
      temperature: 0.1,
      maxTokens: 1000,
      systemPrompt: `You are the Compliance Agent for a Malaysian HRMS system. Your role is to ensure all payroll calculations and HR processes comply with Malaysian laws including:

- EPF (Employees Provident Fund) contributions
- SOCSO (Social Security Organization) contributions  
- EIS (Employment Insurance System)
- PCB (Personal Income Tax)
- Zakat calculations (state variations)
- Tabung Haji contributions
- LHDN (Inland Revenue Board) requirements
- KWSP (EPF) regulations
- PERKESO (SOCSO) guidelines

You must validate all calculations against current statutory rates and identify any compliance violations or irregularities.`,
      isActive: true,
      priority: 2
    }
    super(config)
  }

  canHandle(task: AgentTask): boolean {
    return [
      AgentTaskType.PAYROLL_VALIDATE,
      AgentTaskType.COMPLIANCE_CHECK
    ].includes(task.type)
  }

  async processTask(task: AgentTask, context?: AgentContext): Promise<AgentResponse> {
    try {
      switch (task.type) {
        case AgentTaskType.PAYROLL_VALIDATE:
          return await this.handlePayrollCalculation(task.input)
        case AgentTaskType.COMPLIANCE_CHECK:
          return await this.handleComplianceValidation(task.input)
        default:
          throw new Error(`Unsupported task type: ${task.type}`)
      }
    } catch (error) {
      throw new Error(`Compliance processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handlePayrollCalculation(input: any): Promise<AgentResponse> {
    const { calculateMalaysianPayroll } = await import('./malaysian-compliance')
    
    const result = calculateMalaysianPayroll(input)
    
    // Generate alerts for potential issues
    const alerts = this.generatePayrollAlerts(result, input)

    return {
      taskId: '', // Will be set by parent
      agentId: this.config.name,
      success: true,
      output: {
        ...result,
        alerts
      },
      confidence: 0.95,
      processingTime: 0, // Will be set by parent
      completedAt: new Date()
    }
  }

  private async handleComplianceValidation(input: any): Promise<AgentResponse> {
    const { payrollData, employeeData } = input
    
    const violations: string[] = []
    const recommendations: string[] = []

    // Validate EPF compliance
    if (payrollData.epfEmployee < payrollData.grossSalary * 0.11) {
      violations.push('EPF employee contribution below minimum rate')
      recommendations.push('Increase EPF employee contribution to 11% of gross salary')
    }

    // Validate SOCSO compliance
    if (payrollData.socsoEmployee < Math.min(payrollData.grossSalary, 4000) * 0.005) {
      violations.push('SOCSO employee contribution below minimum rate')
      recommendations.push('Increase SOCSO employee contribution to 0.5% of salary (capped at RM4,000)')
    }

    // Validate tax compliance
    if (payrollData.taxAmount <= 0 && payrollData.grossSalary > 5000) {
      violations.push('Tax not calculated for taxable income')
      recommendations.push('Calculate PCB based on annual taxable income')
    }

    // Check for minimum wage compliance (assuming RM1,500/month)
    if (payrollData.basicSalary < 1500) {
      violations.push('Basic salary below minimum wage threshold')
      recommendations.push('Ensure basic salary meets minimum wage requirements')
    }

    const isCompliant = violations.length === 0

    return {
      taskId: '', // Will be set by parent
      agentId: this.config.name,
      success: true,
      output: {
        isCompliant,
        violations,
        recommendations
      },
      confidence: isCompliant ? 0.9 : 0.8,
      processingTime: 0, // Will be set by parent
      completedAt: new Date()
    }
  }

  private generatePayrollAlerts(result: any, input: any): Array<{type: string, message: string, severity: string}> {
    const alerts = []

    // Check for unusually high deductions
    const totalDeductions = result.epfEmployee + result.socsoEmployee + result.eisAmount + result.taxAmount + result.zakatAmount + input.deductions
    if (totalDeductions > result.grossSalary * 0.4) {
      alerts.push({
        type: 'HIGH_DEDUCTIONS',
        message: 'Total deductions exceed 40% of gross salary',
        severity: 'warning'
      })
    }

    // Check for negative net salary
    if (result.netSalary < 0) {
      alerts.push({
        type: 'NEGATIVE_NET',
        message: 'Net salary is negative - review deductions',
        severity: 'error'
      })
    }

    // Check for missing Tabung Haji opt-in
    if (!input.tabungHajiOptIn && result.grossSalary > 2000) {
      alerts.push({
        type: 'TABUNG_HAJI_MISSING',
        message: 'Consider Tabung Haji contribution for eligible employees',
        severity: 'info'
      })
    }

    return alerts
  }
}

  
// Initialize the agent registry
export const agentRegistry = AgentRegistry.getInstance()

// Register specialized agents
const complianceAgent = new ComplianceAgent()
agentRegistry.registerAgent(complianceAgent)

import { IRAgent } from './ai-agents-ir'
import { ERAgent } from './ai-agents-er'

// Register IR Agent
const irAgent = new IRAgent()
agentRegistry.registerAgent(irAgent)

// Register ER Agent
const erAgent = new ERAgent()
agentRegistry.registerAgent(erAgent)

// Register CB Agent
import { CBAgent } from './ai-agents-cb'
const cbAgent = new CBAgent()
agentRegistry.registerAgent(cbAgent)

// Register TA Agent
import { TAAgent } from './ai-agents-ta'
const taAgent = new TAAgent()
agentRegistry.registerAgent(taAgent)

// Register LD Agent
import { LDAgent } from './ai-agents-ld'
const ldAgent = new LDAgent()
agentRegistry.registerAgent(ldAgent)

// Register Performance Agent
import { PerformanceAgent } from './ai-agents-performance'
const performanceAgent = new PerformanceAgent()
agentRegistry.registerAgent(performanceAgent)

// Register Resume Parser Agent
import { ResumeParserAgent } from './ai-agents-resume-parser'
const resumeParserAgent = new ResumeParserAgent()
agentRegistry.registerAgent(resumeParserAgent)

// Register Candidate Matcher Agent
import { CandidateMatcherAgent } from './ai-agents-candidate-matcher'
const candidateMatcherAgent = new CandidateMatcherAgent()
agentRegistry.registerAgent(candidateMatcherAgent)

// Register Chatbot Agent
import { ChatbotAgent } from './ai-agents-chatbot'
const chatbotAgent = new ChatbotAgent()
agentRegistry.registerAgent(chatbotAgent)
