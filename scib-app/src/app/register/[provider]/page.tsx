"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Provider = "linkedin" | "facebook" | "instagram";

function isProvider(v: string): v is Provider {
  return v === "linkedin" || v === "facebook" || v === "instagram";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export default function RegisterProviderPage() {
  const router = useRouter();
  const params = useParams();
  const raw = String((params as any)?.provider || "");
  const provider = isProvider(raw) ? raw : null;

  const [name, setName] = useState("");

  if (!provider) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h1 className="text-xl font-semibold">Invalid provider</h1>
            <Link href="/register" className="text-blue-400">Back to Register</Link>
          </div>
        </div>
      </main>
    );
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const badge = "SCIB-" + Math.floor(1000 + Math.random() * 9000);

    setCookie("scib_name_v1", trimmed);
    setCookie("scib_badge_v1", badge);
    setCookie("scib_provider_v1", provider);

    router.push("/welcome");
    router.refresh();
  }

  const label =
    provider === "linkedin"
      ? "LinkedIn"
      : provider === "facebook"
      ? "Facebook"
      : "Instagram";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-xl">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/scib-badge.png"
              alt="SCIB Badge"
              width={48}
              height={48}
              priority
            />
            <div>
              <div className="text-sm text-slate-300">SCIB Secure Access</div>
              <h1 className="text-lg font-semibold">
                Register via {label}
              </h1>
            </div>
          </div>
          <Link href="/register" className="text-sm text-slate-300 hover:text-white">
            Back
          </Link>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              Detective Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your detective name"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-semibold"
          >
            Complete Registration
          </button>
        </div>
      </div>
    </main>
  );
}
