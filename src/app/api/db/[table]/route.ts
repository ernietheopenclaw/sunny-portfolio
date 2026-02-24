import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServiceClient } from "@/lib/supabase";

const ALLOWED_TABLES = ["concepts", "projects", "publications", "posts", "skills", "about", "settings"];
const ALLOWED_EMAIL = "sunnys2327@gmail.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email || session.user.email !== ALLOWED_EMAIL) {
    return NextResponse.json({ error: "Unauthorized", debug: { hasSession: !!session, email: session?.user?.email || null } }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from(table)
    .upsert(body, { onConflict: "id" })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.email || session.user.email !== ALLOWED_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
