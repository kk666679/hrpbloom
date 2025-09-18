import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { CBAgent } from '@/lib/ai-agents-cb';
import { AgentTask, AgentTaskType, TaskPriority } from '@/types/ai-agents';

const cbAgent = new CBAgent();

// POST /api/cb - Process CB agent tasks
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
      AgentTaskType.ANALYZE
    ];

    if (!validTaskTypes.includes(taskType)) {
      return NextResponse.json(
        { error: 'Invalid task type for CB agent' },
        { status: 400 }
      );
    }

    // Create agent task
    const task: AgentTask = {
      id: `cb-${Date.now()}`,
      type: taskType,
      input: input,
      priority: TaskPriority.MEDIUM,
      createdAt: new Date(),
      userId: parseInt(user.id),
    };

    // Process task with CB agent
    const response = await cbAgent.processTask(task);

    return NextResponse.json({
      taskId: task.id,
      success: response.success,
      output: response.output,
      confidence: response.confidence,
      processingTime: response.processingTime,
      completedAt: response.completedAt,
    });
  } catch (error) {
    console.error('Error processing CB task:', error);
    return NextResponse.json(
      { error: 'Failed to process CB task' },
      { status: 500 }
    );
  }
}

// GET /api/cb/capabilities - Get CB agent capabilities
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
      agent: 'CB Agent',
      capabilities: [
        {
          name: 'compensation_analysis',
          description: 'Analyze compensation structures and market competitiveness',
          inputSchema: {
            employeeData: 'object',
            marketData: 'object',
            companyPolicies: 'object'
          },
          outputSchema: {
            competitivenessScore: 'number',
            recommendations: 'array',
            riskAreas: 'array'
          }
        },
        {
          name: 'benefits_optimization',
          description: 'Optimize employee benefits packages',
          inputSchema: {
            currentBenefits: 'object',
            employeeDemographics: 'object',
            costConstraints: 'object'
          },
          outputSchema: {
            optimizedPackage: 'object',
            costSavings: 'number',
            employeeSatisfaction: 'number'
          }
        },
        {
          name: 'salary_benchmarking',
          description: 'Benchmark salaries against market standards',
          inputSchema: {
            position: 'string',
            experience: 'number',
            location: 'string',
            industry: 'string'
          },
          outputSchema: {
            marketRange: 'object',
            recommendedSalary: 'number',
            justification: 'string'
          }
        }
      ],
      supportedTaskTypes: [
        AgentTaskType.ANALYZE
      ],
    });
  } catch (error) {
    console.error('Error fetching CB capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CB capabilities' },
      { status: 500 }
    );
  }
}
