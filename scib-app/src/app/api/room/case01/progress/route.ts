import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";
import { getRoomBus } from "@/lib/roomBus";

type ProgressState = {
  version: number;
  caseId: string;
  createdAt: number;
  updatedAt: number;
  unlockedEvidence: string[];
  solved: boolean;
};

export const dynamic = "force-dynamic";

function cleanInstanceId(input: string) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe || "DEFAULT";
}

function normalizeCode(raw: string) {
  return (raw || "")
    .trim()
    .toUpperCase()
    // normalize common smart apostrophes to ASCII
    .replace(/[’‘]/g, "'")
    // keep only the characters we expect for these codes
    .replace(/[^A-Z0-9\/\-\+\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeEvidenceId(raw: string) {
  const v = String(raw || "").trim().toUpperCase();
  return /^E-\d{2}$/.test(v) ? v : null;
}

function baseUnlocked() {
  return ["E-01", "E-02"];
}

function applyUnlockCode(codeRaw: string): { ok: boolean; unlocked: string[]; message: string } {
  const code = normalizeCode(codeRaw);
  if (!code) return { ok: false, unlocked: [], message: "Enter a solution." };

  const unlocks: string[] = [];

  // Mirror current prototype mapping
  if (code === "MKELLS") unlocks.push("E-05", "E-06");
  if (code === "WHX/OPS 1991-022-03" || code === "WHX/OPS+1991-022-03") unlocks.push("E-03");
  if (code === "DON'T TRUST THE SWITCHBOARD" || code === "DONT TRUST THE SWITCHBOARD") unlocks.push("E-04");

  if (unlocks.length === 0) return { ok: false, unlocked: [], message: "That is not correct." };
  return { ok: true, unlocked: unlocks, message: `Unlocked: ${unlocks.join(", ")}` };
}

function getDataPath(instanceId: string) {
  return path.join(process.cwd(), "data", "room", `case01.progress.${instanceId}.json`);
}

function coerceState(parsed: any): ProgressState {
  const now = Date.now();
  const unlocked = Array.isArray(parsed?.unlockedEvidence) ? parsed.unlockedEvidence : [];
  const unlockedNorm = unlocked
    .map(normalizeEvidenceId)
    .filter((x: string | null): x is string => !!x);

  const merged = Array.from(new Set([...baseUnlocked(), ...unlockedNorm]));

  return {
    version: typeof parsed?.version === "number" ? parsed.version : 1,
    caseId: typeof parsed?.caseId === "string" ? parsed.caseId : "SCIB-CC-1991-022",
    createdAt: typeof parsed?.createdAt === "number" ? parsed.createdAt : now,
    updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : now,
    unlockedEvidence: merged,
    solved: !!parsed?.solved,
  };
}

async function readState(instanceId: string): Promise<ProgressState> {
  const DATA_PATH = getDataPath(instanceId);

  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return coerceState(parsed);
  } catch {
    const fresh: ProgressState = {
      version: 1,
      caseId: "SCIB-CC-1991-022",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unlockedEvidence: baseUnlocked(),
      solved: false,
    };

    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

async function writeState(instanceId: string, state: ProgressState) {
  const DATA_PATH = getDataPath(instanceId);
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(state, null, 2), "utf8");
}

function emitProgress(instanceId: string, payload: any) {
  // Existing stream forwards evt.payload as SSE data (not the whole evt)
  const bus = getRoomBus(instanceId);
  bus.emit({
    type: "progress",
    payload,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const queryInstance = url.searchParams.get("instance");

  const jar = await cookies();
  const sharedInstance = jar.get("scib_case01_instance_v1")?.value;
  const badgeInstance = jar.get("scib_badge_v1")?.value;

  const instanceId = cleanInstanceId(queryInstance || sharedInstance || badgeInstance || "DEFAULT");
  const state = await readState(instanceId);

  return NextResponse.json({
    ok: true,
    instanceId,
    state,
  });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const queryInstance = url.searchParams.get("instance");

  const jar = await cookies();
  const name = (jar.get("scib_name_v1")?.value || "").trim().slice(0, 24);
  const sharedInstance = jar.get("scib_case01_instance_v1")?.value;
  const badgeInstance = jar.get("scib_badge_v1")?.value;

  // Require identity to mutate shared progress
  if (!name || !badgeInstance) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const instanceId = cleanInstanceId(queryInstance || sharedInstance || badgeInstance || "DEFAULT");

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Optional migration hook: allow client to send its localStorage unlock list (no code required)
  const clientUnlockedRaw = Array.isArray(body?.clientUnlocked) ? body.clientUnlocked : [];
  const clientUnlocked = clientUnlockedRaw
    .map(normalizeEvidenceId)
    .filter((x: string | null): x is string => !!x);

  const codeRaw = String(body?.code || "").trim();
  const hasCode = codeRaw.length > 0;

  if (!hasCode && clientUnlocked.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Enter a solution.", unlocked: [] as string[] },
      { status: 200 }
    );
  }

  const prior = await readState(instanceId);

  let unlockedFromCode: string[] = [];
  let message = "Synced progress.";

  if (hasCode) {
    const result = applyUnlockCode(codeRaw);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message, unlocked: [] as string[] },
        { status: 200 }
      );
    }
    unlockedFromCode = result.unlocked;
    message = result.message;
  }

  const nextUnlocked = Array.from(
    new Set([...baseUnlocked(), ...prior.unlockedEvidence, ...clientUnlocked, ...unlockedFromCode])
  );

  const unlockedAdded = nextUnlocked.filter((id) => !prior.unlockedEvidence.includes(id));

  const next: ProgressState = {
    ...prior,
    updatedAt: Date.now(),
    unlockedEvidence: nextUnlocked,
  };

  await writeState(instanceId, next);

  // Emit authoritative snapshot for realtime clients
  emitProgress(instanceId, {
    kind: hasCode ? "evidence_unlock" : "migration_merge",
    ts: Date.now(),
    who: name,
    instanceId,
    unlocked: unlockedFromCode,
    unlockedAdded,
    unlockedEvidence: next.unlockedEvidence,
  });

  return NextResponse.json({
    ok: true,
    instanceId,
    message,
    unlocked: unlockedFromCode,
    unlockedAdded,
    state: next,
  });
}
