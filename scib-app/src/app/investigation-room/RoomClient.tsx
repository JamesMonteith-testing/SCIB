"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type RoomPost = {
  id: string;
  ts: number;
  who: string;
  text: string;
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatusPill({ state }: { state: "available" | "locked" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
        state === "available"
          ? "border-emerald-900/60 bg-emerald-950/25 text-emerald-200"
          : "border-slate-700 bg-slate-950/30 text-slate-300",
      ].join(" ")}
    >
      {state === "available" ? "AVAILABLE" : "LOCKED"}
    </span>
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

// Codes -> bundles (local prototype).
// - MKELLS (from E-01) unlocks E-05 + E-06
// - WHX/OPS 1991-022-03 unlocks E-03
// - DON'T TRUST THE SWITCHBOARD unlocks E-04
function applyEvidenceUnlock(codeRaw: string): { ok: boolean; unlocked: string[]; message: string } {
  const code = normalizeCode(codeRaw);

  if (!code) return { ok: false, unlocked: [], message: "Enter a solution." };

  const unlocks: string[] = [];

  if (code === "MKELLS") {
    unlocks.push("E-05", "E-06");
  }

  if (code === "WHX/OPS 1991-022-03" || code === "WHX/OPS+1991-022-03") {
    unlocks.push("E-03");
  }

  if (code === "DON'T TRUST THE SWITCHBOARD" || code === "DONT TRUST THE SWITCHBOARD") {
    unlocks.push("E-04");
  }

  if (unlocks.length === 0) {
    return { ok: false, unlocked: [], message: "That is not correct." };
  }

  const current = readUnlocked();
  const next = Array.from(new Set([...current, ...unlocks]));
  writeUnlocked(next);

  return { ok: true, unlocked: unlocks, message: `Unlocked: ${unlocks.join(", ")}` };
}

function ClueBlock({ id }: { id: string }) {
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

  return <div className="pt-2 text-xs text-slate-500">{clue}</div>;
}

export default function RoomClient({ initialUsername }: { initialUsername: string }) {
  const [username, setUsername] = useState<string>(() => {
    const u = (initialUsername || "").trim();
    return u ? u : "UNIDENTIFIED";
  });

  const [posts, setPosts] = useState<RoomPost[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [unlockCode, setUnlockCode] = useState("");
  const [unlockMsg, setUnlockMsg] = useState<string | null>(null);
  const [unlockedEvidence, setUnlockedEvidence] = useState<string[]>(["E-01", "E-02"]);

  const streamRef = useRef<EventSource | null>(null);

  const caseMeta = useMemo(
    () => ({
      title: "Case 01 — The Silent Switchboard",
      caseId: "SCIB-CC-1991-022",
      roomApi: "/api/room/case01",
      roomStream: "/api/room/case01/stream",
    }),
    []
  );

  const evidenceCatalog = useMemo(
    () => [
      { id: "E-01", label: "Lanyard + Access Card", href: "/cases/silent-switchboard/case-file/evidence/e-01" },
      { id: "E-02", label: "Coffee Cup", href: "/cases/silent-switchboard/case-file/evidence/e-02" },
      { id: "E-03", label: "Dot-matrix Access Log (partial)", href: "/cases/silent-switchboard/case-file/evidence/e-03" },
      { id: "E-04", label: "Engineer Notebook Page", href: "/cases/silent-switchboard/case-file/evidence/e-04" },
      { id: "E-05", label: "Master Key Inventory Sheet", href: "/cases/silent-switchboard/case-file/evidence/e-05" },
      { id: "E-06", label: "Maintenance Console Printout", href: "/cases/silent-switchboard/case-file/evidence/e-06" },
    ],
    []
  );

  const evidenceItems = useMemo(() => {
    const unlockedSet = new Set(unlockedEvidence.map((s) => s.toUpperCase()));
    return evidenceCatalog.map((e) => ({
      ...e,
      state: unlockedSet.has(e.id) ? ("available" as const) : ("locked" as const),
    }));
  }, [evidenceCatalog, unlockedEvidence]);

  const recoveredItems = useMemo(
    () => [
      { id: "REC-01", label: "Access Logs Extended", href: "/cases/silent-switchboard/recovered", state: "locked" as const },
      { id: "REC-02", label: "Internal Messages Pager", href: "/cases/silent-switchboard/recovered", state: "locked" as const },
      { id: "REC-03", label: "Contractor Records", href: "/cases/silent-switchboard/recovered", state: "locked" as const },
      { id: "REC-04", label: "SCIB Internal Memo", href: "/cases/silent-switchboard/recovered", state: "locked" as const },
    ],
    []
  );

  async function loadInitial() {
    setErr(null);
    try {
      const res = await fetch(caseMeta.roomApi, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.posts) {
        setErr("Unable to load room.");
        return;
      }
      setPosts(data.posts);
    } catch {
      setErr("Network error.");
    }
  }

  function refreshUnlocks() {
    setUnlockedEvidence(readUnlocked());
  }

  useEffect(() => {
    // Mirror the authoritative server identity into localStorage so any legacy UI reads remain consistent
    try {
      const u = (initialUsername || "").trim();
      if (u) {
        localStorage.setItem("scib_username_display_v1", u);
        setUsername(u);
      } else {
        const v = localStorage.getItem("scib_username_display_v1");
        if (v) setUsername(v);
      }
    } catch {}

    refreshUnlocks();
    loadInitial();

    try {
      const es = new EventSource(caseMeta.roomStream);
      streamRef.current = es;

      es.addEventListener("post", (evt) => {
        try {
          const post = JSON.parse((evt as MessageEvent).data) as RoomPost;
          setPosts((prev) => {
            if (prev.some((p) => p.id === post.id)) return prev;
            return [post, ...prev];
          });
        } catch {}
      });

      es.addEventListener("error", () => {
        setErr("Realtime connection lost. Refresh page to reconnect.");
      });
    } catch {
      setErr("Unable to start realtime stream.");
    }

    function onStorage(e: StorageEvent) {
      if (e.key === UNLOCK_STORE_KEY) refreshUnlocks();
      if (e.key === "scib_username_display_v1" && e.newValue) setUsername(e.newValue);
    }
    window.addEventListener("storage", onStorage);

    return () => {
      try {
        streamRef.current?.close();
      } catch {}
      streamRef.current = null;
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function post() {
    const t = text.trim();
    if (!t) return;

    setBusy(true);
    setErr(null);

    try {
      const res = await fetch(caseMeta.roomApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setErr(data?.error || "Unable to post.");
        setBusy(false);
        return;
      }

      setText("");
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  function submitUnlock() {
    const result = applyEvidenceUnlock(unlockCode);
    setUnlockMsg(result.message);
    if (result.ok) {
      refreshUnlocks();
      setUnlockCode("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB INVESTIGATION ROOM</div>
              <h1 className="text-xl font-semibold">Investigation Room</h1>
              <p className="text-sm text-slate-300">Realtime findings thread • Case 01</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cases/silent-switchboard" className="text-sm text-slate-300 hover:text-white">
              Case
            </Link>
            <Link href="/cases/silent-switchboard/case-file/evidence-list" className="text-sm text-slate-300 hover:text-white">
              Evidence List
            </Link>
            <Link href="/" className="text-sm text-slate-300 hover:text-white">
              Home
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel title="Detective Identity">
            <div className="flex items-center gap-4">
              <Image src="/brand/scib-badge.png" alt="Badge" width={56} height={56} />
              <div>
                <div className="font-semibold">{username}</div>
                <div className="text-sm text-slate-300">Tester identity (cookie-based)</div>
                <div className="text-xs text-slate-400">Stored on this device</div>
              </div>
            </div>
            <div className="pt-3 text-xs text-slate-500">
              To change identity, return to{" "}
              <Link className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300" href="/join">
                Join Case Room
              </Link>
              .
            </div>
          </Panel>

          <Panel title="Active Case">
            <div className="space-y-2">
              <div className="font-semibold">{caseMeta.title}</div>
              <div className="flex flex-wrap gap-2">
                <Tag>{caseMeta.caseId}</Tag>
                <Tag>Room: case01</Tag>
              </div>

              <div className="pt-3 grid grid-cols-1 gap-2">
                <Link
                  href="/cases/silent-switchboard/case-file/evidence-list"
                  className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-sm font-medium text-center"
                >
                  Evidence List
                </Link>
                <Link
                  href="/cases/silent-switchboard/recovered"
                  className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-sm font-medium text-center"
                >
                  Recovery Terminal
                </Link>
              </div>
            </div>
          </Panel>

          <Panel title="Room Status">
            <div className="space-y-2 text-sm text-slate-200">
              <div>
                Posts loaded: <span className="font-mono">{posts.length}</span>
              </div>
              <div className="text-xs text-slate-500">Realtime stream active. Messages appear instantly.</div>
              {err ? (
                <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{err}</div>
              ) : null}
            </div>
          </Panel>
        </div>

        <Panel title="Case Access Console — Evidence Unlock">
          <div className="text-sm text-slate-200">
            If an item is sealed, solve the clue and submit the solution here. Successful solutions unlock the next material on this device.
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
              Tip: post findings with links after unlocking (copy the Evidence URL from the list below).
            </div>
          </div>

          {unlockMsg ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">{unlockMsg}</div>
          ) : null}
        </Panel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Case Access — Evidence">
            <div className="space-y-2">
              {evidenceItems.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {e.state === "available" ? (
                        <Link className="underline underline-offset-4 decoration-slate-700 hover:decoration-slate-300" href={e.href}>
                          {e.id}
                        </Link>
                      ) : (
                        <span className="font-mono text-slate-300">{e.id}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {e.state === "available" ? e.label : "SEALED REGISTER ENTRY"}
                    </div>
                    {e.state === "locked" ? <ClueBlock id={e.id} /> : null}
                  </div>
                  <StatusPill state={e.state} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Case Access — Recovered Materials">
            <div className="space-y-2">
              {recoveredItems.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      <Link className="underline underline-offset-4 decoration-slate-700 hover:decoration-slate-300" href={r.href}>
                        {r.id}
                      </Link>
                    </div>
                    <div className="text-xs text-slate-400 truncate">{r.label}</div>
                  </div>
                  <StatusPill state={r.state} />
                </div>
              ))}
              <div className="pt-2 text-xs text-slate-500">
                Recovered materials unlock later via retrieval keys embedded in the official case file.
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Post a Finding">
            <div className="rounded-xl border border-slate-800 bg-black px-4 py-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Post your finding for the team… (include evidence links)"
                className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 min-h-[140px] resize-none"
                disabled={busy}
              />
              <div className="pt-3 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">Max 1200 chars.</div>
                <button
                  onClick={post}
                  disabled={busy}
                  className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  {busy ? "Posting…" : "Post Finding"}
                </button>
              </div>
            </div>
          </Panel>

          <Panel title="Findings Thread">
            <div className="space-y-2">
              {posts.length === 0 ? (
                <div className="text-sm text-slate-400">No posts yet. Add the first finding to initialize the room.</div>
              ) : null}

              {posts.slice(0, 50).map((p) => {
                const mine = p.who === username;

                return (
                  <div key={p.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl border px-4 py-3",
                        mine ? "border-blue-900/60 bg-blue-950/25" : "border-slate-800 bg-slate-950/40",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-medium">{p.who}</div>
                        <div className="text-xs text-slate-500">{new Date(p.ts).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-slate-200 mt-2 whitespace-pre-wrap">{p.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}