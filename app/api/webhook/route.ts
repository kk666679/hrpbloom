import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Webhook received data:', data);

    // Since n8n is not set up, we skip forwarding
    // If you set up n8n later, you can add the forwarding code here

    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint' }, { status: 200 });
}
