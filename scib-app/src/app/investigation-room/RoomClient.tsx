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

type ProgressState = {
  unlockedEvidence?: string[];
  activity?: { type: string; who?: string; evidenceId?: string; ts?: number }[];
};

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    (v || "").trim()
  );
}

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

type Provider = "linkedin" | "facebook" | "instagram";

function isProvider(v: string | undefined): v is Provider {
  return v === "linkedin" || v === "facebook" || v === "instagram";
}

function providerLabel(p: Provider) {
  return p === "linkedin" ? "LinkedIn" : p === "facebook" ? "Facebook" : "Instagram";
}

function normalizeEvidenceId(v: string) {
  return (v || "").trim().toUpperCase();
}

function evidenceHref(id: string): string | null {
  const key = normalizeEvidenceId(id);
  const map: Record<string, string> = {
    "E-01": "/cases/silent-switchboard/case-file/evidence/e-01",
    "E-02": "/cases/silent-switchboard/case-file/evidence/e-02",
    "E-03": "/cases/silent-switchboard/case-file/evidence/e-03",
    "E-04": "/cases/silent-switchboard/case-file/evidence/e-04",
    "E-05": "/cases/silent-switchboard/case-file/evidence/e-05",
    "E-06": "/cases/silent-switchboard/case-file/evidence/e-06",
  };
  return map[key] || null;
}

function evidenceLabel(id: string): string {
  const key = normalizeEvidenceId(id);
  const map: Record<string, string> = {
    "E-01": "Lanyard + Access Card",
    "E-02": "Coffee Cup",
    "E-03": "Dot-matrix Access Log (partial)",
    "E-04": "Engineer Notebook Page",
    "E-05": "Master Key Inventory Sheet",
    "E-06": "Maintenance Console Printout",
  };
  return map[key] || "Evidence";
}

function makeSystemUnlockPost(who: string, evidenceId: string): RoomPost {
  const id = `sys_unlock_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const href = evidenceHref(evidenceId);
  const label = evidenceLabel(evidenceId);
  const text = href
    ? `${who} unlocked ${normalizeEvidenceId(evidenceId)} — ${label} | ${href}`
    : `${who} unlocked ${normalizeEvidenceId(evidenceId)} — ${label}`;
  return { id, ts: Date.now(), who: "System", text };
}

function renderPostTextWithEvidenceLink(text: string) {
  const raw = String(text || "");
  // We only linkify internal evidence URLs we generate ("/cases/.../e-0x")
  const re = /(\/cases\/silent-switchboard\/case-file\/evidence\/e-\d{2})/gi;
  const parts = raw.split(re);

  return parts.map((part, idx) => {
    if (re.test(part)) {
      const href = part;
      return (
        <Link
          key={`lnk_${idx}`}
          href={href}
          className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-200"
        >
          {href}
        </Link>
      );
    }
    return <span key={`txt_${idx}`}>{part}</span>;
  });
}

export default function RoomClient({
  initialUsername,
  initialBadge,
  initialProvider,
  initialInstanceId,
}: {
  initialUsername: string;
  initialBadge: string;
  initialProvider: string;
  initialInstanceId: string;
}) {
  const [username] = useState<string>(initialUsername);
  const [badge] = useState<string>(initialBadge || "");
  const [provider] = useState<string>(initialProvider || "");
  const [instanceId] = useState<string>((initialInstanceId || "").trim());

  // Client safety: if we ever render with a bad instance id, force registration
  useEffect(() => {
    if (!isUuid(instanceId)) {
      window.location.assign("/login");
    }
  }, [instanceId]);

  const providerText = useMemo(() => {
    const p = (provider || "").toLowerCase().trim();
    return isProvider(p) ? providerLabel(p) : "";
  }, [provider]);

  const [posts, setPosts] = useState<RoomPost[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // SERVER-AUTHORITATIVE progress snapshot
  const [progress, setProgress] = useState<ProgressState>({ unlockedEvidence: ["E-01", "E-02"], activity: [] });

  const streamRef = useRef<EventSource | null>(null);
  const shareInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      setOrigin(window.location.origin);
    } catch {
      setOrigin("");
    }
  }, []);

  const caseMeta = useMemo(() => {
    // Keep query param for backward compatibility with existing API implementation,
    // but server should still validate the instance cookie.
    const qs = `?instance=${encodeURIComponent(instanceId)}`;
    return {
      title: "Case 01 - The Silent Switchboard",
      caseId: "SCIB-CC-1991-022",
      roomApi: `/api/room/case01${qs}`,
      roomStream: `/api/room/case01/stream${qs}`,
      progressApi: `/api/room/case01/progress${qs}`,
    };
  }, [instanceId]);

  const joinPath = useMemo(() => {
    return `/cases/silent-switchboard/join?code=${encodeURIComponent(instanceId)}`;
  }, [instanceId]);

  const shareUrl = useMemo(() => {
    return origin ? `${origin}${joinPath}` : joinPath;
  }, [origin, joinPath]);

  async function copyShareUrl() {
    const textToCopy = (shareInputRef.current?.value || shareUrl || "").trim();
    if (!textToCopy) {
      setCopied(false);
      return;
    }

    let ok = false;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(textToCopy);
        ok = true;
      }
    } catch {}

    if (!ok) {
      try {
        const el = shareInputRef.current;
        if (el) {
          el.focus();
          el.select();
          ok = document.execCommand("copy");
        }
      } catch {}
    }

    if (!ok) {
      try {
        const el = shareInputRef.current;
        if (el) {
          el.focus();
          el.select();
        }
      } catch {}
      setCopied(false);
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

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

  const unlockedEvidence = useMemo(() => {
    const base = new Set<string>(["E-01", "E-02"]);
    const list = Array.isArray(progress.unlockedEvidence) ? progress.unlockedEvidence : [];
    for (const e of list) base.add(normalizeEvidenceId(e));
    return Array.from(base);
  }, [progress.unlockedEvidence]);

  const evidenceItems = useMemo(() => {
    const unlockedSet = new Set(unlockedEvidence.map((s) => s.toUpperCase()));
    return evidenceCatalog.map((e) => ({
      ...e,
      state: unlockedSet.has(e.id) ? ("available" as const) : ("locked" as const),
    }));
  }, [evidenceCatalog, unlockedEvidence]);

  const recoveredItems = useMemo(() => {
  const unlockedSet = new Set(unlockedEvidence.map((s) => s.toUpperCase()));

  const recoveredUnlocks = {
    "REC-01": unlockedSet.has("E-03"),
    "REC-02": unlockedSet.has("E-06"),
    "REC-03": unlockedSet.has("E-05"),
    "REC-04": unlockedSet.has("E-04"),
  } as const;

  return [
    {
      id: "REC-01",
      label: "Access Logs Extended",
      href: "/cases/silent-switchboard/recovered/rec-01",
      state: recoveredUnlocks["REC-01"] ? ("available" as const) : ("locked" as const),
    },
    {
      id: "REC-02",
      label: "Internal Messages Pager",
      href: "/cases/silent-switchboard/recovered/rec-02",
      state: recoveredUnlocks["REC-02"] ? ("available" as const) : ("locked" as const),
    },
    {
      id: "REC-03",
      label: "Contractor Records",
      href: "/cases/silent-switchboard/recovered/rec-03",
      state: recoveredUnlocks["REC-03"] ? ("available" as const) : ("locked" as const),
    },
    {
      id: "REC-04",
      label: "SCIB Internal Memo",
      href: "/cases/silent-switchboard/recovered/rec-04",
      state: recoveredUnlocks["REC-04"] ? ("available" as const) : ("locked" as const),
    },
  ];
}, [unlockedEvidence]);

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

  async function loadProgress() {
    try {
      const res = await fetch(caseMeta.progressApi, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.state) return;
      setProgress(data.state as ProgressState);
    } catch {}
  }

  // Insert a system message once per evidenceId (dedupe)
  function announceUnlock(who: string, evidenceId: string) {
    const eid = normalizeEvidenceId(evidenceId);
    setPosts((prev) => {
      if (prev.some((p) => p.who === "System" && String(p.text || "").includes(`unlocked ${eid}`))) return prev;
      return [makeSystemUnlockPost(who, eid), ...prev];
    });
  }

  useEffect(() => {
    // Initial hydration: posts + progress
    loadInitial();
    loadProgress();

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

      // CRITICAL: progress/unlock propagation for shared-state
      es.addEventListener("progress", (evt) => {
        try {
          const payload = JSON.parse((evt as MessageEvent).data);

          // Common shape: { state: { unlockedEvidence, activity } }
          const nextState = payload?.state;
          if (nextState && typeof nextState === "object") {
            setProgress(nextState as ProgressState);

            // If we have an unlock activity, announce it
            const activity = Array.isArray(nextState.activity) ? nextState.activity : [];
            const last = activity.length > 0 ? activity[activity.length - 1] : null;
            if (last && last.type === "unlock_evidence" && typeof last.evidenceId === "string") {
              const who = typeof last.who === "string" && last.who.trim() ? last.who.trim() : "A teammate";
              announceUnlock(who, last.evidenceId);
            }
            return;
          }

          // Fallback: if server emits { unlockedEvidence, by, evidenceId }
          const evidenceId =
            (typeof payload?.evidenceId === "string" && payload.evidenceId) ||
            (typeof payload?.evidence_id === "string" && payload.evidence_id) ||
            (typeof payload?.evidence === "string" && payload.evidence) ||
            null;

          const who =
            (typeof payload?.who === "string" && payload.who) ||
            (typeof payload?.by === "string" && payload.by) ||
            null;

          if (evidenceId) {
            announceUnlock(who && who.trim() ? who.trim() : "A teammate", evidenceId);
            // Ensure we refresh authoritative state
            loadProgress();
          }
        } catch {
          // If parsing fails, still try to refresh
          loadProgress();
        }
      });

      es.addEventListener("error", () => {
        setErr("Realtime connection lost. Refresh page to reconnect.");
      });
    } catch {
      setErr("Unable to start realtime stream.");
    }

    return () => {
      try {
        streamRef.current?.close();
      } catch {}
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseMeta.roomStream, caseMeta.roomApi, caseMeta.progressApi]);

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB INVESTIGATION ROOM</div>
              <h1 className="text-xl font-semibold">Investigation Room</h1>
              <p className="text-sm text-slate-300">Realtime findings thread - Case 01</p>
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
              <div className="min-w-0">
                <div className="font-semibold truncate">{username}</div>
                <div className="text-sm text-slate-300">
                  Badge: <span className="font-mono text-slate-200">{badge || "—"}</span>
                </div>
                <div className="text-xs text-slate-400">{providerText ? `Provider: ${providerText}` : "Provider: —"}</div>
              </div>
            </div>

            <div className="pt-3 text-xs text-slate-500">
              Need to switch identity?{" "}
              <Link className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300" href="/logout">
                Sign out
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
                </Link></div>
            </div>
          </Panel>

          <Panel title="Room Status">
            <div className="space-y-2 text-sm text-slate-200">
              <div>
                Posts loaded: <span className="font-mono">{posts.length}</span>
              </div>
              <div className="text-xs text-slate-500">Realtime stream active. Unlocks + messages should appear instantly.</div>

              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="mt-3 w-full rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-sm font-medium"
              >
                Share Investigation
              </button>

              {err ? (
                <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{err}</div>
              ) : null}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Case Access - Evidence">
            <div className="space-y-2">
              {evidenceItems.map((e) => {
                const card = (
                  <div
                    className={[
                      "flex items-start justify-between gap-3 rounded-xl border px-4 py-3 transition",
                      e.state === "available"
                        ? "border-slate-700 bg-slate-950/40 hover:bg-slate-900 cursor-pointer"
                        : "border-slate-800 bg-slate-950/30",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        <span
                          className={
                            e.state === "available"
                              ? "underline underline-offset-4 decoration-slate-700 hover:decoration-slate-300"
                              : "font-mono text-slate-300"
                          }
                        >
                          {e.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {e.state === "available" ? e.label : "SEALED REGISTER ENTRY"}
                      </div>
                    </div>

                    <StatusPill state={e.state} />
                  </div>
                );

                return (
  <Link key={e.id} href={e.href} className="block">
    {card}
  </Link>
);
              })}
            </div>

            <div className="pt-3 text-xs text-slate-500">
              Unlock sealed evidence from within the evidence pages using the Case Access Terminal. Unlocks are shared across your room instance.
            </div>
          </Panel></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Post a Finding">
            <div className="rounded-xl border border-slate-800 bg-black px-4 py-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Post your finding for the team... (include evidence links)"
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
                  {busy ? "Posting..." : "Post Finding"}
                </button>
              </div>
            </div>
          </Panel>

          <Panel title="Findings Thread">
            <div className="space-y-2">
              {posts.length === 0 ? <div className="text-sm text-slate-400">No posts yet. Add the first finding to initialize the room.</div> : null}

              {posts.slice(0, 50).map((p) => {
                const mine = p.who === username;
                const system = p.who === "System";

                return (
                  <div key={p.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "max-w-[85%] rounded-2xl border px-4 py-3",
                        system
                          ? "border-emerald-900/60 bg-emerald-950/15"
                          : mine
                          ? "border-blue-900/60 bg-blue-950/25"
                          : "border-slate-800 bg-slate-950/40",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-medium">{system ? "SCIB SYSTEM" : p.who}</div>
                        <div className="text-xs text-slate-500">{new Date(p.ts).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-slate-200 mt-2 whitespace-pre-wrap">
                        {renderPostTextWithEvidenceLink(p.text)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {shareOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <button
              type="button"
              aria-label="Close share dialog"
              className="absolute inset-0 bg-black/70"
              onClick={() => setShareOpen(false)}
            />

            <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">SHARE INVESTIGATION</div>
                  <div className="text-lg font-semibold">Invite up to 3 friends</div>
                </div>

                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-3 py-2 text-sm font-medium"
                >
                  Close
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-400">
                Current instance: <span className="font-mono text-slate-200">{instanceId}</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-400">Share link</div>

                <div className="flex items-center gap-2">
                  <input
                    ref={shareInputRef}
                    readOnly
                    value={shareUrl}
                    className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200 outline-none"
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <button
                    type="button"
                    onClick={copyShareUrl}
                    className="shrink-0 rounded-xl border border-slate-700 hover:bg-slate-900 transition px-3 py-2 text-sm font-medium"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="text-xs text-slate-500">Send this link to friends. It sets the shared instance and redirects into the room.</div>

                <div className="text-xs">
                  <Link prefetch={false} href={joinPath} className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300 text-slate-300">
                    Open join link
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}



