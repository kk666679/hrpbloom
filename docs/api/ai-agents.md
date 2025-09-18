# AI Agents API Documentation

## Overview

The AI Agents API provides access to a multi-agent system designed for HR management. The system includes specialized agents for various HR functions including compliance, talent acquisition, performance management, and analytics.

## Base URL

```
/api/ai
```

## Authentication

All API requests require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### POST /api/ai/dispatch

Dispatch a task to the appropriate AI agent.

**Request Body:**
```json
{
  "taskType": "RESUME_PARSE",
  "input": {
    "resumeText": "John Doe, Software Engineer...",
    "format": "text"
  },
  "priority": "MEDIUM",
  "metadata": {},
  "preferredAgents": [],
  "timeout": 30000
}
```

**Response:**
```json
{
  "success": true,
  "assignedAgent": "TA Agent",
  "response": {
    "taskId": "task_1234567890_abc123",
    "success": true,
    "result": {
      "candidateProfile": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": [...],
      "confidence": 0.85
    }
  },
  "processingTime": 1250
}
```

### GET /api/ai/dispatch

Get system health and available agents.

**Response:**
```json
{
  "systemHealth": {
    "status": "healthy",
    "uptime": "2d 4h 30m",
    "activeAgents": 8
  },
  "availableAgents": [
    {
      "name": "TA Agent",
      "type": "TA",
      "isActive": true,
      "capabilities": ["RESUME_PARSE", "CANDIDATE_MATCH"],
      "status": "ready"
    }
  ],
  "coordinator": {
    "name": "Coordinator",
    "type": "COORDINATOR",
    "registeredAgents": 8
  }
}
```

## Task Types

### Talent Acquisition (TA) Agent

- `RESUME_PARSE`: Parse resume text and extract candidate information
- `CANDIDATE_MATCH`: Match candidate profile with job requirements
- `INTERVIEW_ANALYTICS`: Analyze interview performance
- `JOB_POST_OPTIMIZE`: Optimize job posting for better candidate attraction
- `APPLICATION_TRACK`: Track application progress and predict dropout risk

### Compliance Agent

- `PAYROLL_VALIDATE`: Validate payroll calculations and compliance
- `COMPLIANCE_CHECK`: Perform comprehensive compliance checks

### Employee Relations (ER) Agent

- `SENTIMENT_ANALYZE`: Analyze employee sentiment from feedback
- `MEDIATION_CHAT`: Handle mediation conversations
- `CULTURE_DASHBOARD`: Generate culture health dashboard
- `ER_ESCALATION_PREDICT`: Predict ER case escalation risk
- `INVESTIGATION_DOC`: Document investigation findings

### Compensation & Benefits (C&B) Agent

- `SALARY_BENCHMARK`: Benchmark salary against market data
- `BENEFITS_PERSONALIZE`: Personalize benefits packages
- `PAY_EQUITY_ANALYZE`: Analyze pay equity across organization
- `REWARDS_STATEMENT`: Generate total rewards statements
- `COLA_FORECAST`: Forecast cost of living adjustments

### Learning & Development (L&D) Agent

- `SKILLS_GAP_ANALYZE`: Analyze employee skills gaps
- `LEARNING_PATH_GENERATE`: Generate personalized learning paths
- `TRAINING_ROI_PREDICT`: Predict training return on investment
- `MICRO_LEARNING_RECOMMEND`: Recommend micro-learning content
- `HRDF_CLAIMS_AUTOMATE`: Automate HRDF claims processing

### Performance Agent

- `OKR_TRACK`: Track OKR progress and predict completion
- `FEEDBACK_ANALYZE`: Analyze 360-degree feedback
- `PERFORMANCE_MATRIX`: Generate 9-box performance matrix
- `CAREER_SIMULATE`: Simulate career progression scenarios
- `SUCCESSION_PLAN`: Plan leadership succession

### Analytics Agent

- `DASHBOARD_GENERATE`: Generate predictive HR dashboards
- `ATTRITION_PREDICT`: Predict employee attrition risk
- `WORKFORCE_SIMULATE`: Simulate workforce planning scenarios
- `COMPLIANCE_SCAN`: Scan compliance health across modules
- `CULTURE_ANALYZE`: Analyze culture and engagement metrics

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `INVALID_TASK_TYPE`: Unsupported task type
- `AGENT_UNAVAILABLE`: Requested agent is not available
- `TIMEOUT`: Task execution timed out
- `VALIDATION_ERROR`: Input validation failed

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per organization
- Burst limit: 20 requests per second

## Webhooks

Configure webhooks to receive task completion notifications:

```json
{
  "event": "task.completed",
  "taskId": "task_1234567890_abc123",
  "success": true,
  "result": { ... },
  "processingTime": 1250,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Examples

### Resume Parsing

```javascript
const response = await fetch('/api/ai/dispatch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    taskType: 'RESUME_PARSE',
    input: {
      resumeText: resumeContent,
      format: 'text'
    }
  })
});

const result = await response.json();
console.log('Parsed candidate:', result.response.result.candidateProfile);
```

### Sentiment Analysis

```javascript
const response = await fetch('/api/ai/dispatch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    taskType: 'SENTIMENT_ANALYZE',
    input: {
      text: employeeFeedback,
      language: 'en'
    }
  })
});

const result = await response.json();
console.log('Sentiment:', result.response.result.sentiment);
