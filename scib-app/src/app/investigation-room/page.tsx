import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test((v || "").trim());
}

export default async function Page() {
  const jar = await cookies();

  const name = jar.get("scib_name_v1")?.value;
  const badge = jar.get("scib_badge_v1")?.value;
  const provider = jar.get("scib_provider_v1")?.value;

  // Identity still required
  if (!name || !name.trim()) {
    redirect("/login");
  }

  // HARD RULE: Instance must be UUID-only. No badge/default fallback.
  const instance = jar.get("scib_case01_instance_v1")?.value || "";
  if (!isUuid(instance)) {
    redirect("/login");
  }

  return (
    <RoomClient
      initialUsername={name}
      initialBadge={badge ?? ""}
      initialProvider={provider ?? ""}
      initialInstanceId={instance}
    />
  );
}