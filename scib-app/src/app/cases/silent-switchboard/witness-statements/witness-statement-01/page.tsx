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
              <h1 className="text-xl font-semibold">Witness Statement 01</h1>
              <p className="text-sm text-slate-300">Interview Transcript • Gavin Roach</p>
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
                <div className="font-medium">Roach, Gavin</div>
                <div className="text-sm text-slate-300">Telecom Technician • Coworker</div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs text-slate-400">INTERVIEW</div>
                <div className="font-medium">03 May 1991 • 09:15</div>
                <div className="text-sm text-slate-300">Station CID</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag>SCIB-CC-1991-022</Tag>
              <Tag>Original file</Tag>
              <Tag>Transcript extract</Tag>
            </div>

            <p className="text-sm text-slate-200">
              SCIB note: witness provides several time estimates without clock confirmation. Compare against Timeline & Access Logs.
            </p>
          </div>

          <QA
            q="When did you last see Martin Kells?"
            a={
              <>
                I saw him just after one-thirty. Maybe quarter to two. He was in the break area.
                He had a coffee, looked normal. Tired, but normal.
              </>
            }
            flag="TIME VAGUE"
          />

          <QA
            q="Did anyone else have contact with him?"
            a={
              <>
                Not that I saw. Night shift’s quiet. If someone was in, you’d hear the doors. The place echoes.
              </>
            }
          />

          <QA
            q="Was the building secured?"
            a={
              <>
                Always. Once you’re in, you’re in. The doors latch behind you. We keep the side door on the chain.
                You don’t just wander in off the street.
              </>
            }
            flag="ASSUMPTION"
          />

          <QA
            q="Did you see anything unusual?"
            a={
              <>
                Not really. The only thing… he was going on about the lines. Said he thought someone was listening.
                Like the switchboard was… I don’t know… “wrong”.
              </>
            }
            flag="MATCHES NOTEBOOK"
          />

          <QA
            q="Do you know how maintenance mode was enabled?"
            a={
              <>
                No. That’s above me. Martin did those changes. Contractors sometimes.
                I never touch that. You have to sign in with the ops code anyway.
              </>
            }
            flag="OPS CODE MENTION"
          />

          <QA
            q="Were you in the break room at any point?"
            a={
              <>
                Yeah. In and out. Kettle, coffee, that sort of thing. I don’t remember times.
                It’s just… night shift.
              </>
            }
            flag="ALIBI WEAK"
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <h2 className="text-lg font-semibold">SCIB Analyst Margin Notes (added on reopen)</h2>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-2">
              <div className="text-xs text-slate-400">NOTE 01</div>
              <div>
                Witness independently repeats “switchboard was wrong” theme consistent with notebook phrase.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-2">
              <div className="text-xs text-slate-400">NOTE 02 • RETRIEVAL HINT</div>
              <div>
                Witness mentions “ops code”. Pair with access log stamp:
                <span className="font-mono"> WHX/OPS</span>.
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200 space-y-2">
              <div className="text-xs text-slate-400">NOTE 03 • RETRIEVAL HINT</div>
              <div>
                The phrase “listening” suggests communications evidence. If recovered archives exist, look for a format like:
                <span className="font-mono"> PAGER/</span> or <span className="font-mono">SMS/</span> indices.
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
              label="What’s the usable clue on this page?"
              hint1="Ignore the opinions. Focus on the things that look like system language."
              hint2="One phrase looks like a credential: 'ops code'."
              hint3="Treat 'ops code' as pointing you back to WHX/OPS and the access log record."
            />

            <HintBlock
              label="The 'listening' comment"
              hint1="It’s not just spooky flavour — it implies messages or surveillance."
              hint2="In this era, that could mean pager logs, internal memos, or call-routing notes."
              hint3="Future recovered archives should include an index (PAGER/SMS) that unlocks communications."
            />

            <HintBlock
              label="How does this help the dosing window?"
              hint1="Roach places Kells 'coffee' around ~01:30–02:00."
              hint2="Autopsy window is 02:30–03:00 for dosing."
              hint3="That means the 'coffee' sighting doesn’t clear Roach — it simply doesn’t cover the critical window."
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

