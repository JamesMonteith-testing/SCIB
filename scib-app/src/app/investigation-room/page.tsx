import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

function cleanInstanceId(input: string) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe || "DEFAULT";
}

export default async function Page() {
  const jar = await cookies();

  const name = jar.get("scib_name_v1")?.value;
  const badge = jar.get("scib_badge_v1")?.value;
  const shared = jar.get("scib_case01_instance_v1")?.value;
  const provider = jar.get("scib_provider_v1")?.value;

  // Identity still required
  if (!name || !name.trim()) {
    redirect("/login");
  }

  // Phase 2: shared override > badge > default
  const instanceId = cleanInstanceId(shared || badge || "DEFAULT");

  return (
    <RoomClient
      initialUsername={name}
      initialBadge={badge ?? ""}
      initialProvider={provider ?? ""}
      initialInstanceId={instanceId}
    />
  );
}
