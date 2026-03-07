"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CaseNavLinks from "@/components/CaseNavLinks";
import EvidenceTerminal from "@/components/EvidenceTerminal";

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

type ProgressState = {
  unlockedEvidence?: string[];
};

function hasUnlocked(state: ProgressState | null, id: string) {
  const set = new Set((state?.unlockedEvidence || []).map((x) => String(x).toUpperCase()));
  return set.has(id.toUpperCase());
}

const PDF_SRC = "/evidence/SCIB-CC-1991-022/E-03/E-03_Evidence_Sheet.pdf";
const PHOTO_SRC = "/evidence/SCIB-CC-1991-022/E-03/E-03_Photo_EvidenceBag.png";

export default function Page() {
  const [ok, setOk] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    async function loadProgressSnapshot() {
      try {
        const res = await fetch("/api/room/case01/progress", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok || !data?.state) return;
        setOk(hasUnlocked(data.state as ProgressState, "E-03"));
      } catch {}
    }

    loadProgressSnapshot();

    try {
      const es = new EventSource("/api/room/case01/stream");
      esRef.current = es;

      es.addEventListener("progress", (evt) => {
        try {
          const payload = JSON.parse((evt as MessageEvent).data) as { state?: ProgressState };
          setOk(hasUnlocked(payload?.state || null, "E-03"));
        } catch {}
      });

      es.addEventListener("error", () => {
        window.setTimeout(() => {
          loadProgressSnapshot();
        }, 800);
      });
    } catch {}

    return () => {
      try {
        esRef.current?.close();
      } catch {}
      esRef.current = null;
    };
  }, []);

  const clueText = useMemo(() => {
    return "Clue: locate the access log header stamp and the faint footer reference. Combine them into a single access code and submit it via the terminal below.";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Evidence Viewer</div>
              <h1 className="text-xl font-semibold">Evidence Item E-03</h1>
              <p className="text-sm text-slate-300">Dot-matrix Access Log (partial) • Intake Property</p>
            </div>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/case-file/evidence-list"
            contextLabel="Back to Evidence List"
          />
        </header>

        <section className="space-y-4">
          <EvidenceTerminal
            sourceEvidenceId="E-03"
            unlockEvidenceId="E-03"
            acceptedTokens={["WHX/OPS 1991-022-03", "WHX/OPS+1991-022-03"]}
            clueText={clueText}
            hintText="The code is formed by combining a header stamp with a footer reference from the sheet."
            channelLabel="OPS"
          />

          <Panel title="Evidence Sheet (PDF)">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">If the embedded viewer fails, open the file directly.</div>
              <Link
                href={PDF_SRC}
                className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-xs font-medium"
              >
                Open PDF
              </Link>
            </div>
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-black">
              <iframe src={PDF_SRC} className="w-full h-[520px]" />
            </div>
          </Panel>

          <Panel title="Photo (evidence bag)">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
              <Image src={PHOTO_SRC} alt="Evidence bag photo" width={1200} height={900} className="w-full h-auto" />
            </div>
          </Panel>

          <Panel title="Sealed Addendum (reveals after unlock)">
            {!ok ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-xs text-slate-400">SEALED</div>
                <div className="mt-1 text-sm text-slate-200">
                  The addendum is encrypted in the register. Use the terminal above to unlock access.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/15 p-4">
                  <div className="text-xs text-emerald-200">ADDENDUM • POST-UNLOCK</div>
                  <div className="mt-2 text-sm text-slate-100 leading-relaxed">
                    A faint, non-standard line appears beneath the footer reference — likely added during the print run:
                    <div className="mt-2 font-mono text-sm text-slate-200">
                      AUTH OVERRIDE: OPS SHIFT A • INITIALS: G.R. • CONSOLE: B-12
                    </div>
                    <div className="mt-2 text-sm text-slate-200">
                      If the override is genuine, someone with OPS authority was present at the switching floor console.
                      Cross-reference any staff initials matching <span className="font-mono">G.R.</span> in statements and shift logs.
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Tip: post this addendum into the Investigation Room findings thread so it becomes a shared team anchor.
                </div>
              </div>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}
