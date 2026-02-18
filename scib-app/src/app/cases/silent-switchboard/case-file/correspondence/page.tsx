"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CaseNavLinks from "@/components/CaseNavLinks";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function EmailCard({
  from,
  to,
  date,
  subject,
  children,
  badge,
}: {
  from: string;
  to: string;
  date: string;
  subject: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 text-sm text-slate-200">
          <div className="text-xs text-slate-400">FROM: {from}</div>
          <div className="text-xs text-slate-400">TO: {to}</div>
          <div className="text-xs text-slate-400">DATE: {date}</div>
        </div>
        <div className="flex items-center gap-2">
          <Tag>SCIB-CC-1991-022</Tag>
          {badge ? <Tag>{badge}</Tag> : null}
        </div>
      </div>

      <div className="pt-1">
        <div className="text-sm font-semibold">SUBJECT: {subject}</div>
      </div>

      <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{children}</div>
    </div>
  );
}

function StubRow({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-sm text-slate-300 flex items-center justify-between gap-3">
      <span className="font-mono">{label}</span>
      <span className="text-xs text-slate-500">STUB</span>
    </div>
  );
}

const STORAGE_KEY_EXPANDED = "scib_correspondence_expanded_v1";
const STORAGE_KEY_DELETED = "scib_deleted_correspondence_unlocked_v1";

function normalizeKey(input: string) {
  let s = (input || "").toUpperCase();
  s = s.replace(/[\s\-_]/g, "");
  return s;
}

export default function CorrespondencePage() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("STATUS: Awaiting input.");
  const [retrieving, setRetrieving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const expected = "HETTIE050389";

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY_EXPANDED);
      setExpanded(v === "true");
      if (v === "true") setStatus("STATUS: Archive restored. Additional messages are now visible.");
    } catch {}
  }, []);

  function startRetrieval() {
    setRetrieving(true);
    setProgress(0);
    setStatus("STATUS: Reference verified. Retrieving archive...");

    // ~3 seconds, stepped / mechanical
    const steps = [8, 16, 27, 39, 52, 64, 73, 82, 90, 96, 100];
    let i = 0;

    const interval = setInterval(() => {
      setProgress(steps[i]);
      i++;

      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          try {
            localStorage.setItem(STORAGE_KEY_EXPANDED, "true");
            localStorage.setItem(STORAGE_KEY_DELETED, "true");
          } catch {}
          setExpanded(true);
          setRetrieving(false);
          setStatus("STATUS: Archive restored. Additional messages are now visible.");
          setInput("");
        }, 350);
      }
    }, 260);
  }

  function submit() {
    if (retrieving) return;

    const n = normalizeKey(input);

    if (!n) {
      setStatus("STATUS: Enter a reference.");
      return;
    }

    if (n === expected) {
      // Always run the retrieval animation on a valid reference.
      startRetrieval();
      return;
    }

    setStatus("STATUS: No match on this reference. Check spacing/date format and try again.");
  }

  // IMPORTANT: your file is currently under public/evidence/SCIB-CC-1991-022/E-01/
  const HETTIE_PHOTO = "/evidence/SCIB-CC-1991-022/E-01/hettie-birthday-party.png";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Case File</div>
              <h1 className="text-xl font-semibold">Internal Correspondence (Extract)</h1>
              <p className="text-sm text-slate-300">West Harrow Exchange — March 1991</p>
            </div>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/case-file/evidence-list"
            contextLabel="Back to Evidence List"
          />
        </header>

<div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
  <div className="space-y-6">
{/* PUBLIC EXTRACT — always visible */}
        <section className="space-y-4">
          <EmailCard
            from="ops.supervisor@whx-exchange.local"
            to="mkells@whx-exchange.local"
            date="05 MAR 1991 — 03:42"
            subject="Access Log Clarification"
            badge="PUBLIC EXTRACT"
          >
            {"Martin,\n\nThe overnight console printed a partial access sheet again. It is stamped WHX/OPS at the header.\n\nI need the appended internal reference pulled from the footer before shift change. I believe it reads something like 1991-022-03 but confirm before filing.\n\n— D."}
          </EmailCard>

          <EmailCard
            from="mkells@whx-exchange.local"
            to="ops.supervisor@whx-exchange.local"
            date="05 MAR 1991 — 03:58"
            subject="Re: Access Log Clarification"
            badge="PUBLIC EXTRACT"
          >
            {"Confirmed. The footer index is 1991-022-03.\n\nAlso — someone left a note in the engineer book. Exact wording: DON’T TRUST THE SWITCHBOARD.\n\nI have not logged it formally yet."}
          </EmailCard>

          {/* HETTIE EMAIL — PUBLIC, always visible */}
          <EmailCard
            from="mkells@whx-exchange.local"
            to="r.hayward@scib.local"
            date="05 MAR 1991 — 04:11"
            subject="(Personal) Quick thing before shift ends"
            badge="PUBLIC EXTRACT"
          >
            {"Ruth,\n\nDon’t laugh — I found the photo from Hettie’s first birthday. She’s two now and still thinks every box is hers.\n\nAttachment is the only copy I’ve got.\n\n— M."}

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <img src={HETTIE_PHOTO} alt="Attachment: Hettie's first birthday (photo)" className="w-full h-auto" />
            </div>

            <div className="text-xs text-slate-500 mt-2">
              Attachment: <span className="font-mono">hettie-birthday-party.png</span>
            </div>
          </EmailCard>
        </section>

        {/* LOCKED / UNLOCKED STUBS */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Additional Messages</div>
              <div className="text-xs text-slate-500">Some correspondence is withheld pending a verified archive reference.</div>
            </div>
            <Tag>{expanded ? "EXPANDED" : "WITHHELD"}</Tag>
          </div>

          {!expanded ? (
            <div className="space-y-2">
              <StubRow label="Thread fragment — withheld pending reference" />
              <StubRow label="Attachment index — unavailable" />
              <StubRow label="Forwarded chain — truncated" />
            </div>
          ) : (
            <div className="space-y-2">
              <StubRow label="Thread fragment — restored (stub)" />
              <StubRow label="Attachment index — restored (stub)" />
              <StubRow label="Forwarded chain — restored (stub)" />
              <StubRow label="Personal note — restored (stub)" />
            </div>
          )}
        </section>

        {/* OLD-STYLE INPUT TERMINAL */}
  </div>

  <aside className="space-y-4">
  <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-xs text-slate-400">ARCHIVE FLAGS</div>
        <div className="text-sm text-slate-200 mt-1">Legacy parse output (WHX exchange extract)</div>
      </div>
      <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[11px] text-slate-300">
        STUB
      </span>
    </div>

    <ul className="mt-3 space-y-2 text-sm text-slate-200">
      <li>• Keyword detected: <span className="font-mono">HETTIE</span></li>
      <li>• Attachment signature: <span className="font-mono">PNG/1991</span></li>
      <li>• Cross-reference: <span className="font-mono">WHX/OPS</span></li>
      <li>• Ref match pending: <span className="font-mono">1991-022-03</span></li>
    </ul>

    <div className="mt-3 text-xs text-slate-500">
      This panel reflects archive parsing, not SCIB annotations.
    </div>
  </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">ARCHIVE RETRIEVAL</div>
              <div className="text-sm text-slate-200">Enter a reference to expand the correspondence extract.</div>
              <div className="text-xs text-slate-500 mt-1">Tip: spacing and hyphens don’t matter.</div>
            </div>
            <Tag>CONSOLE</Tag>
          </div>

          <div className="border border-green-700 bg-black px-4 py-4 space-y-3 font-mono text-green-400">
            <div className="text-xs text-green-500">{"> ENTER ARCHIVE REFERENCE"}</div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)} disabled={retrieving}
              placeholder="e.g. HETTIE050389"
              className="w-full font-mono bg-black border border-green-700 px-3 py-3 text-green-300 outline-none placeholder:text-green-800 focus:border-green-500"
            />

            <div className="flex items-center gap-3">
              <button onClick={submit} disabled={retrieving} className="border border-green-700 bg-black hover:bg-green-900 transition px-4 py-2 font-mono text-sm text-green-300 disabled:opacity-60">
                SUBMIT
              </button>
              <button
                onClick={() => {
                  setInput("");
                  setStatus("STATUS: Awaiting input.");
                }}
                className="border border-green-800 bg-black hover:bg-green-950 transition px-4 py-2 font-mono text-sm text-green-700 disabled:opacity-60"
              >
                CLEAR
              </button>
            </div>

            <div className="text-xs text-green-500">{status}</div>
            {retrieving && (
              <div className="mt-3 space-y-2">
                <div className="w-full border border-green-700 h-4 bg-black">
                  <div className="bg-green-600 h-4" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-green-500">{progress}%</div>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500">Prototype note: unlock state is stored locally in your browser.</div>
        </section>


  
</aside>
</div>

<div className="pt-2">
          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/case-file/evidence-list"
            contextLabel="Back to Evidence List"
          />
        </div>
      </div>
    </main>
  );
}


