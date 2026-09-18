import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// POST /api/auth/session — store token + role in an encrypted cookie
export async function POST(req: NextRequest) {
  const { token, role, uid } = await req.json();

  if (!token || !role || !uid) {
    return NextResponse.json({ error: "Missing token, role, or uid" }, { status: 400 });
  }

  const session = await getSession();
  session.uid = uid;
  session.role = role;
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true });
}

// DELETE /api/auth/session — clear cookies on sign out
export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
