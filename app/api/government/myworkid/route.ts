import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { myWorkIDClient } from '@/lib/government-apis';

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
    const { action, icNumber } = body;

    switch (action) {
      case 'verify':
        if (!icNumber) {
          return NextResponse.json(
            { error: 'IC number is required' },
            { status: 400 }
          );
        }

        const verificationResult = await myWorkIDClient.verifyIdentity(icNumber);
        return NextResponse.json(verificationResult);

      case 'employmentHistory':
        if (!icNumber) {
          return NextResponse.json(
            { error: 'IC number is required' },
            { status: 400 }
          );
        }

        const history = await myWorkIDClient.getEmploymentHistory(icNumber);
        return NextResponse.json(history);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('MyWorkID API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
