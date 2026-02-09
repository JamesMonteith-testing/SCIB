import Image from "next/image";
import Link from "next/link";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function Msg({ time, from, to, body }: { time: string; from: string; to: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="font-mono text-sm text-slate-300">{time}</div>
        <div className="text-xs text-slate-500">{from} → {to}</div>
      </div>
      <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{body}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">RECOVERED ARCHIVE</div>
              <h1 className="text-xl font-semibold">REC-02 • Internal Messages (Pager)</h1>
              <p className="text-sm text-slate-300">PAGER/WHX/1991 • Extract</p>
            </div>
          </div>

          <Link href="/cases/silent-switchboard/recovered" className="text-sm text-slate-300 hover:text-white">
            Back to Recovery Terminal
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Tag>SCIB-CC-1991-022</Tag>
            <Tag>REC-02</Tag>
            <Tag>Index: PAGER/</Tag>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Internal pager/messages index recovered from archived service binder. Sender IDs are incomplete.
            Prototype note: actual unlocking logic will be added later.
          </p>
        </section>

        <section className="space-y-3">
          <Msg time="01:07" from="OPS-?" to="WHX/OPS" body="MAINT MODE scheduled. Keep it routine. No extra notes." />
          <Msg time="02:09" from="WHX/OPS" to="OPS-?" body="Printed extract for file ref 1991-022-03. As requested." />
          <Msg time="02:33" from="OPS-?" to="WHX/OPS" body="If he mentions ‘listening’ again, log it as fatigue. Do not escalate." />
          <Msg time="03:58" from="WHX/OPS" to="OPS-?" body="Scene secured. Original narrative stands unless instructed otherwise." />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-2">
          <div className="text-xs text-slate-400">SCIB ANALYST NOTE</div>
          <div className="text-sm text-slate-200 leading-relaxed">
            The language suggests coordination and a preferred “narrative”. This is the first recovered item that implies
            institutional pressure rather than simple negligence.
          </div>
        </section>
      </div>
    </main>
  );
}
