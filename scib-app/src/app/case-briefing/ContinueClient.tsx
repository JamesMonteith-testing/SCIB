"use client";

import { useRouter } from "next/navigation";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export default function ContinueClient({
  hasSharedInstance,
}: {
  hasSharedInstance: boolean;
}) {
  const router = useRouter();

  function handleContinue() {
    setCookie("scib_briefing_complete_v1", "true");

    const dest = hasSharedInstance ? "/investigation-room" : "/welcome";

    // SPA navigation first
    router.push(dest);

    // Fallback for dev/hydration edge cases: force navigation if still on briefing shortly after.
    window.setTimeout(() => {
      try {
        if (window.location.pathname === "/case-briefing") {
          window.location.href = dest;
        }
      } catch {}
    }, 50);
  }

  return (
    <button
      onClick={handleContinue}
      className="rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
    >
      Continue to SCIB Database
    </button>
  );
}
