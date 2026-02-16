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

function TimelineRow({
  time,
  title,
  source,
  note,
  flag,
}: {
  time: string;
  title: string;
  source: string;
  note: string;
  flag?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">TIME</div>
          <div className="font-mono text-base">{time}</div>
        </div>
        {flag ? (
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
            {flag}
          </span>
        ) : null}
      </div>

      <div className="text-lg font-semibold">{title}</div>

      <div className="text-xs text-slate-400">
        SOURCE: <span className="text-slate-300">{source}</span>
      </div>

      <div className="text-sm text-slate-200 leading-relaxed">{note}</div>
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
              <h1 className="text-xl font-semibold">Timeline</h1>
              <p className="text-sm text-slate-300">Official Reconstruction • 03 May 1991</p>
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">CASE</div>
                <div className="font-medium">SCIB-CC-1991-022 • The Silent Switchboard</div>
              </div>
              <Tag>OFFICIAL</Tag>
            </div>
            <p className="text-sm text-slate-200">
              Timeline assembled from original logs and statements, with SCIB annotations. Times are approximate where noted.
              Use this to test suspect opportunity windows (see Autopsy Summary: 60–90 minutes pre-death).
            </p>
          </div>

          <TimelineRow
            time="00:55"
            title="Martin Kells arrives on-site"
            source="Exchange sign-in book (photocopy), original file"
            note="No anomalies recorded. Weather clear. Routine night maintenance scheduled."
          />

          <TimelineRow
            time="01:12"
            title="Switching console enters routine maintenance mode"
            source="Maintenance console printout (E-06), original file"
            note="Technician name not recorded on the first print. SCIB note: mode change should require an authenticated operator."
            flag="ANOMALY"
          />

          <TimelineRow
            time="01:35"
            title="Coworker last confirmed sighting (Gavin Roach claim)"
            source="Witness Statement 01 (original) • self-reported"
            note="Roach claims he saw Kells “fine, having a coffee” in the break area. No independent confirmation."
            flag="UNVERIFIED"
          />

          <TimelineRow
            time="02:05"
            title="Access log printout reference appears (WHX/OPS)"
            source="Dot-matrix access log (E-03) • header stamp + footer ref 1991-022-03"
            note="SCIB note: the access log extract was printed during the active window of the incident. Treat as a key record, but verify authenticity."
            flag="KEY RECORD"
          />

          <TimelineRow
            time="02:30"
            title="Estimated time of dosing window begins (90 minutes pre-death)"
            source="Autopsy Summary (toxicology timing)"
            note="If sedation was administered 60–90 minutes before death, the earliest plausible dosing time begins here."
            flag="WINDOW START"
          />

          <TimelineRow
            time="03:00"
            title="Estimated time of dosing window tightens (60 minutes pre-death)"
            source="Autopsy Summary (toxicology timing)"
            note="Latest plausible dosing time. Anyone not near the victim between 02:30–03:00 is less likely to have administered the sedative."
            flag="WINDOW END"
          />

          <TimelineRow
            time="~03:20"
            title="Estimated time of death"
            source="Autopsy Summary (approximate)"
            note="Time of death estimated. Scene discovered later. Original file treated death as accidental; SCIB reclassifies as homicide."
          />

          <TimelineRow
            time="03:42"
            title="Body discovered on Switching Floor (Level B)"
            source="First responder notes, original file"
            note="Victim found between racks B-12 and B-13. No forced entry noted at primary access points."
          />

          <TimelineRow
            time="04:11"
            title="Scene secured"
            source="First responder notes, original file"
            note="Area taped off. Inventory of key cabinet was not performed until later shift."
            flag="PROCEDURAL GAP"
          />

          <TimelineRow
            time="04:35"
            title="Dot-matrix access log (partial) logged as evidence"
            source="Evidence List (E-03)"
            note="Header stamp WHX/OPS. Footer reference 1991-022-03 noted faintly."
          />

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
              label="How to use the dosing window"
              hint1="The autopsy gives a 60–90 minute pre-death window."
              hint2="Place that window onto the timeline and ask: who could be near the victim then?"
              hint3="Focus on 02:30–03:00. If a suspect can’t plausibly be present, deprioritize them."
            />

            <HintBlock
              label="Why the access log timestamp matters"
              hint1="The access log isn’t just evidence — it’s a timing anchor."
              hint2="It appears during the active part of the night and may be used to prove presence or absence."
              hint3="Treat WHX/OPS + 1991-022-03 as the ‘key record’ chain; it likely unlocks recovered logs later."
            />

            <HintBlock
              label="The procedural gap"
              hint1="Something wasn’t done at 04:11 that should have been."
              hint2="It relates to keys and who could enter/leave."
              hint3="The key cabinet wasn’t inventoried immediately — that creates room for later manipulation."
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

