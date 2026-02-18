import Image from "next/image";
import Link from "next/link";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function CaseRow({
  unlocked,
  caseId,
  title,
  subtitle,
  href,
}: {
  unlocked: boolean;
  caseId: string;
  title: string;
  subtitle: string;
  href?: string;
}) {
  const content = (
    <div
      className={[
        "rounded-2xl border p-5 transition",
        unlocked
          ? "border-emerald-700/50 bg-emerald-950/10 hover:bg-emerald-950/20"
          : "border-slate-800 bg-slate-950/30 opacity-80",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs text-slate-400">{caseId}</div>

          <div
            className={[
              "text-xl font-semibold",
              unlocked ? "text-emerald-200" : "text-slate-300",
            ].join(" ")}
          >
            {title}
          </div>

          <div className="text-sm text-slate-300">{subtitle}</div>

          <div className="flex flex-wrap gap-2 pt-1">
            {unlocked ? <Tag>UNLOCKED</Tag> : <Tag>LOCKED</Tag>}
            <Tag>Mode: Collaborative</Tag>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={[
              "rounded-xl border px-3 py-2 text-sm",
              unlocked
                ? "border-emerald-700/40 bg-emerald-950/20 text-emerald-200"
                : "border-slate-700 bg-slate-950/40 text-slate-400",
            ].join(" ")}
            title={unlocked ? "Unlocked" : "Locked"}
          >
            {unlocked ? "🔓" : "🔒"}
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {unlocked
            ? "Access granted. Click to enter investigation room."
            : "Resolve previous case to gain access."}
        </div>

        <div
          className={[
            "text-sm font-medium",
            unlocked ? "text-emerald-200" : "text-slate-500",
          ].join(" ")}
        >
          {unlocked ? "Enter →" : "Restricted"}
        </div>
      </div>
    </div>
  );

  if (!unlocked || !href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function Home() {
  // Prototype rule for now:
  // Case 01 is unlocked; others are locked until we wire solved-state later.
  const case01Unlocked = true;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB SYSTEM</div>
              <h1 className="text-xl font-semibold">Unlocked Mysteries</h1>
              <p className="text-sm text-slate-300">Prototype • Auth stubbed</p>
            </div>
          </div>

          <div className="text-sm text-slate-400">
            Access is logged.
          </div>
        </header>

        {/* Unlocked / Locked list */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Case List</div>
            <div className="text-xs text-slate-500">Click an unlocked case to enter</div>
          </div>

          <div className="space-y-4">
            <CaseRow
              unlocked={case01Unlocked}
              caseId="CASE 01"
              title="The Silent Switchboard"
              subtitle="SCIB-CC-1991-022 • West Harrow Exchange"
              href="/investigation-room"
            />

            <CaseRow
              unlocked={false}
              caseId="CASE 02"
              title="CLASSIFIED"
              subtitle="Available after Case 01 is solved"
            />

            <CaseRow
              unlocked={false}
              caseId="CASE 03"
              title="CLASSIFIED"
              subtitle="Available after Case 02 is solved"
            />

            <CaseRow
              unlocked={false}
              caseId="CASE 04"
              title="CLASSIFIED"
              subtitle="Available after Case 03 is solved"
            />
          </div>
        </section>

        <div className="text-xs text-slate-500">
          Next: we’ll wire “Solved” state to flip Case 01 into SOLVED and unlock Case 02 automatically.
        </div>
      </div>
    </main>
  );
}
