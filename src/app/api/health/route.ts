// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .limit(1);

  if (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: 'healthy',
    db: 'connected',
    sample_row_fetched: data,
    timestamp: new Date().toISOString(),
  });
}