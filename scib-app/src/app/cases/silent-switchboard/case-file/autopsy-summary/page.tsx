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
              <h1 className="text-xl font-semibold">Autopsy Summary</h1>
              <p className="text-sm text-slate-300">Medical Examiner Extract • West Harrow</p>
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
                <div className="text-xs text-slate-400">DECEDENT</div>
                <div className="font-medium">KELLS, Martin (M/38)</div>
              </div>
              <div className="space-y-1 sm:text-right">
                <div className="text-xs text-slate-400">POST-MORTEM</div>
                <div className="font-medium">04 May 1991 • 10:20</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">CASE</div>
                <div className="font-medium">SCIB-CC-1991-022</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">FINDING</div>
                <div className="font-medium">Sedation present</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">CLASSIFICATION</div>
                <div className="font-medium">Homicide</div>
              </div>
            </div>
          </div>

          <Panel title="Cause & Manner of Death (extract)">
            <p>
              <span className="font-medium">Cause of death:</span> Asphyxia due to airway obstruction.
              <br />
              <span className="font-medium">Manner of death:</span> Homicide.
            </p>
            <p className="mt-3">
              No significant external trauma consistent with an industrial accident. No electrocution burns observed. Minor bruising
              to the inner forearm consistent with restraint or assisted handling while impaired.
            </p>
          </Panel>

          <Panel title="Toxicology (reopened review)">
            <p>
              Trace sedative detected in blood consistent with <span className="font-medium">benzodiazepine-class</span> compound.
              Concentration suggests administration within 60–90 minutes prior to death.
            </p>
            <p className="mt-3">
              The compound is recorded in the lab summary as:
              <span className="font-mono"> “DIAZEPAM”</span>.
            </p>
            <p className="mt-3 text-slate-300">
              Note: Original 1991 file treated this as “possible contamination” due to workplace context. SCIB review rejects that assessment.
            </p>
          </Panel>

          <Panel title="Additional Notes">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Stomach contents: coffee consumed within estimated 30–45 minutes of death.
              </li>
              <li>
                No alcohol detected.
              </li>
              <li>
                Fingernails: no foreign skin recovered.
              </li>
              <li>
                Clothing: clean; no fibre transfer recorded at time of first report.
              </li>
            </ul>
          </Panel>

          <Panel title="SCIB Analyst Notes (added on reopen)">
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 01</div>
                <div className="mt-1">
                  Sedation makes the “no struggle” scene consistent with an assisted, controlled event.
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 02 • RETRIEVAL HINT</div>
                <div className="mt-1">
                  The toxicology summary includes a single drug name in all caps. Treat as a likely retrieval keyword.
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 03 • RETRIEVAL HINT</div>
                <div className="mt-1">
                  The time window (60–90 minutes) should be compared against the official timeline. It may identify the only plausible
                  moment the victim could have been dosed.
                </div>
              </div>
            </div>
          </Panel>

          {/* Hints section */}
          <div id="hints" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Hints</h2>
                <p className="text-xs text-slate-500">
                  Expand only if you’re stuck. These are retrieval nudges, not full solutions.
                </p>
              </div>
              <Link href="/cases/silent-switchboard" className="text-sm text-slate-300 hover:text-white">
                Back to Case
              </Link>
            </div>

            <HintBlock
              label="Recovery Terminal — Sedative keyword"
              hint1="There is a single word in the toxicology section written in all caps."
              hint2="The system expects exact keywords, not paraphrases."
              hint3="Try entering: DIAZEPAM"
            />

            <HintBlock
              label="What the coffee detail implies"
              hint1="Coffee is mentioned for a reason — not just flavour."
              hint2="The victim drank coffee shortly before death, and sedation was administered before death."
              hint3="The coffee may have been used as the delivery method for the sedative."
            />

            <HintBlock
              label="How to use the time window"
              hint1="The report gives a dosing window: 60–90 minutes before death."
              hint2="Compare that against the timeline and witness statements."
              hint3="It narrows the suspect opportunity window to a small time range."
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

