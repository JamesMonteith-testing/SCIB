import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const jar = await cookies();

  // Prefer new v1 identity cookie; fall back to legacy join identity
  const username =
    jar.get("scib_name_v1")?.value ?? jar.get("scib_username")?.value;

  // Humans only: require identity cookie before access
  if (!username || !username.trim()) {
    redirect("/join");
  }

  // IMPORTANT: httpOnly cookies can't be read client-side, so pass it as a prop
  return <RoomClient initialUsername={username} />;
}