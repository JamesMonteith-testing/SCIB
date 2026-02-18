import Image from "next/image";
import Link from "next/link";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

export default function Profile() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">WELCOME BACK</div>
              <h1 className="text-xl font-semibold">Detective Monteith</h1>
              <p className="text-sm text-slate-300">Badge #1234 • SCIB</p>
            </div>
          </div>

          <Link href="/cases" className="text-sm text-slate-300 hover:text-white">
            Go to Cases
          </Link>
        </header>

        {/* Officer badge card image you added (rename-friendly) */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Tag>Officer Profile</Tag>
            <Tag>Credentials: Verified (stub)</Tag>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs text-slate-400 pb-3">OFFICIAL BADGE CARD</div>
            <Image
              src="/brand/ChatGPT Image Feb 7, 2026, 09_34_01 PM.png"
              alt="Detective Badge Card"
              width={1200}
              height={750}
              className="w-full h-auto rounded-xl"
              priority
            />
            <div className="text-xs text-slate-500 pt-3">
              If this image path changes, we’ll swap it later to a stable filename.
            </div>
          </div>
        </section>

        {/* Active case synopsis preview */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6 space-y-3">
          <div className="text-xs text-slate-400">ACTIVE CASE</div>
          <div className="text-lg font-semibold">Case 01 — The Silent Switchboard</div>
          <div className="text-sm text-slate-200 leading-relaxed">
            Martin Kells (38), a night telecom engineer, was found dead inside a locked telephone exchange building during his shift.
            The scene was initially treated as an accident, but later review indicates sedation prior to death.
            Entry points appeared secured and the building was reported locked from the inside.
            No clear intruder was identified.
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Link
              href="/cases"
              className="flex-1 rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Open Case List
            </Link>

            <Link
              href="/investigation-room"
              className="flex-1 rounded-xl border border-emerald-700/60 bg-emerald-950/20 hover:bg-emerald-950/35 transition px-4 py-3 font-semibold text-center"
            >
              Enter Investigation Room
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
