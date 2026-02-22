"use client";

import { useRouter } from "next/navigation";

type Provider = "linkedin" | "facebook" | "instagram";

function providerLabel(p: Provider) {
  return p === "linkedin" ? "LinkedIn" : p === "facebook" ? "Facebook" : "Instagram";
}

export default function LoginClient() {
  const router = useRouter();
  const providers: Provider[] = ["linkedin", "facebook", "instagram"];

  function go(provider: Provider) {
    router.push(`/register/${provider}`);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
      <div className="text-sm text-slate-300">
        Continue using a social connection (emulated for local testing).
      </div>

      <div className="space-y-3">
        {providers.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            className="w-full text-left rounded-2xl border border-slate-800 bg-slate-950/30 p-4 hover:bg-slate-950/45 transition"
          >
            <div className="font-semibold">{providerLabel(p)}</div>
            <div className="text-xs text-slate-500 mt-1">
              No local session found — register to create a detective persona
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
