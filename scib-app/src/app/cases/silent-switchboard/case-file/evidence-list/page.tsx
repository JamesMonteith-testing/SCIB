﻿import Image from "next/image";
import Link from "next/link";
import CaseNavLinks from "@/components/CaseNavLinks";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <Tag>SCIB-CC-1991-022</Tag>
      </div>
      <div className="text-slate-200 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function EvidenceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300 hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Case Database</div>
              <h1 className="text-xl font-semibold">Evidence List</h1>
              <p className="text-sm text-slate-300">Property & Intake Register • Extract</p>
            </div>
          </div>

          <CaseNavLinks caseHref="/cases/silent-switchboard" />
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">CASE</div>
                <div className="font-medium">SCIB-CC-1991-022 • The Silent Switchboard</div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs text-slate-400">REGISTER STATUS</div>
                <div className="font-medium">Incomplete chain-of-custody noted</div>
              </div>
            </div>

            <p className="text-slate-200 text-sm">
              Items below are taken from the original intake log with SCIB annotations added on reopen. Several entries
              contain system stamps and reference numbers.
            </p>
          </div>

          <Panel title="Evidence Register (extract)">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50">
                <div className="text-xs text-slate-400">EVIDENCE REGISTER</div>
                <div className="font-mono text-sm">West Harrow Exchange • Intake Log</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 bg-slate-950/40">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium">Ref</th>
                      <th className="text-left px-5 py-3 font-medium">Item</th>
                      <th className="text-left px-5 py-3 font-medium">Collected</th>
                      <th className="text-left px-5 py-3 font-medium">Notes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    <tr className="align-top">
                      <td className="px-5 py-4 font-mono">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-01">E-01</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-01">
                          Lanyard + Access Card
                        </EvidenceLink>
                      </td>
                      <td className="px-5 py-4">03/05/91 04:22</td>
                      <td className="px-5 py-4 text-slate-200">
                        Card label: <span className="font-mono">MKELLS</span>. Lanyard clip fractured (fresh).
                      </td>
                    </tr>

                    <tr className="align-top">
                      <td className="px-5 py-4 font-mono">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-02">E-02</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-02">Coffee Cup</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">03/05/91 04:28</td>
                      <td className="px-5 py-4 text-slate-200">
                        Cosmetic transfer on rim (lipstick). No matching statement in initial interviews.
                      </td>
                    </tr>

                    <tr className="align-top">
                      <td className="px-5 py-4 font-mono">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-03">E-03</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-03">
                          Dot-matrix Access Log (partial)
                        </EvidenceLink>
                      </td>
                      <td className="px-5 py-4">03/05/91 04:35</td>
                      <td className="px-5 py-4 text-slate-200">
                        Header stamp: <span className="font-mono">WHX/OPS</span>. Internal reference printed faintly at footer:{" "}
                        <span className="font-mono">1991-022-03</span>.
                      </td>
                    </tr>

                    <tr className="align-top">
                      <td className="px-5 py-4 font-mono">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-04">E-04</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-04">
                          Engineer Notebook Page
                        </EvidenceLink>
                      </td>
                      <td className="px-5 py-4">03/05/91 04:41</td>
                      <td className="px-5 py-4 text-slate-200">
                        Handwritten line: <span className="font-mono">DON’T TRUST THE SWITCHBOARD</span>.
                      </td>
                    </tr>

                    <tr className="align-top">
                      <td className="px-5 py-4 font-mono">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-05">E-05</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-05">
                          Master Key Inventory Sheet
                        </EvidenceLink>
                      </td>
                      <td className="px-5 py-4">—</td>
                      <td className="px-5 py-4 text-slate-200">Flagged in register. Chain-of-custody incomplete.</td>
                    </tr>

                    <tr className="align-top">
                      <td className="px-5 py-4 font-mono">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-06">E-06</EvidenceLink>
                      </td>
                      <td className="px-5 py-4">
                        <EvidenceLink href="/cases/silent-switchboard/case-file/evidence/e-06">
                          Maintenance Console Printout
                        </EvidenceLink>
                      </td>
                      <td className="px-5 py-4">—</td>
                      <td className="px-5 py-4 text-slate-200">Listed in intake log. Printed output retained as recovered.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/cases/silent-switchboard"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back to Case
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
