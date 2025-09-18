# AI Agents User Guide

## Introduction

Welcome to the AI Agents system for HR management. This guide will help you understand how to effectively use the various AI agents available in the system to streamline your HR processes.

## Getting Started

### Authentication

Before using any AI agent, ensure you have:
1. A valid user account with appropriate permissions
2. An active JWT token for API authentication
3. Access to the relevant HR modules

### Basic API Usage

All AI agent interactions happen through the `/api/ai/dispatch` endpoint:

```javascript
const response = await fetch('/api/ai/dispatch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + yourToken
  },
  body: JSON.stringify({
    taskType: 'YOUR_TASK_TYPE',
    input: { /* your input data */ }
  })
});
```

## Talent Acquisition (TA) Agent

### Resume Parsing

Extract structured information from candidate resumes:

```javascript
const result = await dispatchTask('RESUME_PARSE', {
  resumeText: resumeContent,
  format: 'text' // or 'pdf', 'docx'
});

// Result contains:
// - candidateProfile: Basic info (name, email, phone)
// - skills: Array of detected skills
// - experience: Work history
// - education: Educational background
// - confidence: Parsing confidence score
```

### Candidate-Job Matching

Match candidates with job requirements:

```javascript
const result = await dispatchTask('CANDIDATE_MATCH', {
  candidateProfile: parsedResume,
  jobRequirements: {
    requiredSkills: ['JavaScript', 'React'],
    minExperience: 3,
    location: 'KL'
  }
});

// Result contains:
// - matchScore: Overall compatibility (0-1)
// - skillMatch: Skills alignment score
// - experienceMatch: Experience fit score
// - cultureFit: Cultural alignment score
// - recommendations: Suggested next steps
```

### Interview Analytics

Analyze interview performance:

```javascript
const result = await dispatchTask('INTERVIEW_ANALYTICS', {
  interviewTranscript: transcriptText,
  candidateId: 'CAND001',
  jobId: 'JOB001'
});

// Result contains:
// - overallScore: Interview performance (0-1)
// - strengths: Key strengths identified
// - areasForImprovement: Development areas
// - hiringRecommendation: Hire/No-hire suggestion
```

### Job Post Optimization

Improve job postings for better candidate attraction:

```javascript
const result = await dispatchTask('JOB_POST_OPTIMIZE', {
  jobDescription: currentDescription,
  targetCandidates: {
    experience: '3-5 years',
    skills: ['JavaScript', 'Python']
  }
});

// Result contains:
// - optimizedDescription: Improved job description
// - suggestedKeywords: SEO keywords to include
// - diversityScore: Diversity-friendly language score
// - attractivenessScore: Overall appeal score
```

## Compliance Agent

### Payroll Validation

Validate payroll calculations and compliance:

```javascript
const result = await dispatchTask('PAYROLL_VALIDATE', {
  basicSalary: 3500,
  allowances: 500,
  deductions: 150,
  tabungHajiOptIn: true,
  state: 'Selangor'
});

// Result contains:
// - payroll: Complete payroll breakdown
// - validations: Compliance check results
// - compliant: Overall compliance status
// - alerts: Any issues or warnings
```

### Compliance Checks

Perform comprehensive compliance verification:

```javascript
const result = await dispatchTask('COMPLIANCE_CHECK', {
  companyId: 1,
  period: '2024-01'
});

// Result contains:
// - checks: Array of compliance checks
// - overallCompliant: Summary status
// - recommendations: Suggested actions
```

## Employee Relations (ER) Agent

### Sentiment Analysis

Analyze employee feedback sentiment:

```javascript
const result = await dispatchTask('SENTIMENT_ANALYZE', {
  text: employeeFeedback,
  language: 'en' // or 'bm' for Bahasa Malaysia
});

// Result contains:
// - sentiment: 'positive', 'negative', or 'neutral'
// - confidence: Analysis confidence score
// - keywords: Key sentiment indicators
// - recommendations: Suggested follow-up actions
```

### Mediation Chat

Handle employee mediation conversations:

```javascript
const result = await dispatchTask('MEDIATION_CHAT', {
  message: employeeMessage,
  language: 'en',
  conversationHistory: previousMessages
});

// Result contains:
// - response: AI-generated mediation response
// - escalationNeeded: Whether human intervention required
// - nextSteps: Recommended actions
```

### Culture Dashboard

Generate culture health insights:

```javascript
const result = await dispatchTask('CULTURE_DASHBOARD', {
  surveyResults: surveyData,
  feedbackData: feedbackArray
});

// Result contains:
// - engagementScore: Overall engagement (0-100)
// - deiScore: Diversity, Equity & Inclusion score
// - alerts: Critical culture issues
// - trends: Culture trend analysis
// - recommendations: Improvement suggestions
```

## Compensation & Benefits (C&B) Agent

### Salary Benchmarking

Compare salaries against market data:

```javascript
const result = await dispatchTask('SALARY_BENCHMARK', {
  role: 'Software Engineer',
  experience: 5,
  location: 'KL',
  industry: 'Technology'
});

// Result contains:
// - benchmarkSalary: Market median salary
// - range: Salary range (25th-75th percentile)
// - sources: Data sources used
// - recommendations: Salary adjustment suggestions
```

### Benefits Personalization

Create personalized benefits packages:

```javascript
const result = await dispatchTask('BENEFITS_PERSONALIZE', {
  employeeProfile: {
    age: 30,
    dependents: 2,
    location: 'KL'
  },
  preferences: {
    health: true,
    dental: false,
    flexibleHours: true
  },
  budget: 500
});

// Result contains:
// - recommendedBenefits: Personalized benefits list
// - totalValue: Total benefits value
// - employeeSatisfaction: Predicted satisfaction score
```

### Pay Equity Analysis

Analyze pay equity across the organization:

```javascript
const result = await dispatchTask('PAY_EQUITY_ANALYZE', {
  employees: employeeData,
  demographics: companyDemographics
});

// Result contains:
// - equityScore: Overall equity score (0-100)
// - disparities: Identified pay gaps
// - recommendations: Equity improvement actions
// - complianceStatus: Regulatory compliance status
```

## Learning & Development (L&D) Agent

### Skills Gap Analysis

Identify employee skills gaps:

```javascript
const result = await dispatchTask('SKILLS_GAP_ANALYZE', {
  employeeSkills: currentSkills,
  roleRequirements: jobRequirements,
  performanceData: performanceMetrics
});

// Result contains:
// - skillGaps: Identified gaps with severity
// - proficiencyLevels: Current proficiency assessment
// - prioritySkills: Skills needing immediate attention
// - developmentNeeds: Recommended training
// - timeline: Suggested development timeline
```

### Learning Path Generation

Create personalized learning paths:

```javascript
const result = await dispatchTask('LEARNING_PATH_GENERATE', {
  employeeId: 'EMP001',
  skillGaps: identifiedGaps,
  preferences: learningPreferences,
  timeAvailable: '10 hours/week'
});

// Result contains:
// - learningPath: Structured learning modules
// - duration: Total path duration
// - resources: Recommended learning resources
// - milestones: Progress checkpoints
// - successProbability: Completion likelihood
```

## Performance Agent

### OKR Tracking

Track Objectives and Key Results:

```javascript
const result = await dispatchTask('OKR_TRACK', {
  objectives: okrData,
  currentProgress: progressData,
  timeRemaining: 45 // days
});

// Result contains:
// - predictedCompletion: Expected completion percentage
// - riskLevel: 'Low', 'Medium', or 'High'
// - recommendations: Course correction suggestions
// - milestones: Key checkpoints
// - interventions: Required actions if at risk
```

### 360° Feedback Analysis

Analyze multi-rater feedback:

```javascript
const result = await dispatchTask('FEEDBACK_ANALYZE', {
  feedbackData: [
    { reviewer: 'Manager', rating: 4.2, comments: '...' },
    { reviewer: 'Peer', rating: 3.8, comments: '...' }
  ],
  employeeId: 'EMP001'
});

// Result contains:
// - overallScore: Aggregated feedback score
// - sentimentBreakdown: Positive/neutral/negative distribution
// - biasIndicators: Potential bias flags
// - strengths: Key strengths identified
// - developmentAreas: Areas for improvement
// - actionPlan: Recommended development actions
```

### 9-Box Matrix

Generate performance-potential matrix:

```javascript
const result = await dispatchTask('PERFORMANCE_MATRIX', {
  employees: employeeList,
  performanceData: performanceScores,
  potentialData: potentialAssessments
});

// Result contains:
// - matrix: 9-box grid with employee distribution
// - distribution: Summary statistics
// - highPerformers: Top performers list
// - highPotentials: High potential employees
// - criticalTalents: Key talent to retain
// - recommendations: Talent management actions
```

## Analytics Agent

### Predictive Dashboard

Generate predictive HR insights:

```javascript
const result = await dispatchTask('DASHBOARD_GENERATE', {
  module: 'overall',
  timeRange: { start: '2024-01-01', end: '2024-03-31' },
  filters: { department: 'IT' }
});

// Result contains:
// - dashboard: Predictive metrics and insights
// - insights: Key findings and trends
// - predictions: Forecasted metrics
// - recommendations: Actionable insights
// - alerts: Critical issues requiring attention
```

### Attrition Prediction

Predict employee turnover risk:

```javascript
const result = await dispatchTask('ATTRITION_PREDICT', {
  employees: employeeData,
  historicalData: pastTurnoverData,
  externalFactors: ['Market competition', 'Economic conditions']
});

// Result contains:
// - highRiskEmployees: Employees at risk of leaving
// - riskFactors: Contributing factors
// - timeline: When turnover might occur
// - interventions: Retention strategies
// - retentionStrategies: Recommended actions
```

## Best Practices

### 1. Input Quality
- Provide complete and accurate data for best results
- Use structured data when possible
- Include relevant context and metadata

### 2. Error Handling
- Always check the `success` field in responses
- Handle timeout scenarios gracefully
- Implement retry logic for transient failures

### 3. Rate Limiting
- Respect API rate limits (100 req/min, 1000 req/hour)
- Implement exponential backoff for retries
- Cache results when appropriate

### 4. Privacy & Security
- Never include sensitive PII in logs
- Use HTTPS for all API calls
- Regularly rotate authentication tokens

### 5. Monitoring & Analytics
- Track API usage and performance
- Monitor agent response times
- Log errors for debugging and improvement

## Troubleshooting

### Common Issues

**Task Timeout**
- Reduce input data size
- Check network connectivity
- Contact support if persistent

**Invalid Task Type**
- Verify task type spelling
- Check available task types in documentation
- Ensure proper capitalization

**Authentication Errors**
- Verify JWT token validity
- Check user permissions
- Confirm token hasn't expired

**Low Confidence Scores**
- Provide more complete input data
- Use structured formats when possible
- Consider manual review for critical decisions

## Support

For technical support or questions:
- Check the API documentation for detailed specifications
- Review the integration examples
- Contact the development team for custom implementations

## Version History

- **v1.0**: Initial release with core AI agents
- **v1.1**: Added government API integrations
- **v1.2**: Enhanced multi-agent orchestration
- **v1.3**: Improved error handling and retry logic
