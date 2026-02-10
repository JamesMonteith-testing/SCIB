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

export default function WelcomePage() {
  // Prototype rule for now:
  // Case 01 is unlocked; others are locked until we wire solved-state later.
  const case01Unlocked = true;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/scib-badge.png"
              alt="SCIB Badge"
              width={48}
              height={48}
              priority
            />
            <div>
              <div className="text-xs text-slate-400">SCIB Secure Access</div>
              <h1 className="text-xl font-semibold">Welcome Back</h1>
            </div>
          </div>

          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            Exit
          </Link>
        </header>

        {/* Existing welcome panel */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <div className="text-sm text-slate-300">Signed in as</div>
              <div className="text-2xl font-semibold">Detective Kelly</div>
              <div className="text-slate-300">
                Badge Number:{" "}
                <span className="font-medium text-slate-100">SCIB-2972</span>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  href="/cases"
                  className="block rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-medium text-center"
                >
                  Enter SCIB Database
                </Link>

                <Link
                  href="/login"
                  className="block rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
                >
                  Back to Login
                </Link>
              </div>

              <p className="text-xs text-slate-500 pt-2">
                Prototype: this screen will later load your real badge details
                from the database.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs text-slate-400 pb-3">
                SCIB Identification
              </div>

              <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
                <Image
                  src="/brand/detective-kelly-badge.png"
                  alt="Detective Kelly SCIB ID"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
              </div>

              <p className="text-xs text-slate-500 pt-3">
                This is currently a static image template. Next phase: generate
                this dynamically per user.
              </p>
            </div>
          </div>
        </section>

        {/* Reintroduced case board stubs */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Case List</div>
            <div className="text-xs text-slate-500">
              Click an unlocked case to enter
            </div>
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
      </div>
    </main>
  );
}
