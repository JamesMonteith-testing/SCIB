import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";
import { getRoomBus } from "@/lib/roomBus";

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

function cleanInstanceIdOrNull(input: string | null | undefined) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe.length > 0 ? safe : null;
}

function resolveInstanceId(req: Request, jar: Awaited<ReturnType<typeof cookies>>) {
  const url = new URL(req.url);
  const queryInstance = url.searchParams.get("instance");
  const sharedInstance = jar.get("scib_case01_instance_v1")?.value;

  // IMPORTANT:
  // No badge fallback. No DEFAULT fallback.
  // If caller didn't join or mint an instance, they are not allowed into a shared room.
  const instanceId = cleanInstanceIdOrNull(queryInstance || sharedInstance);

  return {
    instanceId,
  };
}

function getDataPath(instanceId: string) {
  return path.join(process.cwd(), "data", "room", `case01.${instanceId}.json`);
}

async function readState(instanceId: string): Promise<RoomState> {
  const DATA_PATH = getDataPath(instanceId);

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

async function writeState(instanceId: string, state: RoomState) {
  const DATA_PATH = getDataPath(instanceId);
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(state, null, 2), "utf8");
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const jar = await cookies();
  const { instanceId } = resolveInstanceId(req, jar);

  if (!instanceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing room instance. Join or create an investigation room first.",
      },
      { status: 400 }
    );
  }

  const state = await readState(instanceId);
  const posts = [...state.posts].sort((a, b) => b.ts - a.ts);

  return NextResponse.json({
    ok: true,
    caseId: state.caseId,
    instanceId,
    posts,
  });
}

export async function POST(req: Request) {
  const jar = await cookies();

  const name = (jar.get("scib_name_v1")?.value || "").trim().slice(0, 24);
  const badge = (jar.get("scib_badge_v1")?.value || "").trim().slice(0, 24);

  // Identity still required for posting
  if (!name || !badge) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { instanceId } = resolveInstanceId(req, jar);

  if (!instanceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing room instance. Join or create an investigation room first.",
      },
      { status: 400 }
    );
  }

  const bus = getRoomBus(instanceId);

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ ok: false, error: "Missing text" }, { status: 400 });
  if (text.length > 1200) return NextResponse.json({ ok: false, error: "Text too long" }, { status: 400 });

  const state = await readState(instanceId);

  const post: RoomPost = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    who: name,
    text,
  };

  state.posts.push(post);
  await writeState(instanceId, state);

  bus.emit({ type: "post", payload: post });

  return NextResponse.json({ ok: true, instanceId, post });
}
