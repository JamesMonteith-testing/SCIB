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

function HintBlock({
  label,
  hint1,
  hint2,
  hint3,
}: {
  label: string;
  hint1: string;
  hint2: string;
  hint3: string;
}) {
  return (
    <details className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
      <summary className="cursor-pointer select-none flex items-center justify-between gap-3">
        <span className="font-medium">Hints: {label}</span>
        <span className="text-xs text-slate-500">Click to reveal</span>
      </summary>

      <div className="mt-4 space-y-3 text-sm text-slate-200">
        <details className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <summary className="cursor-pointer select-none font-medium">Hint 1 (nudge)</summary>
          <div className="mt-2 text-slate-200">{hint1}</div>
        </details>

        <details className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <summary className="cursor-pointer select-none font-medium">Hint 2 (direction)</summary>
          <div className="mt-2 text-slate-200">{hint2}</div>
        </details>

        <details className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <summary className="cursor-pointer select-none font-medium">Hint 3 (near-solve)</summary>
          <div className="mt-2 text-slate-200">{hint3}</div>
        </details>
      </div>
    </details>
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
              <h1 className="text-xl font-semibold">Crime Scene Summary</h1>
              <p className="text-sm text-slate-300">West Harrow Exchange • Scene Log Extract</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#hints"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-sm font-medium"
            >
              Hints
            </a>
            <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/cases/silent-switchboard" contextLabel="Back to Case" />
          </div>
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs text-slate-400">LOCATION</div>
                <div className="font-medium">West Harrow Telephone Exchange — Switching Floor (Level B)</div>
              </div>
              <div className="space-y-1 sm:text-right">
                <div className="text-xs text-slate-400">DISCOVERED</div>
                <div className="font-medium">03 May 1991 • 03:42</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">RESPONDING UNIT</div>
                <div className="font-medium">Local CID • Later SCIB</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">SCENE STATUS</div>
                <div className="font-medium">Secured 04:11</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">PRIMARY ANOMALY</div>
                <div className="font-medium">“Locked-room” claim</div>
              </div>
            </div>
          </div>

          <Panel title="Narrative Summary">
            <p>
              Victim located supine between Switching Racks B-12 and B-13. No visible signs of forced entry at primary access points
              (Front Door A / Side Door C) at time of first response. On-site staff reported building “secured from inside” following
              last routine patrol.
            </p>
            <p className="mt-3">
              Scene presented as possible workplace accident; however, subsequent review flagged sedation indicators (see Autopsy Summary).
              Notable: coffee cup present at workstation with cosmetic transfer on rim. No immediate explanation recorded by attending officer.
            </p>
          </Panel>

          <Panel title="Scene Observations">
            <ul className="list-disc pl-6 space-y-2">
              <li>Victim’s access lanyard found on floor adjacent to Rack B-12. Lanyard clip fractured (fresh break).</li>
              <li>Master key cabinet in maintenance alcove found closed; inventory not performed until later shift.</li>
              <li>
                Switching console shows routine maintenance mode enabled. Engineer’s notebook open at a page containing:
                <span className="font-mono"> “DON’T TRUST THE SWITCHBOARD”</span>.
              </li>
              <li>No signs of struggle in immediate area. No defensive damage to hands recorded in initial notes.</li>
            </ul>
          </Panel>

          <Panel title="Items Logged at Scene (extract)">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 font-mono text-xs leading-relaxed">
              <div>E-01  Lanyard + access card (MKELLS)</div>
              <div>E-02  Coffee cup (lipstick transfer) — break room style</div>
              <div>E-03  Dot-matrix printout: Access Log (partial) — stamped: WHX/OPS</div>
              <div>E-04  Engineer notebook page — handwritten warning</div>
              <div>E-05  Missing: Master key inventory sheet (not located during first sweep)</div>
            </div>
          </Panel>

          <Panel title="SCIB Analyst Notes (added on reopen)">
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 01</div>
                <div className="mt-1">
                  “Locked-room” depends entirely on accuracy of access logs. The only hard record noted at scene is the
                  <span className="font-mono"> dot-matrix access log printout</span>.
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 02 • RETRIEVAL HINT</div>
                <div className="mt-1">
                  Notebook warning uses a single phrase. Treat as a likely <span className="font-medium">retrieval keyword</span>.
                  (Recovery Terminal: exact match usually required.)
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 03 • RETRIEVAL HINT</div>
                <div className="mt-1">
                  Access card label includes the operator ID used on internal systems. Initials appear as:
                  <span className="font-mono"> MKELLS</span>.
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 04 • RETRIEVAL HINT</div>
                <div className="mt-1">
                  The access log printout header stamp reads <span className="font-mono">WHX/OPS</span>.
                  Cross-reference the Evidence List for any appended reference digits.
                </div>
              </div>
            </div>
          </Panel>

          {/* Hints section (hidden unless expanded) */}
          <div id="hints" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Hints</h2>
                <p className="text-xs text-slate-500">
                  Hints are hidden by default. Expand only if you’re stuck.
                </p>
              </div>
              <Link href="/cases/silent-switchboard" className="text-sm text-slate-300 hover:text-white">
                Back to Case
              </Link>
            </div>

            <HintBlock
              label="Recovery Terminal — First retrieval keyword"
              hint1="There is a single phrase written in the engineer’s notebook that feels like a warning."
              hint2="Treat the phrase as a literal keyword, not a clue to something else."
              hint3="Try entering: DON’T TRUST THE SWITCHBOARD"
            />

            <HintBlock
              label="Recovery Terminal — User / Operator ID"
              hint1="One logged item includes a short all-caps identifier in parentheses."
              hint2="That identifier is the victim’s internal operator ID used on systems."
              hint3="Try entering: MKELLS"
            />

            <HintBlock
              label="Access log reference (you’ll need digits from another file)"
              hint1="The dot-matrix access log has a short stamp in its header."
              hint2="The stamp alone may not be enough — you’re told to cross-reference another document."
              hint3="Use WHX/OPS, then open Evidence List to look for appended numbers tied to the access log printout."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/cases/silent-switchboard"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back to Case
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

