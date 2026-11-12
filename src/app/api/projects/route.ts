import { NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { created_at: 'desc' },
      // Match the real Project model from schema.prisma:
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        tech_stack: true,
        featured: true,
        live_url: true,
        github_url: true,
        views: true,
        created_at: true,
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error: Error | unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
