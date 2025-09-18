import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { ERAgent } from '@/lib/ai-agents-er';
import { AgentTask, AgentTaskType, TaskPriority } from '@/types/ai-agents';

const erAgent = new ERAgent();

// POST /api/er - Process ER agent tasks
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { taskType, input } = body;

    if (!taskType || !input) {
      return NextResponse.json(
        { error: 'Task type and input are required' },
        { status: 400 }
      );
    }

    // Validate task type
    const validTaskTypes = [
      AgentTaskType.SENTIMENT_ANALYSIS,
      AgentTaskType.ANALYZE
    ];

    if (!validTaskTypes.includes(taskType)) {
      return NextResponse.json(
        { error: 'Invalid task type for ER agent' },
        { status: 400 }
      );
    }

    // Create agent task
    const task: AgentTask = {
      id: `er-${Date.now()}`,
      type: taskType,
      input: input,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date(),
      userId: parseInt(user.id),
    };

    // Process task with ER agent
    const response = await erAgent.processTask(task);

    return NextResponse.json({
      taskId: task.id,
      success: response.success,
      output: response.output,
      confidence: response.confidence,
      processingTime: response.processingTime,
      completedAt: response.completedAt,
    });
  } catch (error) {
    console.error('Error processing ER task:', error);
    return NextResponse.json(
      { error: 'Failed to process ER task' },
      { status: 500 }
    );
  }
}

// GET /api/er/capabilities - Get ER agent capabilities
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      agent: 'ER Agent',
      capabilities: [
        {
          name: 'sentiment_analysis',
          description: 'Analyze employee sentiment from surveys, feedback, and communications',
          inputSchema: {
            textData: 'array',
            context: 'object',
            language: 'string'
          },
          outputSchema: {
            overallSentiment: 'string',
            sentimentScore: 'number',
            keyThemes: 'array',
            recommendations: 'array'
          }
        },
        {
          name: 'dei_monitoring',
          description: 'Monitor diversity, equity, and inclusion metrics',
          inputSchema: {
            employeeDemographics: 'object',
            policies: 'object',
            incidents: 'array'
          },
          outputSchema: {
            deiScore: 'number',
            gaps: 'array',
            recommendations: 'array',
            riskAreas: 'array'
          }
        },
        {
          name: 'case_escalation_prediction',
          description: 'Predict potential ER case escalations',
          inputSchema: {
            employeeData: 'object',
            incidentHistory: 'array',
            communicationPatterns: 'array'
          },
          outputSchema: {
            escalationRisk: 'string',
            predictedTimeline: 'string',
            preventiveActions: 'array'
          }
        }
      ],
      supportedTaskTypes: [
        AgentTaskType.SENTIMENT_ANALYSIS,
        AgentTaskType.ANALYZE
      ],
    });
  } catch (error) {
    console.error('Error fetching ER capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ER capabilities' },
      { status: 500 }
    );
  }
}
