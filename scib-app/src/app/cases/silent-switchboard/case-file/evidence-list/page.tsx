"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

type ProgressState = {
  unlockedEvidence?: string[];
};

function normalizeCode(raw: string) {
  return (raw || "")
    .trim()
    .toUpperCase()
    .replace(/[’']/g, "'")
    .replace(/[^A-Z0-9\/\-\+\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function LockedClue({ id }: { id: string }) {
  const clue =
    id === "E-03"
      ? 'Clue: locate the access log header stamp and the faint footer reference. Submit as "WHX/OPS 1991-022-03".'
      : id === "E-04"
      ? "Clue: a single warning phrase in the engineer notebook is the keyword. Submit the phrase exactly."
      : id === "E-05"
      ? "Clue: use the access card label from E-01."
      : id === "E-06"
      ? "Clue: use the access card label from E-01."
      : "";

  if (!clue) return null;
  return <div className="pt-1 text-xs text-slate-500">{clue}</div>;
}

export default function Page() {
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockMsg, setUnlockMsg] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>(["E-01", "E-02"]);

  const esRef = useRef<EventSource | null>(null);

  async function loadProgressSnapshot() {
    try {
      const res = await fetch("/api/room/case01/progress", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.state) return;

      const state = data.state as ProgressState;
      const next = new Set<string>(["E-01", "E-02"]);
      for (const id of Array.isArray(state.unlockedEvidence) ? state.unlockedEvidence : []) {
        next.add(String(id).toUpperCase());
      }
      setUnlocked(Array.from(next));
    } catch {
      // ignore
    }
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
          const next = new Set<string>(["E-01", "E-02"]);
          for (const id of Array.isArray(state?.unlockedEvidence) ? state!.unlockedEvidence! : []) {
            next.add(String(id).toUpperCase());
          }
          setUnlocked(Array.from(next));
        } catch {}
      });

      es.addEventListener("error", () => {
        window.setTimeout(() => {
          loadProgressSnapshot();
        }, 800);
      });
    } catch {
      // ignore
    }

    return () => {
      try {
        esRef.current?.close();
      } catch {}
      esRef.current = null;
    };
  }, []);

  async function submitUnlock() {
    const code = normalizeCode(unlockCode);
    if (!code) {
      setUnlockMsg("Enter a solution.");
      return;
    }

    const candidates = [
      { evidenceId: "E-03", code },
      { evidenceId: "E-04", code },
      { evidenceId: "E-05", code },
      { evidenceId: "E-06", code },
    ];

    let unlockedIds: string[] = [];

    for (const candidate of candidates) {
      try {
        const res = await fetch("/api/room/case01/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "unlock_evidence",
            evidenceId: candidate.evidenceId,
            code: candidate.code,
          }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.ok) {
          unlockedIds.push(candidate.evidenceId);
        }
      } catch {
        // ignore per candidate
      }
    }

    if (unlockedIds.length === 0) {
      setUnlockMsg("That is not correct.");
      return;
    }

    setUnlockMsg(`Unlocked: ${unlockedIds.join(", ")}`);
    setUnlockCode("");
    await loadProgressSnapshot();
  }

  const rows = useMemo(
    () => [
      {
        id: "E-01",
        label: "Lanyard + Access Card",
        href: "/cases/silent-switchboard/case-file/evidence/e-01",
        collected: "03/05/91 04:22",
        notes: 'Card label: "MKELLS". Lanyard clip fractured (fresh).',
      },
      {
        id: "E-02",
        label: "Coffee Cup",
        href: "/cases/silent-switchboard/case-file/evidence/e-02",
        collected: "03/05/91 04:28",
        notes: "Cosmetic transfer on rim (lipstick). No matching statement in initial interviews.",
      },
      {
        id: "E-03",
        label: "Dot-matrix Access Log (partial)",
        href: "/cases/silent-switchboard/case-file/evidence/e-03",
        collected: "03/05/91 04:35",
        notes: 'Header stamp: "WHX/OPS". Internal reference printed faintly at footer: "1991-022-03".',
      },
      {
        id: "E-04",
        label: "Engineer Notebook Page",
        href: "/cases/silent-switchboard/case-file/evidence/e-04",
        collected: "03/05/91 04:41",
        notes: 'Handwritten line: "DON’T TRUST THE SWITCHBOARD".',
      },
      {
        id: "E-05",
        label: "Master Key Inventory Sheet",
        href: "/cases/silent-switchboard/case-file/evidence/e-05",
        collected: "—",
        notes: "Flagged in register. Chain-of-custody incomplete.",
      },
      {
        id: "E-06",
        label: "Maintenance Console Printout",
        href: "/cases/silent-switchboard/case-file/evidence/e-06",
        collected: "—",
        notes: "Listed in intake log. Printed output retained as recovered.",
      },
    ],
    []
  );

  const unlockedSet = new Set(unlocked.map((s) => s.toUpperCase()));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Case Database</div>
              <h1 className="text-xl font-semibold">Evidence List</h1>
              <p className="text-sm text-slate-300">Property & Intake Register • Extract</p>
            </div>
          </div>

          <CaseNavLinks caseHref="/cases/silent-switchboard" />
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">CASE</div>
                <div className="font-medium">SCIB-CC-1991-022 • The Silent Switchboard</div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs text-slate-400">REGISTER STATUS</div>
                <div className="font-medium">Incomplete chain-of-custody noted</div>
              </div>
            </div>

            <p className="text-slate-200 text-sm">
              Items below are taken from the original intake log with SCIB annotations added on reopen. Locked entries indicate sealed material.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                href="/cases/silent-switchboard/case-file/correspondence"
                className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
              >
                Internal Correspondence (Extract)
              </Link>

              <Link
                href="/investigation-room"
                className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
              >
                Investigation Room
              </Link>

              <Link
                href="/cases/silent-switchboard/recovered"
                className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
              >
                Recovery Terminal
              </Link>
            </div>
          </div>

          <Panel title="Unlock Shortcut (mirrors Investigation Room)">
            <div className="text-sm text-slate-200">
              Solve the clue and submit the solution. This unlocks the next material for the current shared investigation instance.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <input
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                placeholder='Enter solution (e.g. MKELLS)'
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 outline-none focus:border-slate-600"
              />
              <button
                onClick={submitUnlock}
                className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium"
                type="button"
              >
                Submit Solution
              </button>
              <div className="text-xs text-slate-500 flex items-center">
                Prefer the room? Use the main console in{" "}
                <Link className="underline ml-1" href="/investigation-room">
                  Investigation Room
                </Link>
                .
              </div>
            </div>
            {unlockMsg ? (
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">{unlockMsg}</div>
            ) : null}
          </Panel>

          <Panel title="Evidence Register (extract)">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50">
                <div className="text-xs text-slate-400">EVIDENCE REGISTER</div>
                <div className="font-mono text-sm">West Harrow Exchange • Intake Log</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 bg-slate-950/40">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium">Ref</th>
                      <th className="text-left px-5 py-3 font-medium">Item</th>
                      <th className="text-left px-5 py-3 font-medium">Collected</th>
                      <th className="text-left px-5 py-3 font-medium">Notes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {rows.map((r) => {
                      const isUnlocked = unlockedSet.has(r.id);
                      return (
                        <tr key={r.id} className="align-top">
                          <td className="px-5 py-4 font-mono">
                            <Link
                              className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300 hover:text-white"
                              href={r.href}
                            >
                              {r.id}
                            </Link>
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300 hover:text-white"
                              href={r.href}
                            >
                              {isUnlocked ? r.label : "SEALED REGISTER ENTRY"}
                            </Link>
                            {!isUnlocked ? <LockedClue id={r.id} /> : null}
                          </td>

                          <td className="px-5 py-4">{r.collected}</td>

                          <td className="px-5 py-4 text-slate-200">
                            {isUnlocked ? r.notes : <span className="text-slate-500">LOCKED — submit solution to access.</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/cases/silent-switchboard"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back to Case
            </Link>
            <Link href="/" className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center">
              Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
