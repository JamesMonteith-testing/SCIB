import { NextResponse } from "next/server";

function clearCookie(res: NextResponse, name: string) {
  // Clear robustly: explicit path=/, expired date, and maxAge=0.
  // IMPORTANT: We do NOT clear scib_case01_instance_v1 (instance persistence).
  res.cookies.set({
    name,
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function GET(request: Request) {
  const url = new URL("/login", request.url);
  const res = NextResponse.redirect(url);

  clearCookie(res, "scib_name_v1");
  clearCookie(res, "scib_badge_v1");
  clearCookie(res, "scib_provider_v1");

  return res;
}
