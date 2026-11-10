import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ← await the Promise
    const { data: article, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        comments(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(article, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
