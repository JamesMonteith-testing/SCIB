import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getPublicOrigin(req: Request) {
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (req.url.startsWith("https") ? "https" : "http");

  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host");

  if (proto && host) return `${proto}://${host}`;

  return new URL(req.url).origin;
}

export async function GET(req: Request) {
  const origin = getPublicOrigin(req);
  const jar = await cookies();

  const instanceId = crypto.randomUUID();

  jar.set("scib_case01_instance_v1", instanceId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(`${origin}/investigation-room`);
}
