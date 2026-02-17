"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CaseNavLinks from "@/components/CaseNavLinks";

const UNLOCK_KEY = "scib_deleted_correspondence_unlocked_v1";

function normalize(input: string) {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export default function Page() {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (stored === "true") {
      setUnlocked(true);
    }
  }, []);

  function submit() {
    const normalized = normalize(input);

    if (normalized === "HETTIE050389") {
      localStorage.setItem(UNLOCK_KEY, "true");
      setUnlocked(true);
      setStatus("Archive restored.");
      setInput("");
    } else {
      setStatus("No archived correspondence found under that reference.");
    }
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <header className="flex items-center justify-between gap-4 py-4">
            <div>
              <div className="text-xs text-slate-400">SCIB Archive System</div>
              <h1 className="text-xl font-semibold">Deleted Correspondence (Restored)</h1>
              <p className="text-sm text-slate-300">
                West Harrow Exchange • Restricted Node
              </p>
            </div>

            <CaseNavLinks
              caseHref="/cases/silent-switchboard"
              contextHref="/cases/silent-switchboard/recovered"
              contextLabel="Back to Recovery Terminal"
            />
          </header>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4">
            <div className="text-sm text-slate-300">
              This correspondence was flagged during archive compression and is not indexed in the main thread.
            </div>

            <div className="text-sm text-slate-300">
              Enter retrieval reference to restore.
            </div>

            <div className="flex gap-3 pt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter reference"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 outline-none focus:border-slate-600"
              />
              <button
                onClick={submit}
                className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium"
                type="button"
              >
                Restore
              </button>
            </div>

            {status && (
              <div className="pt-3 text-sm text-slate-400">
                {status}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4 py-4">
          <div>
            <div className="text-xs text-slate-400">SCIB Archive System</div>
            <h1 className="text-xl font-semibold">Deleted Correspondence (Restored)</h1>
            <p className="text-sm text-slate-300">
              West Harrow Exchange • Archive Extract
            </p>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/recovered"
            contextLabel="Back to Recovery Terminal"
          />
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4">
          <div className="text-sm text-slate-300">
            The following message chain was excluded from the primary archive log.
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4 text-sm text-slate-200">
            <div>
              <div className="text-xs text-slate-400">
                FROM: d.harper@whx.bt-int
              </div>
              <div className="text-xs text-slate-400">
                TO: m.kells@whx.bt-int
              </div>
              <div className="text-xs text-slate-400">
                DATE: 04 MAR 1991 — 22:13
              </div>
              <div className="font-semibold pt-1">
                SUBJECT: After hours access
              </div>
              <div className="pt-2">
                There’s a gap in the console timeline between 22:01 and 22:09.  
                It’s not in the printed output.  
                Someone accessed the exchange directly.
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">
                FROM: m.kells@whx.bt-int
              </div>
              <div className="text-xs text-slate-400">
                TO: d.harper@whx.bt-int
              </div>
              <div className="text-xs text-slate-400">
                DATE: 04 MAR 1991 — 22:27
              </div>
              <div className="font-semibold pt-1">
                SUBJECT: Re: After hours access
              </div>
              <div className="pt-2">
                That window lines up with the manual override we weren’t told about.  
                If this wasn’t logged properly, it wasn’t accidental.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
