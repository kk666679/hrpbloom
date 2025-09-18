import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { kwspClient } from '@/lib/government-apis';

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
    const { action, epfNumber, contributionData } = body;

    switch (action) {
      case 'validate':
        if (!epfNumber) {
          return NextResponse.json(
            { error: 'EPF number is required' },
            { status: 400 }
          );
        }

        const validationResult = await kwspClient.validateEPF(epfNumber);
        return NextResponse.json(validationResult);

      case 'submit':
        if (!contributionData) {
          return NextResponse.json(
            { error: 'Contribution data is required' },
            { status: 400 }
          );
        }

        const submissionResult = await kwspClient.submitContribution(contributionData);
        return NextResponse.json(submissionResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('KWSP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
