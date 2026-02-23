"use client";

import { useRouter } from "next/navigation";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export default function ContinueClient() {
  const router = useRouter();

  function handleContinue() {
    setCookie("scib_briefing_complete_v1", "true");
    router.push("/welcome");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleContinue}
      className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-medium text-center"
    >
      Continue to SCIB Database
    </button>
  );
}
