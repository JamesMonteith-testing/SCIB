import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ContinueClient from "./ContinueClient";

type Provider = "linkedin" | "facebook" | "instagram";

function isProvider(v: string | undefined): v is Provider {
  return v === "linkedin" || v === "facebook" || v === "instagram";
}

function isNonEmpty(v: string | undefined) {
  return !!(v && v.trim().length > 0);
}

export default async function CaseBriefingPage() {
  const jar = await cookies();

  const provider = jar.get("scib_provider_v1")?.value;
  const name = jar.get("scib_name_v1")?.value;
  const badge = jar.get("scib_badge_v1")?.value;

  const hasActiveIdentity =
    isProvider(provider) && isNonEmpty(name) && isNonEmpty(badge);

  if (!hasActiveIdentity) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/scib-badge.png"
              alt="SCIB Badge"
              width={48}
              height={48}
              priority
            />
            <div>
              <div className="text-xs text-slate-400">SCIB Secure Access</div>
              <h1 className="text-xl font-semibold">Case Briefing</h1>
            </div>
          </div>

          <Link href="/logout" className="text-sm text-slate-300 hover:text-white">
            Exit
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-5">
          <div className="space-y-1">
            <div className="text-xs text-slate-400">CASE 01</div>
            <div className="text-2xl font-semibold text-emerald-200">
              The Silent Switchboard
            </div>
            <div className="text-sm text-slate-300">
              SCIB-CC-1991-022 • West Harrow Exchange • 03 May 1991
            </div>
          </div>

          <div className="space-y-3 text-slate-200 leading-relaxed">
            <p>
              On 03 May 1991, technician Martin Kells was found deceased inside the West Harrow telephone exchange.
              The original report concluded accidental asphyxia.
            </p>
            <p>
              A cold case review flagged inconsistencies in operational logs and switchboard activity during the hour
              preceding death. The official narrative does not fully account for the anomalies recorded on site.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold">Key points</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-300 list-disc pl-5">
              <li>Switching console entered maintenance mode under unclear authorization.</li>
              <li>A silence window was recorded during the critical timeframe.</li>
              <li>Toxicology indicates sedative administration 60–90 minutes prior to death.</li>
              <li>An access log reference appears in documentation: WHX/OPS.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Objective</div>
            <p className="text-sm text-slate-300">
              Review the available evidence and determine whether the official findings remain valid.
            </p>
          </div>

          <div className="pt-2">
            <ContinueClient />
            <p className="text-xs text-slate-500 pt-3">
              Signed in as <span className="text-slate-300">{name}</span> • Badge{" "}
              <span className="text-slate-300">{badge}</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
