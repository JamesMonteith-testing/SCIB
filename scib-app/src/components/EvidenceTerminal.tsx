"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProgressState = {
  unlockedEvidence?: string[];
  solved?: boolean;
};

type TermStatus = "idle" | "running" | "granted" | "denied";

type EvidenceTerminalProps = {
  sourceEvidenceId: string;
  unlockEvidenceId: string;
  acceptedTokens: string[];
  clueText: string;
  hintText?: string;
  channelLabel?: string;
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

function hasUnlocked(state: ProgressState | null, id: string) {
  const set = new Set((state?.unlockedEvidence || []).map((x) => String(x).toUpperCase()));
  return set.has(id.toUpperCase());
}

function formatBar(pct: number) {
  const width = 28;
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  const empty = width - filled;
  return `[${"#".repeat(filled)}${".".repeat(empty)}] ${String(pct).padStart(3, " ")}%`;
}

export default function EvidenceTerminal({
  sourceEvidenceId,
  unlockEvidenceId,
  acceptedTokens,
  clueText,
  hintText,
  channelLabel,
}: EvidenceTerminalProps) {
  const [ok, setOk] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<TermStatus>("idle");
  const [lines, setLines] = useState<string[]>([
    "SCIB // CASE ACCESS TERMINAL",
    `NODE: WHX  |  CHANNEL: ${channelLabel || "AUTH"}`,
    "",
    "READY.",
  ]);
  const [progress, setProgress] = useState<number | null>(null);

  const timersRef = useRef<number[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function clearTimers() {
    for (const id of timersRef.current) {
      try {
        window.clearTimeout(id);
      } catch {}
    }
    timersRef.current = [];
  }

  function pushLine(s: string) {
    setLines((prev) => [...prev, s].slice(-18));
  }

  async function loadProgressSnapshot() {
    try {
      const res = await fetch("/api/room/case01/progress", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.state) return;
      const state = data.state as ProgressState;
      setOk(hasUnlocked(state, unlockEvidenceId));
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
          setOk(hasUnlocked(state, unlockEvidenceId));
        } catch {}
      });

      es.addEventListener("error", () => {
        window.setTimeout(() => {
          loadProgressSnapshot();
        }, 800);
      });
    } catch {}

    return () => {
      clearTimers();
      try {
        esRef.current?.close();
      } catch {}
      esRef.current = null;
    };
  }, [unlockEvidenceId]);

  async function finalizeGrant(normalized: string) {
    try {
      const res = await fetch("/api/room/case01/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unlock_evidence",
          evidenceId: unlockEvidenceId,
          code: normalized,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        await loadProgressSnapshot();
        return true;
      }
    } catch {}

    return false;
  }

  function runSequence(success: boolean, normalized: string) {
    clearTimers();
    setStatus("running");
    setProgress(null);

    setLines([
      "SCIB // CASE ACCESS TERMINAL",
      `NODE: WHX  |  CHANNEL: ${channelLabel || "AUTH"}`,
      "",
      `> TOKEN: ${normalized || "(empty)"}`,
    ]);

    const schedule = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    schedule(180, () => pushLine("VALIDATING TOKEN..."));
    schedule(360, () => pushLine("CHECKSUM: OK"));
    schedule(520, () => pushLine("HANDSHAKE: ESTABLISHED"));
    schedule(700, () => {
      setProgress(0);
      pushLine("");
      pushLine("TRANSFER:");
    });

    const stepsOk = [8, 17, 28, 41, 55, 68, 79, 88, 94, 100];
    const stepsFail = [6, 12, 19, 27, 33, 38];
    const steps = success ? stepsOk : stepsFail;
    const baseAt = 860;

    steps.forEach((pct, i) => {
      schedule(baseAt + i * 120, () => {
        setProgress(pct);
        pushLine(formatBar(pct));
      });
    });

    schedule(baseAt + steps.length * 120 + 140, async () => {
      if (!success) {
        pushLine("");
        pushLine("ACCESS DENIED");
        pushLine("REASON: INVALID TOKEN");
        setStatus("denied");
        schedule(160, () => {
          setProgress(null);
          try {
            inputRef.current?.focus();
          } catch {}
        });
        return;
      }

      pushLine("");
      pushLine("ACCESS GRANTED");
      pushLine(`EVIDENCE UNSEALED: ${unlockEvidenceId}`);

      const granted = await finalizeGrant(normalized);

      if (granted) {
        setStatus("granted");
        setCode("");
      } else {
        pushLine("");
        pushLine("SERVER REJECTED TOKEN");
        pushLine("STATUS: NO CHANGE COMMITTED");
        setStatus("denied");
      }

      schedule(160, () => {
        setProgress(null);
        try {
          inputRef.current?.focus();
        } catch {}
      });
    });
  }

  function submit() {
    if (status === "running" || ok) return;

    const normalized = normalizeCode(code);

    if (!normalized) {
      clearTimers();
      setStatus("idle");
      setProgress(null);
      setLines([
        "SCIB // CASE ACCESS TERMINAL",
        `NODE: WHX  |  CHANNEL: ${channelLabel || "AUTH"}`,
        "",
        "READY.",
        "",
        "> ERROR: NO TOKEN PROVIDED",
      ]);
      return;
    }

    const matches = acceptedTokens.map(normalizeCode).includes(normalized);
    runSequence(matches, normalized);
  }

  return (
    <>
      <style jsx global>{`
        .scib-term {
          position: relative;
          background: radial-gradient(1200px 700px at 50% 30%, rgba(0, 80, 20, 0.22), rgba(0, 0, 0, 0.92));
          border: 1px solid rgba(20, 60, 30, 0.55);
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.4) inset,
            0 24px 70px rgba(0, 0, 0, 0.55);
        }

        .scib-term::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.0),
            rgba(0, 0, 0, 0.0) 2px,
            rgba(0, 0, 0, 0.22) 3px
          );
          pointer-events: none;
          mix-blend-mode: multiply;
          opacity: 0.55;
        }

        .scib-term::after {
          content: "";
          position: absolute;
          inset: -20px;
          background: radial-gradient(900px 520px at 50% 45%, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.75));
          pointer-events: none;
        }

        .scib-term-text {
          color: #8aff8a;
          text-shadow: 0 0 10px rgba(70, 255, 120, 0.22);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        .scib-term-dim {
          color: rgba(138, 255, 138, 0.72);
        }

        .scib-term-strong {
          color: #39ff6b;
          text-shadow: 0 0 14px rgba(70, 255, 120, 0.28);
        }

        .scib-term-input {
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(70, 255, 120, 0.22);
          color: #b6ffb6;
          outline: none;
        }

        .scib-term-input:focus {
          border-color: rgba(70, 255, 120, 0.5);
          box-shadow: 0 0 0 3px rgba(70, 255, 120, 0.12);
        }

        .scib-term-btn {
          background: rgba(0, 0, 0, 0.72);
          border: 1px solid rgba(70, 255, 120, 0.22);
          color: #b6ffb6;
        }

        .scib-term-btn:hover {
          border-color: rgba(70, 255, 120, 0.55);
          background: rgba(0, 0, 0, 0.82);
        }

        .scib-term-btn:disabled {
          opacity: 0.6;
        }
      `}</style>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">ACCESS STATUS</div>
            <div className="text-lg font-semibold">{ok ? "UNLOCKED" : "LOCKED"}</div>
            <div className="text-sm text-slate-200 mt-1">{clueText}</div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/investigation-room"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-3 py-2 text-sm font-medium"
            >
              Investigation Room
            </Link>
          </div>
        </div>

        <div className="mt-2 scib-term">
          <div className="relative p-5 space-y-4">
            <div className="scib-term-text text-xs scib-term-dim">
              CASE ACCESS TERMINAL • {sourceEvidenceId} • MODE: AUTH
            </div>

            <div className="scib-term-text text-sm whitespace-pre-wrap leading-relaxed">
              {lines.map((l, idx) => {
                const isResult = l === "ACCESS GRANTED" || l === "ACCESS DENIED" || l === "SERVER REJECTED TOKEN";
                return (
                  <div key={idx} className={isResult ? "scib-term-strong" : ""}>
                    {l === "" ? "\u00A0" : l}
                  </div>
                );
              })}
            </div>

            {progress !== null ? (
              <div className="scib-term-text text-sm">
                <div className="scib-term-dim">PROGRESS:</div>
                <div className="scib-term-strong">{formatBar(progress)}</div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <div className="scib-term-text text-xs scib-term-dim mb-1">{"> ENTER ACCESS CODE:"}</div>
                <input
                  ref={inputRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                  placeholder="type code and press Enter"
                  disabled={status === "running" || ok}
                  className="w-full rounded-xl px-4 py-3 scib-term-input scib-term-text"
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="text"
                />
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={status === "running" || ok}
                className="rounded-xl px-4 py-3 scib-term-btn scib-term-text font-semibold"
              >
                {ok ? "ALREADY UNSEALED" : status === "running" ? "WORKING..." : "SUBMIT"}
              </button>
            </div>

            {hintText ? (
              <div className="scib-term-text text-xs scib-term-dim">
                Hint: {hintText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
