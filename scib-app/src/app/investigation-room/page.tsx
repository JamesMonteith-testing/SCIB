import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const jar = await cookies();
  const username = jar.get("scib_username")?.value;

  // Humans only: require identity cookie before access
  if (!username || !username.trim()) {
    redirect("/join");
  }

  return <RoomClient />;
}
