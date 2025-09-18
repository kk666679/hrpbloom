import { describe, it, expect, beforeAll } from 'vitest';
import { AgentRegistry, createTask, createContext, initializeAgents } from '@/lib/ai-agents';
import { AgentTaskType, TaskPriority } from '@/types/ai-agents';

describe('Multi-Agent Orchestration Integration Tests', () => {
  let registry: AgentRegistry;

  beforeAll(() => {
    registry = new AgentRegistry();
    // Initialize all agents for integration testing
    initializeAgents();
  });

  it('should orchestrate TA to Performance to Analytics workflow', async () => {
    const context = createContext(1, 1);

    // Step 1: TA Agent parses resume
    const resumeTask = createTask(AgentTaskType.RESUME_PARSE, {
      resumeText: 'John Doe, Senior Developer with 5 years experience in React, Node.js',
      format: 'text'
    });
    const resumeResponse = await registry.executeTask(resumeTask, context);
    expect(resumeResponse.success).toBe(true);
    expect(resumeResponse.output?.candidateProfile).toBeDefined();

    // Step 2: Performance Agent analyzes candidate for succession planning
    const successionTask = createTask(AgentTaskType.SUCCESSION_PLAN, {
      positions: [{ title: 'Senior Developer', criticality: 'high' }],
      candidates: [{ name: 'John Doe', ready: true }],
      riskFactors: ['Key employee retirement']
    });
    const successionResponse = await registry.executeTask(successionTask, context);
    expect(successionResponse.success).toBe(true);
    expect(successionResponse.output?.readinessLevels).toBeDefined();

    // Step 3: Analytics Agent predicts attrition risk
    const attritionTask = createTask(AgentTaskType.ATTRITION_PREDICT, {
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
    const payrollTask = createTask(AgentTaskType.PAYROLL_VALIDATE, {
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
    const sentimentTask = createTask(AgentTaskType.SENTIMENT_ANALYZE, {
      text: 'I am satisfied with my compensation and benefits package',
      language: 'en'
    });
    const sentimentResponse = await registry.executeTask(sentimentTask, context);
    expect(sentimentResponse.success).toBe(true);
    expect(sentimentResponse.output?.sentiment).toBeDefined();

    // Step 3: Analytics Agent generates culture dashboard
    const cultureTask = createTask(AgentTaskType.CULTURE_ANALYZE, {
      surveyData: [{ question: 'Compensation satisfaction', score: 4.1 }],
      engagementMetrics: [{ metric: 'satisfaction', value: 78 }],
      timeRange: { start: '2024-01-01', end: '2024-03-31' }
    });
    const cultureResponse = await registry.executeTask(cultureTask, context);
    expect(cultureResponse.success).toBe(true);
    expect(cultureResponse.output?.engagementScore).toBeDefined();
  });

  it('should orchestrate TA to L&D to Performance workflow', async () => {
    const context = createContext(1, 1);

    // Step 1: TA Agent parses resume and matches candidate
    const resumeTask = createTask(AgentTaskType.RESUME_PARSE, {
      resumeText: 'Senior React Developer with 5 years experience',
      format: 'text'
    });
    const resumeResponse = await registry.executeTask(resumeTask, context);
    expect(resumeResponse.success).toBe(true);
    expect(resumeResponse.output?.candidateProfile).toBeDefined();

    // Step 2: L&D Agent analyzes skills gaps
    const skillsGapTask = createTask(AgentTaskType.SKILLS_GAP_ANALYZE, {
      employeeSkills: [{ skill: 'React', level: 0.8 }, { skill: 'Leadership', level: 0.5 }],
      roleRequirements: [{ skill: 'React', required: 0.9 }, { skill: 'Leadership', required: 0.7 }],
      performanceData: { rating: 4.2 }
    });
    const skillsGapResponse = await registry.executeTask(skillsGapTask, context);
    expect(skillsGapResponse.success).toBe(true);
    expect(skillsGapResponse.output?.skillGaps).toBeDefined();

    // Step 3: Performance Agent tracks OKRs
    const okrTask = createTask(AgentTaskType.OKR_TRACK, {
      objectives: [{ title: 'Improve React skills', progress: 0.7 }],
      currentProgress: [0.7],
      timeRemaining: 30
    });
    const okrResponse = await registry.executeTask(okrTask, context);
    expect(okrResponse.success).toBe(true);
    expect(okrResponse.output?.predictedCompletion).toBeDefined();
  });

  it('should handle error scenarios and fallback mechanisms', async () => {
    const context = createContext(1, 1);

    // Test invalid task type
    const invalidTask = createTask('INVALID_TASK_TYPE' as any, {});
    const invalidResponse = await registry.executeTask(invalidTask, context);
    expect(invalidResponse.success).toBe(false);
    expect(invalidResponse.error).toContain('No agent registered');

    // Test agent processing error
    const errorTask = createTask(AgentTaskType.RESUME_PARSE, {
      resumeText: null, // Invalid input that should cause error
      format: 'text'
    });
    const errorResponse = await registry.executeTask(errorTask, context);
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBeDefined();
  });

  it('should orchestrate end-to-end candidate hiring workflow', async () => {
    const context = createContext(1, 1);

    // Step 1: Parse resume
    const resumeTask = createTask(AgentTaskType.RESUME_PARSE, {
      resumeText: 'Experienced software engineer with leadership skills',
      format: 'text'
    });
    const resumeResponse = await registry.executeTask(resumeTask, context);
    expect(resumeResponse.success).toBe(true);

    // Step 2: Match candidate to job
    const matchTask = createTask(AgentTaskType.CANDIDATE_MATCH, {
      candidateProfile: resumeResponse.output?.candidateProfile,
      jobRequirements: { skills: ['JavaScript', 'Leadership'], experience: 5 }
    });
    const matchResponse = await registry.executeTask(matchTask, context);
    expect(matchResponse.success).toBe(true);

    // Step 3: Analyze interview performance
    const interviewTask = createTask(AgentTaskType.INTERVIEW_ANALYTICS, {
      interviewTranscript: 'Candidate demonstrated strong technical skills and leadership potential',
      candidateId: 'CAND001',
      jobId: 'JOB001'
    });
    const interviewResponse = await registry.executeTask(interviewTask, context);
    expect(interviewResponse.success).toBe(true);

    // Step 4: Generate performance matrix for new hire
    const matrixTask = createTask(AgentTaskType.PERFORMANCE_MATRIX, {
      employees: [{ id: 'NEW001', name: 'New Hire', performance: 0.8, potential: 0.9 }],
      performanceData: [{ employeeId: 'NEW001', rating: 4.0 }],
      potentialData: [{ employeeId: 'NEW001', potential: 0.9 }]
    });
    const matrixResponse = await registry.executeTask(matrixTask, context);
    expect(matrixResponse.success).toBe(true);
  });
});
