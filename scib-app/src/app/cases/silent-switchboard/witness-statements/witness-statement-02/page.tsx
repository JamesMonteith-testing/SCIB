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

function QA({
  q,
  a,
  flag,
}: {
  q: string;
  a: React.ReactNode;
  flag?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="text-xs text-slate-400">Q</div>
        {flag ? (
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
            {flag}
          </span>
        ) : null}
      </div>
      <div className="text-slate-100 font-medium">{q}</div>
      <div className="text-xs text-slate-400 pt-2">A</div>
      <div className="text-slate-200 text-sm leading-relaxed">{a}</div>
    </div>
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
              <h1 className="text-xl font-semibold">Witness Statement 02</h1>
              <p className="text-sm text-slate-300">Interview Transcript • Night Security Patrol</p>
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
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">WITNESS</div>
                <div className="font-medium">Patel, Anil</div>
                <div className="text-sm text-slate-300">Night Security • Contracted</div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs text-slate-400">INTERVIEW</div>
                <div className="font-medium">03 May 1991 • 11:40</div>
                <div className="text-sm text-slate-300">On-site office</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag>SCIB-CC-1991-022</Tag>
              <Tag>Original file</Tag>
              <Tag>Patrol notes referenced</Tag>
            </div>

            <p className="text-sm text-slate-200">
              SCIB note: witness provides a physical detail about access control that conflicts with “locked from inside” narrative.
            </p>
          </div>

          <QA
            q="Describe your patrol route and timings."
            a={
              <>
                I do a loop every hour, roughly. Front door, side door, then down the service stairs to the maintenance alcove.
                I check the cabinet and sign the sheet. If anything is open, I note it.
              </>
            }
          />

          <QA
            q="Was anything unusual on the night of 03 May?"
            a={
              <>
                Side door chain was not on when I checked it. I put it on. I wrote it down. I remember because it annoyed me.
                The chain is always on at night.
              </>
            }
            flag="ACCESS DETAIL"
          />

          <QA
            q="When was that?"
            a={
              <>
                Just after two. I’m not exact. The clock in the corridor is slow. But it was after two.
              </>
            }
            flag="TIME ANCHOR"
          />

          <QA
            q="Did you see anyone else inside the building?"
            a={
              <>
                I saw a man in a hi-vis near the service stairs earlier in the week. Not that night. People come and go for upgrades.
                They have a pass. They show it if asked.
              </>
            }
          />

          <QA
            q="Do you remember the pass format?"
            a={
              <>
                It was a white card with black print. Name like <span className="font-mono">SURNAME-INITIAL</span>.
                That’s how the passes are. Short.
              </>
            }
            flag="FORMAT CLUE"
          />

          <QA
            q="Did you check the key cabinet?"
            a={
              <>
                Yes. Cabinet was shut. I did not open it. You only open if you have to. I sign the sheet.
                Later they said the sheet was missing. That is not normal.
              </>
            }
            flag="KEY CABINET"
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <h2 className="text-lg font-semibold">SCIB Analyst Margin Notes (added on reopen)</h2>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-2">
              <div className="text-xs text-slate-400">NOTE 01</div>
              <div>
                Side door chain “not on” after 02:00 undermines “locked-room” assumption. Someone may have exited/entered via side door.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-2">
              <div className="text-xs text-slate-400">NOTE 02 • RETRIEVAL HINT</div>
              <div>
                Witness confirms contractor pass format: <span className="font-mono">SURNAME-INITIAL</span>.
                Known example in file: <span className="font-mono">BAINES-J</span>.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-2">
              <div className="text-xs text-slate-400">NOTE 03 • RETRIEVAL HINT</div>
              <div>
                Witness references a signed sheet for the key cabinet. This is consistent with the missing inventory sheet (E-05).
                Likely appears later in recovered documents.
              </div>
            </div>
          </div>

          {/* Hints section */}
          <div id="hints" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Hints</h2>
                <p className="text-xs text-slate-500">Expand only if you’re stuck.</p>
              </div>
              <Link href="/cases/silent-switchboard" className="text-sm text-slate-300 hover:text-white">
                Back to Case
              </Link>
            </div>

            <HintBlock
              label="What’s the key contradiction?"
              hint1="The case leans on a locked-room narrative."
              hint2="Security reports a specific door control was not set."
              hint3="The side door chain was off after 02:00 — meaning entry/exit is plausible."
            />

            <HintBlock
              label="Contractor ID format"
              hint1="A specific formatting convention is stated explicitly."
              hint2="It matches a suspect profile detail."
              hint3="SURNAME-INITIAL matches BAINES-J (retrieval keyword for later contractor archive)."
            />

            <HintBlock
              label="Master key sheet importance"
              hint1="Security says there is normally a signed sheet."
              hint2="Evidence list says that sheet was missing then reappeared."
              hint3="That points to manipulation: who removed it, and who reintroduced it later?"
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

