import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function cleanInstanceId(input: string) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe || "";
}

function getPublicOrigin(req: Request) {
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (req.url.startsWith("https") ? "https" : "http");

  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host");

  if (proto && host) {
    return `${proto}://${host}`;
  }

  // Fallback (should not normally hit)
  const url = new URL(req.url);
  return url.origin;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = cleanInstanceId(url.searchParams.get("code") || "");

  const origin = getPublicOrigin(req);

  if (!code) {
    return NextResponse.redirect(`${origin}/investigation-room`);
  }

  const jar = await cookies();

  jar.set("scib_case01_instance_v1", code, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.redirect(`${origin}/investigation-room`);
}
