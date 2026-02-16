import Image from "next/image";
import Link from "next/link";
import CaseNavLinks from "@/components/CaseNavLinks";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">RECOVERED ARCHIVE</div>
              <h1 className="text-xl font-semibold">REC-04 • SCIB Internal Memo</h1>
              <p className="text-sm text-slate-300">Phrase Key: DON’T TRUST THE SWITCHBOARD</p>
            </div>
          </div>

          <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/cases/silent-switchboard/recovered" contextLabel="Back to Recovery Terminal" />
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Tag>SCIB-CC-1991-022</Tag>
            <Tag>REC-04</Tag>
            <Tag>Internal</Tag>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Internal memo logged during reopen review. Author redacted in prototype.
            Prototype note: actual unlocking logic will be added later.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-3">
          <div className="text-xs text-slate-400">MEMO (EXTRACT)</div>
          <div className="font-mono text-sm text-slate-300">RE: SCIB-CC-1991-022 • West Harrow Exchange</div>

          <div className="text-sm text-slate-200 leading-relaxed space-y-3">
            <p>
              The official file reads like a conclusion that arrived early. The “locked room” narrative is repeated as if it were an
              instruction, not an observation.
            </p>
            <p>
              Evidence handling around the key inventory and access extracts suggests more than incompetence. It suggests
              control — of paper, of timing, of what becomes “truth”.
            </p>
            <p>
              If you are reading this, you already know what we learned too late:
              <span className="font-semibold"> the switchboard is not neutral.</span>
            </p>
            <p className="text-slate-300">
              Continue via REC-01 and REC-02. Follow the stamps. Follow the formats. Trust procedure, not narrative.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="text-xs text-slate-400">SCIB NOTE</div>
          <div className="text-sm text-slate-200 leading-relaxed mt-2">
            This memo is designed to reframe the case from “who did it” to “who controlled the investigation.”
          </div>
        </section>
      </div>
    </main>
  );
}

