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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 space-y-2">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="text-sm text-slate-200 leading-relaxed">{children}</div>
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
              <h1 className="text-xl font-semibold">REC-03 • Contractor Records</h1>
              <p className="text-sm text-slate-300">Keyword: BAINES-J • Extract</p>
            </div>
          </div>

          <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/cases/silent-switchboard/recovered" contextLabel="Back to Recovery Terminal" />
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Tag>SCIB-CC-1991-022</Tag>
            <Tag>REC-03</Tag>
            <Tag>Format: SURNAME-INITIAL</Tag>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Contractor bundle reconstructed from invoice stubs and pass issue records.
            Prototype note: actual unlocking logic will be added later.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3">
          <Card title="Pass Issue Record (fragment)">
            Site Pass: <span className="font-mono">BAINES-J</span><br />
            Issued: 29 Apr 1991 • Expiry: 06 May 1991<br />
            Notes: “Temporary master override permitted during switching upgrades.”
          </Card>

          <Card title="Invoice Stub (partial)">
            Vendor: Baines Telecom Services<br />
            Ref: WHX-UPG-91<br />
            Line Item: “Night audit + switching verification”<br />
            Amount: (redacted / torn)
          </Card>

          <Card title="SCIB Analyst Note">
            Contractor access may have been used as a convenient explanation. The pass format and override permission
            could mask a privileged internal session (“someone wearing the contractor’s shadow”).
          </Card>
        </div>
      </div>
    </main>
  );
}

