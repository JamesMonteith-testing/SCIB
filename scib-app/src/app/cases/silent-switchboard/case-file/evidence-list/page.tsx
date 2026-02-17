"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

const UNLOCK_STORE_KEY = "scib_case01_unlocked_evidence_v1";

function normalizeCode(raw: string) {
  return (raw || "")
    .trim()
    .toUpperCase()
    .replace(/[’']/g, "'")
    .replace(/[^A-Z0-9\/\-\+\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readUnlocked(): string[] {
  try {
    const raw = localStorage.getItem(UNLOCK_STORE_KEY);
    if (!raw) return ["E-01", "E-02"];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      const base = new Set(["E-01", "E-02", ...parsed.map((s) => s.toUpperCase())]);
      return Array.from(base);
    }
    return ["E-01", "E-02"];
  } catch {
    return ["E-01", "E-02"];
  }
}

function writeUnlocked(ids: string[]) {
  const base = new Set(["E-01", "E-02", ...ids.map((s) => s.toUpperCase())]);
  localStorage.setItem(UNLOCK_STORE_KEY, JSON.stringify(Array.from(base)));
}

function applyEvidenceUnlock(codeRaw: string): { ok: boolean; unlocked: string[]; message: string } {
  const code = normalizeCode(codeRaw);
  if (!code) return { ok: false, unlocked: [], message: "Enter a solution." };

  const unlocks: string[] = [];
  if (code === "MKELLS") unlocks.push("E-05", "E-06");
  if (code === "WHX/OPS 1991-022-03" || code === "WHX/OPS+1991-022-03") unlocks.push("E-03");
  if (code === "DON'T TRUST THE SWITCHBOARD" || code === "DONT TRUST THE SWITCHBOARD") unlocks.push("E-04");

  if (unlocks.length === 0) return { ok: false, unlocked: [], message: "That is not correct." };

  const current = readUnlocked();
  const next = Array.from(new Set([...current, ...unlocks]));
  writeUnlocked(next);

  return { ok: true, unlocked: unlocks, message: `Unlocked: ${unlocks.join(", ")}` };
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

  useEffect(() => {
    setUnlocked(readUnlocked());
    function onStorage(e: StorageEvent) {
      if (e.key === UNLOCK_STORE_KEY) setUnlocked(readUnlocked());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function submitUnlock() {
    const res = applyEvidenceUnlock(unlockCode);
    setUnlockMsg(res.message);
    if (res.ok) {
      setUnlocked(readUnlocked());
      setUnlockCode("");
    }
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
              Solve the clue and submit the solution. This unlocks the next material on this device.
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
                            {isUnlocked ? (
                              <Link
                                className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300 hover:text-white"
                                href={r.href}
                              >
                                {r.id}
                              </Link>
                            ) : (
                              <span className="text-slate-300">{r.id}</span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {isUnlocked ? (
                              <Link
                                className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300 hover:text-white"
                                href={r.href}
                              >
                                {r.label}
                              </Link>
                            ) : (
                              <span className="text-slate-400">SEALED REGISTER ENTRY</span>
                            )}
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
