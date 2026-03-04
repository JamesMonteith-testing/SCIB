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

// Accept only UUID-looking room codes. Anything else is treated as legacy/human and we mint a real id.
function isUuidLike(v: string) {
  const s = (v || "").trim().toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(s);
}

function mintInstanceId() {
  return crypto.randomUUID();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawCode = (url.searchParams.get("code") || "").trim();

  const origin = getPublicOrigin(req);
  const jar = await cookies();

  const instanceId = isUuidLike(rawCode) ? rawCode : mintInstanceId();

  jar.set("scib_case01_instance_v1", instanceId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Normalize legacy/human codes and missing codes into a canonical, shareable UUID join URL.
  if (!rawCode || !isUuidLike(rawCode)) {
    return NextResponse.redirect(
      `${origin}/cases/silent-switchboard/join?code=${encodeURIComponent(instanceId)}`
    );
  }

  return NextResponse.redirect(`${origin}/investigation-room`);
}
