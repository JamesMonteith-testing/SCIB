"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const u = username.trim();
    if (!u) {
      setError("Enter a username.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error || "Unable to set identity.");
        setBusy(false);
        return;
      }

      // Keep a non-authoritative copy for UI display
      try {
        localStorage.setItem("scib_username_display_v1", data.username);
      } catch {}

      router.push("/investigation-room");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="flex items-center gap-4 py-4">
          <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={56} height={56} priority />
          <div>
            <div className="text-sm text-slate-300">SCIB Secure Access</div>
            <h1 className="text-xl font-semibold">Join Case Room</h1>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
          <p className="text-sm text-slate-200">
            Enter a tester username. This will be used to label your findings in the room.
            No password is required for this prototype.
          </p>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. JMont"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 outline-none focus:border-slate-600"
              maxLength={24}
              disabled={busy}
            />
            <p className="text-xs text-slate-500">
              Allowed: letters, numbers, underscore, hyphen. Max 24 characters.
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="pt-2 grid grid-cols-1 gap-3">
            <button
              onClick={submit}
              disabled={busy}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-medium text-center disabled:opacity-60 disabled:hover:bg-blue-600"
            >
              {busy ? "Joining…" : "Join Investigation Room"}
            </button>

            <Link
              href="/"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            SCIB Internal Network • Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </main>
  );
}
