import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { lhdnClient } from '@/lib/government-apis';

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
    const { action, taxNumber, taxData } = body;

    switch (action) {
      case 'validate':
        if (!taxNumber) {
          return NextResponse.json(
            { error: 'Tax number is required' },
            { status: 400 }
          );
        }

        const validationResult = await lhdnClient.validateTaxNumber(taxNumber);
        return NextResponse.json(validationResult);

      case 'submit':
        if (!taxData) {
          return NextResponse.json(
            { error: 'Tax data is required' },
            { status: 400 }
          );
        }

        const submissionResult = await lhdnClient.submitTaxReturn(taxData);
        return NextResponse.json(submissionResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('LHDN API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
