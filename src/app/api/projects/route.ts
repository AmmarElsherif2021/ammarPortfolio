import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, title, slug, excerpt, author_id, created_at, views")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
