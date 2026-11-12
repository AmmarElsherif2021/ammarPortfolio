import { NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        author_id: true,
        created_at: true,
        views: true,
      },
    });
    return NextResponse.json(articles, { status: 200 });
  } catch (error: Error | unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
