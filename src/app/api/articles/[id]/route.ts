import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: { author: true },
      // The old Supabase query also selected `comments(*)`.
      // Prisma has no Comment model today (see seed.ts). If your
      // schema.prisma does add one, swap to:
      //   include: { author: true, comments: true },
    });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error: Error | unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
