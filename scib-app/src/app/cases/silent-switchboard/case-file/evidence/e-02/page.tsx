"use client";

import Image from "next/image";
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

const PHOTO_SRC = "/evidence/SCIB-CC-1991-022/E-02/coffee-cup.png";

export default function Page() {
  const [ok, setOk] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    async function loadProgressSnapshot() {
      try {
        const res = await fetch("/api/room/case01/progress", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok || !data?.state) return;
        setOk(hasUnlocked(data.state as ProgressState, "E-02"));
      } catch {}
    }

    loadProgressSnapshot();

    try {
      const es = new EventSource("/api/room/case01/stream");
      esRef.current = es;

      es.addEventListener("progress", (evt) => {
        try {
          const payload = JSON.parse((evt as MessageEvent).data) as { state?: ProgressState };
          setOk(hasUnlocked(payload?.state || null, "E-02"));
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
    return "Clue: the evidence implies that someone else was present in the control room. Submit the word that best describes that person.";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Evidence Viewer</div>
              <h1 className="text-xl font-semibold">Evidence Item E-02</h1>
              <p className="text-sm text-slate-300">Coffee Cup • Intake Property</p>
            </div>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/case-file/evidence-list"
            contextLabel="Back to Evidence List"
          />
        </header>

        <section className="space-y-6">
          <EvidenceTerminal
            sourceEvidenceId="E-02"
            unlockEvidenceId="E-02"
            acceptedTokens={["VISITOR"]}
            clueText={clueText}
            hintText="The code refers to what the cup proves about the scene."
            channelLabel="LAB"
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-2">
            <div className="text-xs text-slate-400">REGISTER ENTRY</div>
            <div className="text-sm text-slate-200">
              Ref: <span className="font-mono">E-02</span> • Collected: <span className="font-mono">03/05/91 04:28</span>
            </div>
            <div className="text-sm text-slate-200">
              Item: Coffee cup. Rim exhibits cosmetic transfer consistent with lipstick.
            </div>
          </div>

          <Panel title="Evidence Photo">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <Image
                src={PHOTO_SRC}
                alt="E-02 Photo — Coffee Cup in Evidence Bag"
                width={1200}
                height={900}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>

            <div className="text-xs text-slate-500">
              Exhibit photo: bagged coffee cup recovered from the Main Control Room.
              Lipstick transfer visible on rim.
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
                  <div className="text-xs text-emerald-200">ADDENDUM • LABORATORY REVIEW</div>
                  <div className="mt-2 text-sm text-slate-100 leading-relaxed">
                    Trace cosmetic residue recovered from the rim of the cup.
                    <div className="mt-2 text-sm text-slate-200">
                      Initial field report identified the transfer as lipstick. Laboratory analysis confirms cosmetic wax compounds
                      consistent with lipstick pigment.
                    </div>
                    <div className="mt-2 text-sm text-slate-200">
                      No female staff were scheduled inside West Harrow Exchange during the <span className="font-mono">23:00–05:00</span> maintenance window.
                    </div>
                    <div className="mt-2 text-sm text-slate-200">
                      No visitor log entries were recorded for that period.
                    </div>
                    <div className="mt-4 text-xs text-emerald-200">INVESTIGATIVE NOTE</div>
                    <div className="mt-2 text-sm text-slate-200">
                      The presence of the cup indicates that a second individual was present in the control room during Kells' shift.
                    </div>
                    <div className="mt-2 text-sm text-slate-200">
                      Investigators should review witness statements for any references to unexpected visitors or late-night access requests.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}
