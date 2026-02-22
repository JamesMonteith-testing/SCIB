import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

type Provider = "linkedin" | "facebook" | "instagram";

function isProvider(v: string | undefined): v is Provider {
  return v === "linkedin" || v === "facebook" || v === "instagram";
}

function isNonEmpty(v: string | undefined) {
  return !!(v && v.trim().length > 0);
}

export default async function LoginPage() {
  const jar = await cookies();

  const provider = jar.get("scib_provider_v1")?.value;
  const name = jar.get("scib_name_v1")?.value;
  const badge = jar.get("scib_badge_v1")?.value;

  const hasActiveIdentity =
    isProvider(provider) && isNonEmpty(name) && isNonEmpty(badge);

  // A/C: registered + same provider + same device => immediate redirect
  if (hasActiveIdentity) {
    redirect("/welcome");
  }

  // Not recognized => show login UI
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/scib-badge.png"
              alt="SCIB Badge"
              width={56}
              height={56}
              priority
            />
            <div>
              <div className="text-sm text-slate-300">SCIB Secure Access</div>
              <h1 className="text-xl font-semibold">Detective Login</h1>
            </div>
          </div>

          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            Back
          </Link>
        </header>

        <LoginClient />

        <p className="text-xs text-slate-500 pt-4">
          Local emulation: identity is stored in cookies on this device only.
        </p>
      </div>
    </main>
  );
}
