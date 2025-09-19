
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/jobs - List all jobs with optional filters
export async function GET(request: NextRequest) {
  console.log('GET /api/jobs called');
  try {
    console.log('Initializing Prisma client...');
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'OPEN';

    console.log('Search params:', { department, location, type, status });

    const where: any = { status: status as any };

    if (department) where.department = department;
    if (location) where.location = location;
    if (type) where.type = type as any;

    console.log('Where clause:', where);

    console.log('Executing Prisma query...');
    const jobs = await prisma.job.findMany({
      where,
      include: {
        Employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            employerCompanyName: true,
          },
        },
        Company: true,
        JobApplication: {
          select: {
            id: true,
            status: true,
            appliedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Query completed, found', jobs.length, 'jobs');
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job posting
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
    const {
      title,
      description,
      requirements,
      location,
      salaryMin,
      salaryMax,
      type,
      department,
      companyId,
    } = body;

    // Verify user is an employer
    const dbUser = await prisma.employee.findUnique({
      where: { id: parseInt(user.id) },
      select: { role: true, companyId: true },
    });

    if (dbUser?.role !== 'EMPLOYER') {
      return NextResponse.json(
        { error: 'Only employers can post jobs' },
        { status: 403 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        location,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        type: type as any,
        department,
        employerId: parseInt(user.id),
        companyId: companyId ? parseInt(companyId) : dbUser.companyId,
      },
      include: {
        Employee: {
          select: {
            firstName: true,
            lastName: true,
            employerCompanyName: true,
          },
        },
        Company: true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
