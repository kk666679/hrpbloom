import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/applications - List applications for the current user
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { applicantId: parseInt(user.id) };
    if (status) where.status = status as any;

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          include: {
            employer: {
              select: {
                firstName: true,
                lastName: true,
                employerCompanyName: true,
              },
            },
            company: true,
          },
        },
        resume: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/applications - Apply for a job
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
    const { jobId, resumeId, coverLetter } = body;

    if (!jobId || !resumeId) {
      return NextResponse.json(
        { error: 'Job ID and Resume ID are required' },
        { status: 400 }
      );
    }

    // Check if job exists and is open
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
      select: { status: true },
    });

    if (!job || job.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Job not found or not open for applications' },
        { status: 404 }
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: parseInt(jobId),
        applicantId: parseInt(user.id),
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 409 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: parseInt(jobId),
        applicantId: parseInt(user.id),
        resumeId: parseInt(resumeId),
        coverLetter,
      },
      include: {
        job: {
          include: {
            employer: {
              select: {
                firstName: true,
                lastName: true,
                employerCompanyName: true,
              },
            },
            company: true,
          },
        },
        resume: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
