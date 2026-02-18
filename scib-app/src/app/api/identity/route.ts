import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function cleanUsername(input: string) {
  const raw = (input || "").trim();
  // allow simple tester handles: letters/numbers/_/-
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
  return safe || "UNIDENTIFIED";
}

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = cleanUsername(String(body?.username || ""));
  const jar = await cookies();

  // Cookie used by the room API to attribute posts
  jar.set("scib_username", username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({ ok: true, username });
}
