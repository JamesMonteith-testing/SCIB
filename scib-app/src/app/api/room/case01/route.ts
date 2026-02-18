import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";
import { roomBus } from "@/lib/roomBus";

type RoomPost = {
  id: string;
  ts: number;
  who: string;
  text: string;
};

type RoomState = {
  version: number;
  caseId: string;
  createdAt: number;
  posts: RoomPost[];
};

const DATA_PATH = path.join(process.cwd(), "data", "room", "case01.json");

async function readState(): Promise<RoomState> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as RoomState;
    if (!parsed.posts) parsed.posts = [];
    return parsed;
  } catch {
    const fresh: RoomState = {
      version: 1,
      caseId: "SCIB-CC-1991-022",
      createdAt: Date.now(),
      posts: [],
    };
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

async function writeState(state: RoomState) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(state, null, 2), "utf8");
}

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  const posts = [...state.posts].sort((a, b) => b.ts - a.ts);
  return NextResponse.json({ caseId: state.caseId, posts });
}

export async function POST(req: Request) {
  const jar = await cookies();
  const username = (jar.get("scib_username")?.value || "UNIDENTIFIED").trim().slice(0, 24);

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });
  if (text.length > 1200) return NextResponse.json({ error: "Text too long" }, { status: 400 });

  const state = await readState();

  const post: RoomPost = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    who: username,
    text,
  };

  state.posts.push(post);
  await writeState(state);

  // Realtime push
  roomBus.emit({ type: "post", payload: post });

  return NextResponse.json({ ok: true, post });
}
