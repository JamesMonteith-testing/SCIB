import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const jar = await cookies();

  const name = jar.get("scib_name_v1")?.value;
  const badge = jar.get("scib_badge_v1")?.value;
  const provider = jar.get("scib_provider_v1")?.value;

  // Require v1 cookie identity for room access (single identity system)
  if (!name || !name.trim()) {
    redirect("/login");
  }

  // Pass identity details to client explicitly
  return (
    <RoomClient
      initialUsername={name}
      initialBadge={badge ?? ""}
      initialProvider={provider ?? ""}
    />
  );
}

