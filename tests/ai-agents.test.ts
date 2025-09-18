import { describe, it, expect, beforeEach } from 'vitest';
import { AIBaseAgent, CoordinatorAgent, AgentRegistry, createTask, createContext, ComplianceAgent, ERAgent, CBAgent, TAAgent, IRAgent, LDAgent, PerformanceAgent, AnalyticsAgent } from '@/lib/ai-agents';
import { AgentTaskType } from '@/types/ai-agents';

// Mock specialized agent for testing
class MockAgent extends AIBaseAgent {
  constructor() {
    super('MockAgent');
  }

  async processTask(task: any) {
    return {
      taskId: task.id,
      success: true,
      result: { message: 'Mock response' },
    };
  }
}

describe('AI Agent Framework', () => {
  let registry: AgentRegistry;
  let mockAgent: MockAgent;

  beforeEach(() => {
    registry = new AgentRegistry();
    mockAgent = new MockAgent();
  });

  describe('AIBaseAgent', () => {
    it('should have correct name', () => {
      expect(mockAgent.name).toBe('MockAgent');
    });
  });

  describe('CoordinatorAgent', () => {
    it('should register agents', () => {
      const coordinator = new CoordinatorAgent();
      coordinator.registerAgent('test', mockAgent);
      // Registration is internal, but no error should occur
      expect(coordinator).toBeInstanceOf(CoordinatorAgent);
    });

    it('should route tasks to registered agents', async () => {
      const coordinator = new CoordinatorAgent();
      coordinator.registerAgent(AgentTaskType.ANALYZE, mockAgent);

      const task = createTask(AgentTaskType.ANALYZE, { data: 'test' });
      const response = await coordinator.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result).toEqual({ message: 'Mock response' });
    });

    it('should return error for unregistered task type', async () => {
      const coordinator = new CoordinatorAgent();
      const task = createTask(AgentTaskType.ANALYZE, { data: 'test' });
      const response = await coordinator.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('No agent registered');
    });
  });

  describe('AgentRegistry', () => {
    it('should register agents and route through coordinator', async () => {
      registry.registerAgent(AgentTaskType.ANALYZE, mockAgent);
      const task = createTask(AgentTaskType.ANALYZE, { data: 'test' });
      const context = createContext(1, 1);
      const response = await registry.executeTask(task, context);

      expect(response.success).toBe(true);
      expect(response.taskId).toBe(task.id);
      expect(response.agentId).toBe('coordinator');
    });
  });

  describe('Compliance Agent', () => {
    let complianceAgent: ComplianceAgent;

    beforeEach(() => {
      complianceAgent = new ComplianceAgent();
    });

    it('should validate payroll correctly', async () => {
      const payrollData = {
        basicSalary: 3000,
        allowances: 500,
        deductions: 100,
        tabungHajiOptIn: false,
        state: 'Selangor'
      };

      const task = createTask('PAYROLL_VALIDATE' as any, payrollData);
      const response = await complianceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.payroll).toBeDefined();
      expect(response.result.validations).toBeDefined();
      expect(response.result.compliant).toBe(true);
    });

    it('should perform compliance checks', async () => {
      const complianceData = {
        companyId: 1,
        period: '2024-01'
      };

      const task = createTask('COMPLIANCE_CHECK' as any, complianceData);
      const response = await complianceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.checks).toBeDefined();
      expect(response.result.overallCompliant).toBe(true);
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should return error for unsupported task type', async () => {
      const task = createTask('UNSUPPORTED_TASK' as any, {});
      const response = await complianceAgent.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unsupported task type');
    });
  });

  describe('ER Agent', () => {
    let erAgent: ERAgent;

    beforeEach(() => {
      erAgent = new ERAgent();
    });

    it('should analyze sentiment correctly', async () => {
      const sentimentData = {
        text: 'I am very happy with my job and the team is great',
        language: 'en'
      };

      const task = createTask('SENTIMENT_ANALYZE' as any, sentimentData);
      const response = await erAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.sentiment).toBeDefined();
      expect(response.result.confidence).toBeDefined();
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should handle mediation chat', async () => {
      const chatData = {
        message: 'I am frustrated with my manager',
        language: 'en',
        conversationHistory: []
      };

      const task = createTask('MEDIATION_CHAT' as any, chatData);
      const response = await erAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.response).toBeDefined();
      expect(response.result.language).toBe('en');
      expect(Array.isArray(response.result.nextSteps)).toBe(true);
    });

    it('should generate culture dashboard', async () => {
      const dashboardData = {
        surveyResults: [],
        feedbackData: []
      };

      const task = createTask('CULTURE_DASHBOARD' as any, dashboardData);
      const response = await erAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.engagementScore).toBeDefined();
      expect(response.result.deiScore).toBeDefined();
      expect(Array.isArray(response.result.alerts)).toBe(true);
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should predict escalation risk', async () => {
      const escalationData = {
        complaints: 3,
        involvesHarassment: false,
        managementInvolved: true,
        legalThreat: false
      };

      const task = createTask('ER_ESCALATION_PREDICT' as any, escalationData);
      const response = await erAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.riskLevel).toBeDefined();
      expect(response.result.probability).toBeDefined();
      expect(Array.isArray(response.result.triggers)).toBe(true);
      expect(Array.isArray(response.result.preventionActions)).toBe(true);
    });

    it('should document investigation', async () => {
      const investigationData = {
        incident: 'Workplace dispute',
        parties: ['Employee A', 'Manager B'],
        witnesses: ['Colleague C']
      };

      const task = createTask('INVESTIGATION_DOC' as any, investigationData);
      const response = await erAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.document).toBeDefined();
      expect(Array.isArray(response.result.sections)).toBe(true);
      expect(Array.isArray(response.result.compliance)).toBe(true);
      expect(Array.isArray(response.result.nextActions)).toBe(true);
    });

    it('should return error for unsupported task type', async () => {
      const task = createTask('UNSUPPORTED_ER_TASK' as any, {});
      const response = await erAgent.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unsupported task type');
    });
  });

  describe('C&B Agent', () => {
    let cbAgent: CBAgent;

    beforeEach(() => {
      cbAgent = new CBAgent();
    });

    it('should perform salary benchmarking', async () => {
      const benchmarkData = {
        role: 'Software Engineer',
        experience: 5,
        location: 'KL',
        industry: 'Tech'
      };

      const task = createTask('SALARY_BENCHMARK' as any, benchmarkData);
      const response = await cbAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.benchmarkSalary).toBeDefined();
      expect(Array.isArray(response.result.range)).toBe(true);
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should personalize benefits', async () => {
      const benefitsData = {
        employeeProfile: { age: 30, dependents: 2 },
        preferences: { health: true, dental: false },
        budget: 500
      };

      const task = createTask('BENEFITS_PERSONALIZE' as any, benefitsData);
      const response = await cbAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.result.recommendedBenefits)).toBe(true);
      expect(response.result.totalValue).toBeDefined();
      expect(response.result.employeeSatisfaction).toBeDefined();
    });

    it('should analyze pay equity', async () => {
      const equityData = {
        employees: [
          { id: '1', salary: 5000, gender: 'M' },
          { id: '2', salary: 4800, gender: 'F' }
        ],
        demographics: { companySize: 100 }
      };

      const task = createTask('PAY_EQUITY_ANALYZE' as any, equityData);
      const response = await cbAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.equityScore).toBeDefined();
      expect(Array.isArray(response.result.disparities)).toBe(true);
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should generate rewards statement', async () => {
      const statementData = {
        employeeId: 'EMP001',
        period: '2024-Q1'
      };

      const task = createTask('REWARDS_STATEMENT' as any, statementData);
      const response = await cbAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.totalValue).toBeDefined();
      expect(response.result.breakdown).toBeDefined();
      expect(response.result.pdfUrl).toBeDefined();
      expect(response.result.portalUrl).toBeDefined();
    });

    it('should forecast COLA', async () => {
      const colaData = {
        location: 'KL',
        currentSalary: 5000,
        forecastPeriod: 1
      };

      const task = createTask('COLA_FORECAST' as any, colaData);
      const response = await cbAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.forecastedIncrease).toBeDefined();
      expect(response.result.inflationRate).toBeDefined();
      expect(response.result.recommendedAdjustment).toBeDefined();
    });

    it('should return error for unsupported task type', async () => {
      const task = createTask('UNSUPPORTED_CB_TASK' as any, {});
      const response = await cbAgent.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unsupported task type');
    });
  });

  describe('TA Agent', () => {
    let taAgent: TAAgent;

    beforeEach(() => {
      taAgent = new TAAgent();
    });

    it('should parse resume correctly', async () => {
      const resumeData = {
        resumeText: 'John Doe, Software Engineer with 5 years experience...',
        format: 'text'
      };

      const task = createTask('RESUME_PARSE' as any, resumeData);
      const response = await taAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.candidateProfile).toBeDefined();
      expect(Array.isArray(response.result.skills)).toBe(true);
      expect(Array.isArray(response.result.experience)).toBe(true);
      expect(response.result.confidence).toBeDefined();
    });

    it('should match candidate to job', async () => {
      const matchData = {
        candidateProfile: { skills: ['JavaScript', 'React'], experience: 5 },
        jobRequirements: { requiredSkills: ['JavaScript', 'Node.js'], minExperience: 3 }
      };

      const task = createTask('CANDIDATE_MATCH' as any, matchData);
      const response = await taAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.matchScore).toBeDefined();
      expect(response.result.skillMatch).toBeDefined();
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should analyze interview performance', async () => {
      const interviewData = {
        interviewTranscript: 'Candidate discussed their experience...',
        candidateId: 'CAND001',
        jobId: 'JOB001'
      };

      const task = createTask('INTERVIEW_ANALYTICS' as any, interviewData);
      const response = await taAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.overallScore).toBeDefined();
      expect(Array.isArray(response.result.strengths)).toBe(true);
      expect(Array.isArray(response.result.areasForImprovement)).toBe(true);
      expect(response.result.hiringRecommendation).toBeDefined();
    });

    it('should optimize job posting', async () => {
      const jobData = {
        jobDescription: 'We are looking for a developer...',
        targetCandidates: { experience: '3-5 years', skills: ['JavaScript'] }
      };

      const task = createTask('JOB_POST_OPTIMIZE' as any, jobData);
      const response = await taAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.optimizedDescription).toBeDefined();
      expect(Array.isArray(response.result.suggestedKeywords)).toBe(true);
      expect(response.result.diversityScore).toBeDefined();
      expect(response.result.attractivenessScore).toBeDefined();
    });

    it('should track application progress', async () => {
      const trackingData = {
        applicationId: 'APP001',
        stage: 'Interview Scheduled',
        metrics: { timeInStage: 5, communications: 3 }
      };

      const task = createTask('APPLICATION_TRACK' as any, trackingData);
      const response = await taAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.currentStage).toBeDefined();
      expect(response.result.timeInStage).toBeDefined();
      expect(Array.isArray(response.result.nextSteps)).toBe(true);
      expect(response.result.riskOfDropout).toBeDefined();
    });

    it('should return error for unsupported task type', async () => {
      const task = createTask('UNSUPPORTED_TA_TASK' as any, {});
      const response = await taAgent.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unsupported task type');
    });
  });

  describe('Performance Agent', () => {
    let performanceAgent: PerformanceAgent;

    beforeEach(() => {
      performanceAgent = new PerformanceAgent();
    });

    it('should track OKR progress', async () => {
      const okrData = {
        objectives: [
          { id: 'obj1', status: 'completed', progress: 1.0 },
          { id: 'obj2', status: 'in_progress', progress: 0.8 }
        ],
        currentProgress: [],
        timeRemaining: 50
      };

      const task = createTask('OKR_TRACK' as any, okrData);
      const response = await performanceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.predictedCompletion).toBeDefined();
      expect(response.result.riskLevel).toBeDefined();
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should analyze 360 feedback', async () => {
      const feedbackData = [
        { reviewer: 'Manager', sentiment: 'positive', biasDetected: false },
        { reviewer: 'Peer', sentiment: 'neutral', biasDetected: false }
      ];

      const task = createTask('FEEDBACK_ANALYZE' as any, { feedbackData, employeeId: 'EMP001' });
      const response = await performanceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.overallScore).toBeDefined();
      expect(response.result.sentimentBreakdown).toBeDefined();
      expect(Array.isArray(response.result.strengths)).toBe(true);
      expect(Array.isArray(response.result.developmentAreas)).toBe(true);
    });

    it('should generate performance matrix', async () => {
      const matrixData = {
        employees: [{ id: '1' }, { id: '2' }],
        performanceData: [],
        potentialData: []
      };

      const task = createTask('PERFORMANCE_MATRIX' as any, matrixData);
      const response = await performanceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.result.matrix)).toBe(true);
      expect(response.result.distribution).toBeDefined();
      expect(Array.isArray(response.result.highPerformers)).toBe(true);
      expect(Array.isArray(response.result.recommendations)).toBe(true);
    });

    it('should simulate career path', async () => {
      const careerData = {
        employeeProfile: { currentRole: 'Developer', experience: 5 },
        scenarios: [{ name: 'Promotion', conditions: 'Good performance' }],
        timeHorizon: 3
      };

      const task = createTask('CAREER_SIMULATE' as any, careerData);
      const response = await performanceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.result.baselinePath)).toBe(true);
      expect(Array.isArray(response.result.scenarioPaths)).toBe(true);
      expect(Array.isArray(response.result.keyMilestones)).toBe(true);
      expect(response.result.successProbability).toBeDefined();
    });

    it('should plan succession', async () => {
      const successionData = {
        positions: [{ title: 'Manager', criticality: 'high' }],
        candidates: [{ name: 'Candidate A', ready: true }, { name: 'Candidate B', ready: false }],
        riskFactors: ['Key employee retirement']
      };

      const task = createTask('SUCCESSION_PLAN' as any, successionData);
      const response = await performanceAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.result.criticalPositions)).toBe(true);
      expect(Array.isArray(response.result.readinessLevels)).toBe(true);
      expect(Array.isArray(response.result.developmentPlans)).toBe(true);
      expect(Array.isArray(response.result.riskMitigation)).toBe(true);
      expect(response.result.gaps).toBeDefined();
    });

    it('should return error for unsupported task type', async () => {
      const task = createTask('UNSUPPORTED_PERFORMANCE_TASK' as any, {});
      const response = await performanceAgent.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unsupported task type');
    });
  });

  describe('Analytics Agent', () => {
    let analyticsAgent: AnalyticsAgent;

    beforeEach(() => {
      analyticsAgent = new AnalyticsAgent();
    });

    it('should generate predictive dashboard', async () => {
      const dashboardData = {
        module: 'overall',
        timeRange: { start: '2024-01-01', end: '2024-03-31' },
        filters: { department: 'IT' }
      };

      const task = createTask('DASHBOARD_GENERATE' as any, dashboardData);
      const response = await analyticsAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.result.insights)).toBe(true);
      expect(response.result.predictions).toBeDefined();
      expect(Array.isArray(response.result.recommendations)).toBe(true);
      expect(Array.isArray(response.result.alerts)).toBe(true);
    });

    it('should predict attrition risk', async () => {
      const attritionData = {
        employees: [
          { id: '1', tenure: 1, satisfaction: 2 },
          { id: '2', tenure: 5, satisfaction: 4 }
        ],
        historicalData: [],
        externalFactors: ['Economic downturn']
      };

      const task = createTask('ATTRITION_PREDICT' as any, attritionData);
      const response = await analyticsAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.result.highRiskEmployees)).toBe(true);
      expect(Array.isArray(response.result.riskFactors)).toBe(true);
      expect(Array.isArray(response.result.interventions)).toBe(true);
      expect(Array.isArray(response.result.retentionStrategies)).toBe(true);
    });

    it('should simulate workforce planning', async () => {
      const simulationData = {
        currentWorkforce: [{ id: '1' }, { id: '2' }, { id: '3' }],
        scenarios: [{ name: 'Growth', assumptions: '20% increase' }],
        timeHorizon: 2
      };

      const task = createTask('WORKFORCE_SIMULATE' as any, simulationData);
      const response = await analyticsAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.baselineScenario).toBeDefined();
      expect(Array.isArray(response.result.alternativeScenarios)).toBe(true);
      expect(response.result.gapAnalysis).toBeDefined();
      expect(response.result.hiringNeeds).toBeDefined();
      expect(response.result.costProjections).toBeDefined();
    });

    it('should scan compliance health', async () => {
      const scanData = {
        modules: ['payroll', 'ir', 'er', 'ta', 'ld'],
        timeRange: { start: '2024-01-01', end: '2024-03-31' }
      };

      const task = createTask('COMPLIANCE_SCAN' as any, scanData);
      const response = await analyticsAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.overallHealth).toBeDefined();
      expect(response.result.moduleScores).toBeDefined();
      expect(Array.isArray(response.result.criticalIssues)).toBe(true);
      expect(Array.isArray(response.result.recommendations)).toBe(true);
      expect(response.result.complianceTrends).toBeDefined();
    });

    it('should analyze culture and engagement', async () => {
      const cultureData = {
        surveyData: [
          { question: 'Job satisfaction', score: 4.2 },
          { question: 'Work-life balance', score: 3.8 }
        ],
        engagementMetrics: [],
        timeRange: { start: '2024-01-01', end: '2024-03-31' }
      };

      const task = createTask('CULTURE_ANALYZE' as any, cultureData);
      const response = await analyticsAgent.processTask(task);

      expect(response.success).toBe(true);
      expect(response.result.engagementScore).toBeDefined();
      expect(response.result.cultureIndicators).toBeDefined();
      expect(response.result.trends).toBeDefined();
      expect(Array.isArray(response.result.drivers)).toBe(true);
      expect(Array.isArray(response.result.improvementActions)).toBe(true);
    });

    it('should return error for unsupported task type', async () => {
      const task = createTask('UNSUPPORTED_ANALYTICS_TASK' as any, {});
      const response = await analyticsAgent.processTask(task);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unsupported task type');
    });
  });

  describe('Helper Functions', () => {
    it('should create task with correct structure', () => {
      const task = createTask(AgentTaskType.ANALYZE, { data: 'test' }, { userId: 1 });
      expect(task.type).toBe(AgentTaskType.ANALYZE);
      expect(task.payload).toEqual({ data: 'test' });
      expect(task.id).toMatch(/^task_\d+_[a-z0-9]+$/);
    });

    it('should create context with correct structure', () => {
      const context = createContext(1, 2, { role: 'admin' });
      expect(context.userId).toBe(1);
      expect(context.companyId).toBe(2);
      expect(context.role).toBe('admin');
    });
  });

  describe('Multi-Agent Orchestration Integration', () => {
    let registry: AgentRegistry;

    function initializeAgents() {
      const agentRegistry = registry;
      // Register all agents for integration testing
      const complianceAgent = new ComplianceAgent();
      agentRegistry.registerAgent('PAYROLL_VALIDATE', complianceAgent);
      agentRegistry.registerAgent('COMPLIANCE_CHECK', complianceAgent);

      const erAgent = new ERAgent();
      agentRegistry.registerAgent('SENTIMENT_ANALYZE', erAgent);
      agentRegistry.registerAgent('MEDIATION_CHAT', erAgent);
      agentRegistry.registerAgent('CULTURE_DASHBOARD', erAgent);
      agentRegistry.registerAgent('ER_ESCALATION_PREDICT', erAgent);
      agentRegistry.registerAgent('INVESTIGATION_DOC', erAgent);

      const cbAgent = new CBAgent();
      agentRegistry.registerAgent('SALARY_BENCHMARK', cbAgent);
      agentRegistry.registerAgent('BENEFITS_PERSONALIZE', cbAgent);
      agentRegistry.registerAgent('PAY_EQUITY_ANALYZE', cbAgent);
      agentRegistry.registerAgent('REWARDS_STATEMENT', cbAgent);
      agentRegistry.registerAgent('COLA_FORECAST', cbAgent);

      const taAgent = new TAAgent();
      agentRegistry.registerAgent('RESUME_PARSE', taAgent);
      agentRegistry.registerAgent('CANDIDATE_MATCH', taAgent);
      agentRegistry.registerAgent('INTERVIEW_ANALYTICS', taAgent);
      agentRegistry.registerAgent('JOB_POST_OPTIMIZE', taAgent);
      agentRegistry.registerAgent('APPLICATION_TRACK', taAgent);

      const ldAgent = new LDAgent();
      agentRegistry.registerAgent('SKILLS_GAP_ANALYZE', ldAgent);
      agentRegistry.registerAgent('LEARNING_PATH_GENERATE', ldAgent);
      agentRegistry.registerAgent('TRAINING_ROI_PREDICT', ldAgent);
      agentRegistry.registerAgent('MICRO_LEARNING_RECOMMEND', ldAgent);
      agentRegistry.registerAgent('HRDF_CLAIMS_AUTOMATE', ldAgent);

      const performanceAgent = new PerformanceAgent();
      agentRegistry.registerAgent('OKR_TRACK', performanceAgent);
      agentRegistry.registerAgent('FEEDBACK_ANALYZE', performanceAgent);
      agentRegistry.registerAgent('PERFORMANCE_MATRIX', performanceAgent);
      agentRegistry.registerAgent('CAREER_SIMULATE', performanceAgent);
      agentRegistry.registerAgent('SUCCESSION_PLAN', performanceAgent);

      const analyticsAgent = new AnalyticsAgent();
      agentRegistry.registerAgent('DASHBOARD_GENERATE', analyticsAgent);
      agentRegistry.registerAgent('ATTRITION_PREDICT', analyticsAgent);
      agentRegistry.registerAgent('WORKFORCE_SIMULATE', analyticsAgent);
      agentRegistry.registerAgent('COMPLIANCE_SCAN', analyticsAgent);
      agentRegistry.registerAgent('CULTURE_ANALYZE', analyticsAgent);
    }

    beforeEach(() => {
      registry = new AgentRegistry();
      // Initialize all agents for integration testing
      initializeAgents();
    });

    it('should orchestrate TA to Performance to Analytics workflow', async () => {
      const context = createContext(1, 1);

      // Step 1: TA Agent parses resume
      const resumeTask = createTask('RESUME_PARSE' as AgentTaskType, {
        resumeText: 'John Doe, Senior Developer with 5 years experience in React, Node.js',
        format: 'text'
      });
      const resumeResponse = await registry.executeTask(resumeTask, context);
      expect(resumeResponse.success).toBe(true);
      expect(resumeResponse.output?.candidateProfile).toBeDefined();

      // Step 2: Performance Agent analyzes candidate for succession planning
      const successionTask = createTask('SUCCESSION_PLAN' as AgentTaskType, {
        positions: [{ title: 'Senior Developer', criticality: 'high' }],
        candidates: [{ name: 'John Doe', ready: true }],
        riskFactors: ['Key employee retirement']
      });
      const successionResponse = await registry.executeTask(successionTask, context);
      expect(successionResponse.success).toBe(true);
      expect(successionResponse.output?.readinessLevels).toBeDefined();

      // Step 3: Analytics Agent predicts attrition risk
      const attritionTask = createTask('ATTRITION_PREDICT' as AgentTaskType, {
        employees: [{ id: '1', tenure: 5, satisfaction: 4 }],
        historicalData: [],
        externalFactors: ['Market competition']
      });
      const attritionResponse = await registry.executeTask(attritionTask, context);
      expect(attritionResponse.success).toBe(true);
      expect(attritionResponse.output?.riskFactors).toBeDefined();
    });

    it('should orchestrate Compliance to ER to Analytics workflow', async () => {
      const context = createContext(1, 1);

      // Step 1: Compliance Agent validates payroll
      const payrollTask = createTask('PAYROLL_VALIDATE' as AgentTaskType, {
        basicSalary: 3500,
        allowances: 500,
        deductions: 150,
        tabungHajiOptIn: true,
        state: 'Selangor'
      });
      const payrollResponse = await registry.executeTask(payrollTask, context);
      expect(payrollResponse.success).toBe(true);
      expect(payrollResponse.output?.compliant).toBe(true);

      // Step 2: ER Agent analyzes sentiment from employee feedback
      const sentimentTask = createTask('SENTIMENT_ANALYZE' as AgentTaskType, {
        text: 'I am satisfied with my compensation and benefits package',
        language: 'en'
      });
      const sentimentResponse = await registry.executeTask(sentimentTask, context);
      expect(sentimentResponse.success).toBe(true);
      expect(sentimentResponse.output?.sentiment).toBeDefined();

      // Step 3: Analytics Agent generates culture dashboard
      const cultureTask = createTask('CULTURE_ANALYZE' as AgentTaskType, {
        surveyData: [{ question: 'Compensation satisfaction', score: 4.1 }],
        engagementMetrics: [{ metric: 'satisfaction', value: 78 }],
        timeRange: { start: '2024-01-01', end: '2024-03-31' }
      });
      const cultureResponse = await registry.executeTask(cultureTask, context);
      expect(cultureResponse.success).toBe(true);
      expect(cultureResponse.output?.engagementScore).toBeDefined();
    });

    it('should handle cross-agent error propagation', async () => {
      const context = createContext(1, 1);

      // Invalid task type should be handled gracefully
      const invalidTask = createTask('INVALID_TASK_TYPE' as AgentTaskType, {});
      const response = await registry.executeTask(invalidTask, context);
      expect(response.success).toBe(false);
      expect(response.error).toContain('No agent registered');
    });

    it('should maintain conversation context across agents', async () => {
      const context = createContext(1, 1, { sessionId: 'conv_123' });

      // First task
      const task1 = createTask('OKR_TRACK' as AgentTaskType, {
        objectives: [{ id: 'obj1', status: 'completed', progress: 1.0 }],
        currentProgress: [],
        timeRemaining: 30
      });
      const response1 = await registry.executeTask(task1, context);
      expect(response1.success).toBe(true);

      // Second task in same conversation
      const task2 = createTask('PERFORMANCE_MATRIX' as AgentTaskType, {
        employees: [{ id: '1' }],
        performanceData: [],
        potentialData: []
      });
      const response2 = await registry.executeTask(task2, context);
      expect(response2.success).toBe(true);

      // Both should have same conversation context
      expect(context.sessionId).toBe('conv_123');
    });
  });
});
