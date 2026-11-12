import { NextResponse } from 'next/server';
import { prisma } from '@/../prisma/client';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'healthy',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error: Error | unknown) {
    return NextResponse.json(
      { status: 'unhealthy', error: (error as Error).message },
      { status: 500 }
    );
  }
}
