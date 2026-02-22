import { NextResponse } from "next/server";

export function GET() {
  const res = NextResponse.redirect(new URL("/login", "http://scib.local"));

  // Clear cookies (match registration cookie names)
  res.cookies.set("scib_provider_v1", "", { path: "/", expires: new Date(0) });
  res.cookies.set("scib_name_v1", "", { path: "/", expires: new Date(0) });
  res.cookies.set("scib_badge_v1", "", { path: "/", expires: new Date(0) });

  return res;
}
