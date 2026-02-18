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

function SuspectCard({
  name,
  role,
  status,
  details,
  flags,
  note,
}: {
  name: string;
  role: string;
  status: string;
  details: { label: string; value: string }[];
  flags: string[];
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">NAME</div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm text-slate-300">{role}</div>
        </div>
        <div className="sm:text-right">
          <div className="text-xs text-slate-400">STATUS</div>
          <div className="font-medium">{status}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {details.map((d) => (
          <div key={d.label} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs text-slate-400">{d.label}</div>
            <div className="font-medium">{d.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {flags.map((f) => (
          <span
            key={f}
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
        <div className="text-xs text-slate-400 pb-1">SCIB NOTE</div>
        {note}
      </div>
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
              <h1 className="text-xl font-semibold">Suspects</h1>
              <p className="text-sm text-slate-300">Known Parties • Initial Review</p>
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
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">CASE</div>
                <div className="font-medium">SCIB-CC-1991-022 • The Silent Switchboard</div>
              </div>
              <Tag>REVIEW LIST</Tag>
            </div>
            <p className="text-sm text-slate-200">
              This list reflects original inquiry priorities with SCIB annotations. Recovered evidence may add or remove parties.
            </p>
          </div>

          <Panel title="Suspect Profiles (extract)">
            <div className="space-y-4">
              <SuspectCard
                name="Gavin Roach"
                role="Telecom Technician • Coworker"
                status="Interviewed • No charge"
                details={[
                  { label: "Last known contact", value: "Shift overlap (01:00–02:00)" },
                  { label: "Relationship", value: "Work dispute (rota + access privileges)" },
                  { label: "Technical access", value: "Standard technician access" },
                  { label: "Alibi", value: "Claims on-site in Break Room (unverified)" },
                ]}
                flags={["Motive: dispute", "Opportunity: on-site", "Statement: vague times"]}
                note="Downplays the victim’s concern about “line taps.” Becomes defensive when asked about maintenance mode usage."
              />

              <SuspectCard
                name="Helen Kells"
                role="Spouse • Part-time clerical"
                status="Interviewed • No charge"
                details={[
                  { label: "Financial position", value: "Overdraft + arrears (1991)" },
                  { label: "Alibi", value: "Home (asleep) • No independent verification" },
                  { label: "Knowledge of site", value: "Limited • claims never visited" },
                  { label: "Notable", value: "Lipstick brand used (per statement) 'Rosewood'" },
                ]}
                flags={["Motive: financial stress", "Alibi: weak", "Evidence: lipstick transfer?"]}
                note="Lipstick detail may be coincidence or misdirection. If the cup was planted, the brand mention is a potential trap."
              />

              <SuspectCard
                name="“Mr. Baines”"
                role="Private Contractor • On-site (week of incident)"
                status="Identified • Not located (1991)"
                details={[
                  { label: "Contract scope", value: "Switching upgrades + cabling audit" },
                  { label: "Access level", value: "Temporary master override (contractor)" },
                  { label: "Paper trail", value: "Invoice references 'BAINES, J.'" },
                  { label: "Badge/ID tag", value: "Site pass printed: BAINES-J" },
                ]}
                flags={["Access: high", "Paper trail: thin", "Potential scapegoat"]}
                note="Temporary override access fits a ‘locked room’ exit narrative. However, later review suggests original focus on Baines may have been convenient."
              />
            </div>
          </Panel>

          <Panel title="SCIB Analyst Notes (added on reopen)">
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 01</div>
                <div className="mt-1">
                  The contractor ID format appears consistent: <span className="font-mono">BAINES-J</span>. Treat as a likely retrieval keyword if a contractor archive exists.
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 02</div>
                <div className="mt-1">
                  Spouse lipstick brand mention may be a false trail. Compare against the coffee cup evidence and any recovered communications.
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">NOTE 03</div>
                <div className="mt-1">
                  Coworker alibi is time-boxed but unverified. Cross-check with CCTV index when recovered.
                </div>
              </div>
            </div>
          </Panel>

          {/* Hints section */}
          <div id="hints" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Hints</h2>
                <p className="text-xs text-slate-500">Hidden by default. Expand only if you’re stuck.</p>
              </div>
              <Link href="/cases/silent-switchboard" className="text-sm text-slate-300 hover:text-white">
                Back to Case
              </Link>
            </div>

            <HintBlock
              label="Possible retrieval keyword from this page"
              hint1="One suspect has an ID format that looks like a system login."
              hint2="It’s written in all-caps with a dash, like a badge tag."
              hint3="Try: BAINES-J (if/when a contractor archive becomes available)."
            />

            <HintBlock
              label="The lipstick detail"
              hint1="A lipstick brand is named by one suspect."
              hint2="That detail aligns too neatly with the coffee cup transfer."
              hint3="Treat it as either: (a) accidental truth, or (b) deliberate narrative steering."
            />

            <HintBlock
              label="Who had opportunity in the dosing window?"
              hint1="Autopsy gives 60–90 minutes before death for dosing."
              hint2="Only people with access + proximity in that window matter."
              hint3="Use timeline + witness statements + later CCTV index to eliminate at least one suspect."
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

