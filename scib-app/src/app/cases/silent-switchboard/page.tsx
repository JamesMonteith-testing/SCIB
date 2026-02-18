import Image from "next/image";
import Link from "next/link";
import CaseNavLinks from "@/components/CaseNavLinks";

function FileRow({
  href,
  name,
  kind,
  indent = 0,
  locked = false,
}: {
  href?: string;
  name: string;
  kind: "folder" | "file";
  indent?: number;
  locked?: boolean;
}) {
  const pad = { paddingLeft: `${12 + indent * 18}px` };

  const icon =
    kind === "folder"
      ? locked
        ? "🔒"
        : "📁"
      : "📄";

  const rowClass =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm " +
    (href
      ? "hover:bg-slate-900/60 hover:text-white transition"
      : "text-slate-300");

  const textClass = locked ? "text-slate-400" : "";

  const content = (
    <div className={rowClass} style={pad}>
      <span className="w-6 text-center">{icon}</span>
      <span className={`font-mono ${textClass}`}>{name}</span>
      {locked && (
        <span className="ml-auto text-xs text-slate-500">
          LOCKED
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

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
          <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/investigation-room" contextLabel="Investigation Room" />
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Synopsis</h2>
            <p className="text-slate-200 leading-relaxed">
              Martin Kells (38), a night telecom engineer, was found dead inside a locked telephone exchange building during
              his shift. The scene was initially treated as an accident, but later review indicates sedation prior to death.
              Entry points appeared secured and the building was reported locked from the inside. No clear intruder was identified.
              The case went cold amid limited leads and a narrow investigative focus.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Case Directory</h2>
                <p className="text-xs text-slate-500">
                  Select a file to open. Recovered evidence is restricted until retrieved.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60">
                <div className="text-xs text-slate-400">PATH</div>
                <div className="font-mono text-sm">/case_file/</div>
              </div>

              <div className="p-2">
<FileRow href="/cases/silent-switchboard/case-file/crime-scene-summary" name="crime_scene_summary.pdf" kind="file" />
                <FileRow href="/cases/silent-switchboard/case-file/autopsy-summary" name="autopsy_summary.pdf" kind="file" />

                <FileRow name="witness_statements/" kind="folder" />
                <FileRow href="/cases/silent-switchboard/witness-statements/witness-statement-01" name="witness_statement_01.txt" kind="file" indent={1} />
                <FileRow href="/cases/silent-switchboard/witness-statements/witness-statement-02" name="witness_statement_02.txt" kind="file" indent={1} />

                <FileRow href="/cases/silent-switchboard/case-file/evidence-list" name="evidence_list.txt" kind="file" />
                <FileRow href="/cases/silent-switchboard/case-file/suspects" name="suspects.txt" kind="file" />
                <FileRow href="/cases/silent-switchboard/case-file/timeline" name="timeline.txt" kind="file" />

                <div className="mt-2 border-t border-slate-800 pt-2">
                  <FileRow href="/cases/silent-switchboard/recovered" name="/recovered/" kind="folder" locked />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/investigation-room" contextLabel="Investigation Room" />
          </div>
        </section>
      </div>
    </main>
  );
}




