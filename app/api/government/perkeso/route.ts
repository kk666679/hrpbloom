import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { perkesoClient } from '@/lib/government-apis';

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
    const { action, socsoNumber, contributionData } = body;

    switch (action) {
      case 'validate':
        if (!socsoNumber) {
          return NextResponse.json(
            { error: 'SOCSO number is required' },
            { status: 400 }
          );
        }

        const validationResult = await perkesoClient.validateSOCSO(socsoNumber);
        return NextResponse.json(validationResult);

      case 'submit':
        if (!contributionData) {
          return NextResponse.json(
            { error: 'Contribution data is required' },
            { status: 400 }
          );
        }

        const submissionResult = await perkesoClient.submitContribution(contributionData);
        return NextResponse.json(submissionResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('PERKESO API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
