import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';
import { TAAgent } from '@/lib/ai-agents-ta';

const prisma = new PrismaClient();
const taAgent = new TAAgent();

// POST /api/ta-agent/match - Match candidates to jobs
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
    const { jobId, candidateIds } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
      include: {
        employer: true,
        company: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Get candidates
    const candidates = await prisma.employee.findMany({
      where: {
        id: { in: candidateIds?.map((id: string) => parseInt(id)) || [] },
        role: 'JOB_SEEKER',
      },
      include: {
        resumes: true,
      },
    });

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: 'No valid candidates found' },
        { status: 400 }
      );
    }

    // Use TA Agent for matching
    const matches = await Promise.all(candidates.map(async (candidate) => {
      const match = await taAgent.matchCandidateToJob(candidate, job);
      return {
        candidate: {
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          skills: candidate.skills,
        },
        score: match.score,
        reasons: match.reasons,
      };
    }));

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
        description: job.description,
        requirements: job.requirements,
      },
      matches,
    });
  } catch (error) {
    console.error('Error matching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to match candidates' },
      { status: 500 }
    );
  }
}
