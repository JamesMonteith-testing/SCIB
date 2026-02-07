import Image from "next/image";
import Link from "next/link";

export default function SilentSwitchboardCase() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Case Database</div>
              <h1 className="text-xl font-semibold">Cold Case File</h1>
            </div>
          </div>
          <Link href="/" className="text-sm text-slate-300 hover:text-white">Exit</Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="text-sm text-slate-300">Case ID</div>
              <div className="text-lg font-semibold">SCIB-CC-1991-022</div>
            </div>
            <div className="sm:text-right">
              <div className="text-sm text-slate-300">Title</div>
              <div className="text-lg font-semibold">The Silent Switchboard</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs text-slate-400">Date</div>
              <div className="font-medium">03 May 1991</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs text-slate-400">Location</div>
              <div className="font-medium">West Harrow Exchange</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs text-slate-400">Status</div>
              <div className="font-medium">COLD • Reopened</div>
            </div>
          </div>

          <div className="pt-3 space-y-2">
            <h2 className="text-lg font-semibold">Synopsis</h2>
            <p className="text-slate-200 leading-relaxed">
              Martin Kells (38), a night telecom engineer, was found dead inside a locked telephone exchange building during
              his shift. The scene was initially treated as an accident, but later review indicates sedation prior to death.
              Entry points appeared secured and the building was reported locked from the inside. No clear intruder was identified.
              The case went cold amid limited leads and a narrow investigative focus.
            </p>
          </div>

          <div className="pt-3 space-y-2">
            <h2 className="text-lg font-semibold">Known Parties</h2>
            <ul className="list-disc pl-6 text-slate-200 space-y-1">
              <li><span className="font-medium">Gavin Roach</span> — coworker; prior dispute with victim.</li>
              <li><span className="font-medium">Helen Kells</span> — spouse; financial stress; unclear timeline.</li>
              <li><span className="font-medium">“Mr. Baines”</span> — private contractor on-site that week.</li>
            </ul>
          </div>

          <div className="pt-3 space-y-2">
            <h2 className="text-lg font-semibold">Case Directory (prototype)</h2>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
              <div className="font-mono space-y-1">
                <div>/case_file/</div>
                <div className="pl-4">synopsis.txt</div>
                <div className="pl-4">crime_scene_summary.pdf</div>
                <div className="pl-4">autopsy_summary.pdf</div>
                <div className="pl-4">witness_statements/</div>
                <div className="pl-8">witness_statement_01.txt</div>
                <div className="pl-8">witness_statement_02.txt</div>
                <div className="pl-4">evidence_list.txt</div>
                <div className="pl-4">suspects.txt</div>
                <div className="pl-4">timeline.txt</div>
                <div className="pt-2">/recovered/ <span className="text-slate-500">(LOCKED — requires retrieval keys)</span></div>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Next step: Recovery Terminal + unlock slots (REC-01..REC-05) driven by database.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back to Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
