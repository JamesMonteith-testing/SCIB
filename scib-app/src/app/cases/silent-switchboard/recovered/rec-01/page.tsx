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

function Row({ t, e, f }: { t: string; e: string; f?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-sm text-slate-300">{t}</div>
        {f ? <span className="text-xs text-slate-500">{f}</span> : null}
      </div>
      <div className="mt-2 text-sm text-slate-200">{e}</div>
    </div>
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
              <h1 className="text-xl font-semibold">REC-01 • Access Logs (Extended)</h1>
              <p className="text-sm text-slate-300">West Harrow Exchange • WHX/OPS</p>
            </div>
          </div>

          <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/cases/silent-switchboard/recovered" contextLabel="Back to Recovery Terminal" />
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Tag>SCIB-CC-1991-022</Tag>
            <Tag>REC-01</Tag>
            <Tag>Integrity: OK</Tag>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            This is a reconstructed extract from system spool. It may differ from the original dot-matrix partial log (E-03).
            Prototype note: unlocking logic will be added later.
          </p>
        </section>

        <section className="space-y-3">
          <Row t="01:12" e="MAINT MODE ENABLED — Operator: WHX/OPS — Terminal: OPS-2" f="ANOMALY: operator not named in original print" />
          <Row t="01:18" e="DOOR EVENT — Side Door — OPEN/CLOSE cycle recorded" f="CONTRADICTS 'secured' assumption" />
          <Row t="02:05" e="PRINT SPOOL — Access extract generated — Ref: 1991-022-03" f="MATCHES E-03 footer" />
          <Row t="02:14" e="OVERRIDE TOKEN ISSUED — Temporary Master Override — Session: TEMP-OVR" f="HIGH PRIVILEGE" />
          <Row t="02:27" e="MAINT MODE STATUS CHECK — Operator: WHX/OPS — Terminal: OPS-2" f="WITHIN ACTIVE WINDOW" />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-2">
          <div className="text-xs text-slate-400">SCIB ANALYST NOTE</div>
          <div className="text-sm text-slate-200 leading-relaxed">
            The presence of a temporary override token suggests a privileged session existed beyond routine technician access.
            This will later tie into contractor permissions and key cabinet irregularities.
          </div>
        </section>
      </div>
    </main>
  );
}

