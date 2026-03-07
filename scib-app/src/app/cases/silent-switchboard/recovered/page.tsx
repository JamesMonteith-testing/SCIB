"use client";

import Image from "next/image";
import Link from "next/link";
import CaseNavLinks from "@/components/CaseNavLinks";
import { useEffect, useMemo, useRef, useState } from "react";

type RecKey = "REC-01" | "REC-02" | "REC-03" | "REC-04";

type SlotDef = {
  id: RecKey;
  label: string;
  href: string;
};

type ProgressState = {
  unlockedEvidence?: string[];
  solved?: boolean;
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function Slot({
  id,
  label,
  locked,
  href,
}: {
  id: string;
  label: string;
  locked: boolean;
  href: string;
}) {
  const inner = (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 hover:bg-slate-950/50 transition">
      <div>
        <div className="font-mono text-sm">{id}</div>
        <div className={`text-sm text-slate-300 ${locked ? "" : "font-semibold text-slate-100"}`}>
          {label}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`text-xs ${locked ? "text-slate-500" : "text-emerald-300"}`}>
          {locked ? "LOCKED" : "UNLOCKED"}
        </div>

        <div
          className={`text-lg leading-none ${locked ? "text-slate-500" : "text-emerald-300"}`}
          aria-hidden="true"
        >
          {locked ? "🔒" : "🔓"}
        </div>
      </div>
    </div>
  );

  if (locked) return inner;

  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}

function hasUnlocked(state: ProgressState | null, id: string) {
  const set = new Set((state?.unlockedEvidence || []).map((x) => String(x).toUpperCase()));
  return set.has(id.toUpperCase());
}

/*
Central rule map
Future cases only edit this section
*/
const RECOVERED_UNLOCK_RULES: Record<RecKey, string> = {
  "REC-01": "E-03",
  "REC-02": "E-06",
  "REC-03": "E-05",
  "REC-04": "E-04",
};

function deriveRecoveredUnlocks(state: ProgressState | null): Record<RecKey, boolean> {
  const result: Record<RecKey, boolean> = {
    "REC-01": false,
    "REC-02": false,
    "REC-03": false,
    "REC-04": false,
  };

  for (const key of Object.keys(RECOVERED_UNLOCK_RULES) as RecKey[]) {
    const evidenceId = RECOVERED_UNLOCK_RULES[key];
    result[key] = hasUnlocked(state, evidenceId);
  }

  return result;
}

export default function Page() {
  const slots: SlotDef[] = useMemo(
    () => [
      {
        id: "REC-01",
        label: "Access Logs (Extended)",
        href: "/cases/silent-switchboard/recovered/rec-01",
      },
      {
        id: "REC-02",
        label: "Internal Messages (Pager)",
        href: "/cases/silent-switchboard/recovered/rec-02",
      },
      {
        id: "REC-03",
        label: "Contractor Records",
        href: "/cases/silent-switchboard/recovered/rec-03",
      },
      {
        id: "REC-04",
        label: "SCIB Internal Memo",
        href: "/cases/silent-switchboard/recovered/rec-04",
      },
    ],
    []
  );

  const [progressState, setProgressState] = useState<ProgressState | null>(null);
  const [unlocked, setUnlocked] = useState<Record<RecKey, boolean>>({
    "REC-01": false,
    "REC-02": false,
    "REC-03": false,
    "REC-04": false,
  });

  const esRef = useRef<EventSource | null>(null);

  async function loadProgressSnapshot() {
    try {
      const res = await fetch("/api/room/case01/progress", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.state) return;

      const state = data.state as ProgressState;

      setProgressState(state);
      setUnlocked(deriveRecoveredUnlocks(state));
    } catch {}
  }

  useEffect(() => {
    loadProgressSnapshot();

    try {
      const es = new EventSource("/api/room/case01/stream");
      esRef.current = es;

      es.addEventListener("progress", (evt) => {
        try {
          const payload = JSON.parse((evt as MessageEvent).data) as { state?: ProgressState };

          const state = payload?.state || null;

          setProgressState(state);
          setUnlocked(deriveRecoveredUnlocks(state));
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB INTERNAL SYSTEM</div>
              <h1 className="text-xl font-semibold">Recovery Terminal</h1>
              <p className="text-sm text-slate-300">SCIB-CC-1991-022 • The Silent Switchboard</p>
            </div>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard"
            contextLabel="Back to Case"
          />
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed">
            This directory contains materials added to the case file after initial closure.
          </p>

          <p className="text-sm text-slate-200 leading-relaxed">
            Recovered items appear automatically when associated evidence is unlocked during the investigation.
          </p>

          <p className="text-xs text-slate-500">
            Visibility is scoped to the current investigation instance.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Recovered Materials</h2>
            <Tag>INSTANCE-SCOPED</Tag>
          </div>

          <div className="space-y-3">
            {slots.map((s) => (
              <Slot key={s.id} id={s.id} label={s.label} href={s.href} locked={!unlocked[s.id]} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
