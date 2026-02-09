"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RecKey = "REC-01" | "REC-02" | "REC-03" | "REC-04";

type SlotDef = {
  id: RecKey;
  label: string;
  href: string;
  accepts: string[]; // accepted codes (normalized)
};

function normalize(input: string) {
  return input
    .trim()
    .toUpperCase()
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s+/g, " ");
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

export default function Page() {
  const slots: SlotDef[] = useMemo(
    () => [
      {
        id: "REC-01",
        label: "Access Logs (Extended)",
        href: "/cases/silent-switchboard/recovered/rec-01",
        accepts: [
          normalize("WHX/OPS + 1991-022-03"),
          normalize("WHX/OPS 1991-022-03"),
          normalize("1991-022-03"),
          normalize("1991-022-3"),
        ],
      },
      {
        id: "REC-02",
        label: "Internal Messages (Pager)",
        href: "/cases/silent-switchboard/recovered/rec-02",
        accepts: [normalize("PAGER/WHX/1991"), normalize("PAGER WHX 1991")],
      },
      {
        id: "REC-03",
        label: "Contractor Records",
        href: "/cases/silent-switchboard/recovered/rec-03",
        accepts: [normalize("BAINES-J"), normalize("BAINES J")],
      },
      {
        id: "REC-04",
        label: "SCIB Internal Memo",
        href: "/cases/silent-switchboard/recovered/rec-04",
        accepts: [normalize("DON'T TRUST THE SWITCHBOARD"), normalize("DONT TRUST THE SWITCHBOARD")],
      },
    ],
    []
  );

  const storageKey = "scib_unlocks_silent_switchboard_v1";

  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Awaiting input.");
  const [loaded, setLoaded] = useState(false);

  const [unlocked, setUnlocked] = useState<Record<RecKey, boolean>>({
    "REC-01": false,
    "REC-02": false,
    "REC-03": false,
    "REC-04": false,
  });

  // Load unlocks first
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setUnlocked((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  // Only save AFTER we've loaded, so we never overwrite stored unlocks with defaults
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(unlocked));
    } catch {
      // ignore
    }
  }, [loaded, unlocked]);

  function submit() {
    const n = normalize(code);

    if (!n) {
      setStatus("Awaiting input.");
      return;
    }

    const match = slots.find((s) => s.accepts.includes(n));
    if (!match) {
      setStatus(`No matching archive found. (You entered: "${n}")`);
      return;
    }

    if (unlocked[match.id]) {
      setStatus(`${match.id} already unlocked.`);
      return;
    }

    setUnlocked((prev) => ({ ...prev, [match.id]: true }));
    setStatus(`ARCHIVE ${match.id} LOCATED. INTEGRITY CHECK… OK. ACCESS GRANTED.`);
    setCode("");
  }

  function clear() {
    setCode("");
    setStatus("Awaiting input.");
  }

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

          <Link href="/cases/silent-switchboard" className="text-sm text-slate-300 hover:text-white">
            Back to Case
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed">
            This directory contains materials added to the case file after initial closure.
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">
            Access is restricted to officers with procedural knowledge of the case.
          </p>
          <p className="text-xs text-slate-500">Improper access attempts are logged.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {slots.map((s) => (
              <Slot key={s.id} id={s.id} label={s.label} href={s.href} locked={!unlocked[s.id]} />
            ))}
            <div className="text-xs text-slate-500 pt-2">
              Prototype note: unlock state is stored locally in your browser.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-4">
            <div className="text-xs text-slate-400">RETRIEVAL CONSOLE</div>

            <div className="rounded-lg border border-slate-700 bg-black px-4 py-3 font-mono text-sm text-slate-200 flex items-center gap-2">
              <span className="text-slate-400">&gt;</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="ENTER RETRIEVAL KEY"
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submit}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900 transition"
              >
                SUBMIT
              </button>
              <button
                onClick={clear}
                className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900 transition"
              >
                CLEAR
              </button>
            </div>

            <div className="text-xs text-slate-500 pt-2">STATUS: {status}</div>

            <details className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <summary className="cursor-pointer select-none text-sm text-slate-300">
                If you get stuck (prototype hints)
              </summary>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <div><span className="text-slate-400">REC-01:</span> WHX/OPS + 1991-022-03</div>
                <div><span className="text-slate-400">REC-02:</span> PAGER/WHX/1991</div>
                <div><span className="text-slate-400">REC-03:</span> BAINES-J</div>
                <div><span className="text-slate-400">REC-04:</span> DON’T TRUST THE SWITCHBOARD</div>
              </div>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
