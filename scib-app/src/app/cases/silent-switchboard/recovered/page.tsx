"use client";

import Image from "next/image";
import Link from "next/link";
import CaseNavLinks from "@/components/CaseNavLinks";
import { useEffect, useMemo, useState } from "react";

type RecKey = "REC-01" | "REC-02" | "REC-03" | "REC-04";

type SlotDef = {
  id: RecKey;
  label: string;
  href: string;
  accepts: string[]; // accepted codes (normalized)
};

type LogEntry = {
  id: string;
  ts: number;
  text: string;
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

function timeHHMM(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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
  const logKey = "scib_room_access_log_silent_switchboard_v1";

  const [code, setCode] = useState("");
  const [status, setStatus] = useState("SYSTEM STATE: STANDBY");
  const [loaded, setLoaded] = useState(false);

  const [unlocked, setUnlocked] = useState<Record<RecKey, boolean>>({
    "REC-01": false,
    "REC-02": false,
    "REC-03": false,
    "REC-04": false,
  });

  const [roomLog, setRoomLog] = useState<LogEntry[]>([]);

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

  // Load access log
  useEffect(() => {
    try {
      const raw = localStorage.getItem(logKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((x) => x && typeof x === "object" && typeof x.ts === "number" && typeof x.text === "string")
            .map((x) => ({ id: typeof x.id === "string" ? x.id : uid(), ts: x.ts, text: x.text }));
          setRoomLog(cleaned.slice(-20));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist access log
  useEffect(() => {
    try {
      localStorage.setItem(logKey, JSON.stringify(roomLog.slice(-20)));
    } catch {
      // ignore
    }
  }, [roomLog]);

  // Keep multiple tabs in sync
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === logKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            const cleaned = parsed
              .filter((x) => x && typeof x === "object" && typeof x.ts === "number" && typeof x.text === "string")
              .map((x) => ({ id: typeof x.id === "string" ? x.id : uid(), ts: x.ts, text: x.text }));
            setRoomLog(cleaned.slice(-20));
          }
        } catch {
          // ignore
        }
      }
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === "object") {
            setUnlocked((prev) => ({ ...prev, ...parsed }));
          }
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function appendLog(text: string) {
    const entry: LogEntry = { id: uid(), ts: Date.now(), text };
    setRoomLog((prev) => [...prev.slice(-19), entry]);
  }

  function gentleNudge(n: string) {
    // "Human" partials — brief and not procedural-heavy.
    const hasStamp = n.includes("WHX/OPS");
    const hasIndex = n.includes("1991-022-03") || n.includes("1991-022-3");
    const hasPager = n.includes("PAGER");
    const hasPhrase = n.includes("SWITCHBOARD");
    const hasNameish = /^[A-Z]+[-\s][A-Z]$/.test(n) || n.includes("BAINES");

    if (hasStamp && !hasIndex) return "Close — exchange stamp recognised. A second reference is usually appended.";
    if (!hasStamp && hasIndex) return "Reference recognised. Try pairing it with the exchange stamp from the file.";
    if (hasPager && !n.includes("WHX") && !n.includes("1991")) return "Close — pager index recognised. It usually includes location/year.";
    if (hasPhrase) return "Close — warning phrase detected. Check punctuation and spacing from the source artefact.";
    if (hasNameish) return "Close — personnel-style identifier detected. Check exact format in the recovered index.";
    return "No match found for that reference.";
  }

  function submit() {
    const n = normalize(code);

    if (!n) {
      setStatus("SYSTEM STATE: STANDBY");
      return;
    }

    appendLog(`Attempt recorded: "${n}"`);

    const match = slots.find((s) => s.accepts.includes(n));
    if (!match) {
      const msg = gentleNudge(n);
      setStatus(msg);
      appendLog(msg);
      setCode("");
      return;
    }

    if (unlocked[match.id]) {
      const msg = `${match.id} already unsealed.`;
      setStatus(msg);
      appendLog(msg);
      setCode("");
      return;
    }

    setUnlocked((prev) => ({ ...prev, [match.id]: true }));
    setStatus(`Retrieval accepted. ${match.id} unsealed.`);
    appendLog(`Retrieval accepted. ${match.id} unsealed.`);
    setCode("");
  }

  function clear() {
    setCode("");
    setStatus("SYSTEM STATE: STANDBY");
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

          <CaseNavLinks caseHref="/cases/silent-switchboard" contextHref="/cases/silent-switchboard" contextLabel="Back to Case" />
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
                placeholder="ENTER AUTHORIZATION STRING"
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

            <div className="text-xs text-slate-500 pt-1">STATUS: {status}</div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <div className="text-xs text-slate-400 mb-3">ACCESS LOG (ROOM)</div>

              {roomLog.length === 0 ? (
                <div className="text-sm text-slate-300">
                  No access attempts recorded in this session.
                </div>
              ) : (
                <div className="space-y-2">
                  {roomLog
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((e) => (
                      <div key={e.id} className="text-sm text-slate-200">
                        <span className="font-mono text-slate-400">{timeHHMM(e.ts)}</span>
                        <span className="text-slate-500"> — </span>
                        <span>{e.text}</span>
                      </div>
                    ))}
                </div>
              )}

              <div className="pt-3 text-xs text-slate-500">
                Note: keys are derived from artefacts already present in the case file.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
