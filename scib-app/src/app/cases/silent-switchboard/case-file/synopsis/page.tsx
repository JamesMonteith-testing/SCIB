import Image from "next/image";
import Link from "next/link";
import CaseNavLinks from "@/components/CaseNavLinks";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Case Database</div>
              <h1 className="text-xl font-semibold">Synopsis</h1>
              <p className="text-sm text-slate-300">SCIB-CC-1991-022 • The Silent Switchboard</p>
            </div>
          </div>

          <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/cases/silent-switchboard" contextLabel="Back to Case" />
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs text-slate-400 pb-1">FILE</div>
            <div className="font-mono text-sm">/case_file/synopsis.txt</div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Case Summary</h2>
            <p className="text-slate-200 leading-relaxed">
              Martin Kells (38), a night telecom engineer, was found dead inside a locked telephone exchange building during his shift.
              The scene was initially treated as an accident, but later review indicates sedation prior to death. Entry points appeared
              secured and the building was reported locked from the inside. No clear intruder was identified. The case went cold amid
              limited leads and a narrow investigative focus.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
            <div className="text-xs text-slate-400 pb-1">SCIB NOTE</div>
            This file is available immediately. Hidden/secondary materials are accessed via retrieval keys in the Recovery Terminal.
          </div>

          <div className="pt-2">
            <Link
              href="/cases/silent-switchboard"
              className="inline-block rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium"
            >
              Back to Case
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

