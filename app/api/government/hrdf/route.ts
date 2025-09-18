import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { hrdfClient } from '@/lib/government-apis';

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
    const { action, claimData } = body;

    switch (action) {
      case 'validate':
        if (!claimData) {
          return NextResponse.json(
            { error: 'Claim data is required' },
            { status: 400 }
          );
        }

        const validationResult = await hrdfClient.validateClaim(claimData);
        return NextResponse.json(validationResult);

      case 'submit':
        if (!claimData) {
          return NextResponse.json(
            { error: 'Claim data is required' },
            { status: 400 }
          );
        }

        const submissionResult = await hrdfClient.submitClaim(claimData);
        return NextResponse.json(submissionResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('HRDF API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
