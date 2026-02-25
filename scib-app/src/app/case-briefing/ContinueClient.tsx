"use client";

import { useRouter } from "next/navigation";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

function getCookie(name: string) {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function ContinueClient() {
  const router = useRouter();

  function handleContinue() {
    setCookie("scib_briefing_complete_v1", "true");

    const sharedInstance = getCookie("scib_case01_instance_v1");

    // If user arrived via shared investigation link,
    // go straight to investigation room
    if (sharedInstance && sharedInstance.trim().length > 0) {
      router.push("/investigation-room");
      router.refresh();
      return;
    }

    // Normal flow
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
