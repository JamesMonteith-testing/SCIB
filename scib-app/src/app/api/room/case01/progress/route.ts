import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { promises as fs } from "fs";
import { getRoomBus } from "@/lib/roomBus";

export const dynamic = "force-dynamic";

type ProgressState = {
  version: number;
  caseId: string;
  instanceId: string;
  updatedAt: number;
  unlockedEvidence: string[];
  solved: boolean;
  activity: Array<{
    id: string;
    ts: number;
    type: "unlock_evidence" | "solve_case" | "note";
    who?: string;
    evidenceId?: string;
  }>;
};

function cleanInstanceIdOrNull(input: string | null | undefined) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe.length > 0 ? safe : null;
}

function normalizeEvidenceId(v: any) {
  const raw = String(v || "").trim().toUpperCase();
  const safe = raw.replace(/[^A-Z0-9\-]/g, "").slice(0, 12);
  return safe.length > 0 ? safe : null;
}

function normalizeCode(raw: any) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[â€™]/g, "'")
    .replace(/[^A-Z0-9\/\-\+\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isNonEmpty(v: string | null | undefined) {
  return !!(v && v.trim().length > 0);
}

function getProgressPath(instanceId: string) {
  return path.join(process.cwd(), "data", "room", `case01.progress.${instanceId}.json`);
}

async function readProgress(instanceId: string): Promise<ProgressState> {
  const p = getProgressPath(instanceId);

  try {
    const raw = await fs.readFile(p, "utf8");
    const parsed = JSON.parse(raw) as ProgressState;

    return {
      version: typeof parsed.version === "number" ? parsed.version : 1,
      caseId: parsed.caseId || "SCIB-CC-1991-022",
      instanceId,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      unlockedEvidence: Array.isArray(parsed.unlockedEvidence)
        ? parsed.unlockedEvidence.map((x) => String(x).toUpperCase())
        : [],
      solved: !!parsed.solved,
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch {
    const fresh: ProgressState = {
      version: 1,
      caseId: "SCIB-CC-1991-022",
      instanceId,
      updatedAt: Date.now(),
      unlockedEvidence: ["E-01", "E-02"],
      solved: false,
      activity: [],
    };
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

async function writeProgress(instanceId: string, state: ProgressState) {
  const p = getProgressPath(instanceId);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(state, null, 2), "utf8");
}

function applyUnlockMapping(evidenceId: string, codeNormalized: string): boolean {
  // IMPORTANT: Keep mapping server-side only (do not leak answers in UI hints)

  if (evidenceId === "E-02") {
    return codeNormalized === "VISITOR";
  }

  if (evidenceId === "E-03") {
    return (
      codeNormalized === "MKELLS" ||
      codeNormalized === "WHX/OPS 1991-022-03" ||
      codeNormalized === "WHX/OPS+1991-022-03"
    );
  }

  if (evidenceId === "E-04") {
    return codeNormalized === "DON'T TRUST THE SWITCHBOARD" || codeNormalized === "DONT TRUST THE SWITCHBOARD";
  }

  if (evidenceId === "E-05" || evidenceId === "E-06") {
    return codeNormalized === "MKELLS";
  }

  return false;
}

function mergeLocalStorageUnlocks(state: ProgressState, localUnlocked: any) {
  if (!Array.isArray(localUnlocked)) return state;

  const incoming = localUnlocked
    .map((x) => String(x || "").trim().toUpperCase())
    .filter((x) => x.length > 0);

  if (incoming.length === 0) return state;

  const set = new Set((state.unlockedEvidence || []).map((x) => String(x).toUpperCase()));
  for (const id of incoming) set.add(id);

  state.unlockedEvidence = Array.from(set);
  state.updatedAt = Date.now();
  return state;
}

export async function GET(req: Request) {
  const jar = await cookies();
  const url = new URL(req.url);

  const queryInstance = url.searchParams.get("instance");
  const sharedInstance = jar.get("scib_case01_instance_v1")?.value;

  const instanceId = cleanInstanceIdOrNull(queryInstance || sharedInstance);

  if (!instanceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing room instance. Join or create an investigation room first.",
      },
      { status: 400 }
    );
  }

  const state = await readProgress(instanceId);

  return NextResponse.json({
    ok: true,
    state,
  });
}

export async function POST(req: Request) {
  const jar = await cookies();
  const url = new URL(req.url);

  const queryInstance = url.searchParams.get("instance");
  const sharedInstance = jar.get("scib_case01_instance_v1")?.value;

  const instanceId = cleanInstanceIdOrNull(queryInstance || sharedInstance);

  if (!instanceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing room instance. Join or create an investigation room first.",
      },
      { status: 400 }
    );
  }

  const name = (jar.get("scib_name_v1")?.value || "").trim().slice(0, 24);
  const badge = (jar.get("scib_badge_v1")?.value || "").trim().slice(0, 24);

  if (!isNonEmpty(name) || !isNonEmpty(badge)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body?.action || "").trim();

  if (action === "merge_local_unlocked") {
    const state = await readProgress(instanceId);
    const merged = mergeLocalStorageUnlocks(state, body?.unlockedEvidence);
    await writeProgress(instanceId, merged);

    const bus = getRoomBus(instanceId);
    bus.emit({ type: "progress", payload: { state: merged } });

    return NextResponse.json({ ok: true, state: merged });
  }

  if (action === "unlock_evidence") {
    const evidenceId = normalizeEvidenceId(body?.evidenceId);
    if (!evidenceId) {
      return NextResponse.json({ ok: false, error: "Missing evidenceId" }, { status: 400 });
    }

    const codeNormalized = normalizeCode(body?.code);
    const state = await readProgress(instanceId);
    const already = new Set((state.unlockedEvidence || []).map((x) => String(x).toUpperCase()));

    if (!already.has(evidenceId)) {
      const valid = applyUnlockMapping(evidenceId, codeNormalized);
      if (!valid) {
        return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 400 });
      }

      already.add(evidenceId);
      state.unlockedEvidence = Array.from(already);
      state.updatedAt = Date.now();
      state.activity.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ts: Date.now(),
        type: "unlock_evidence",
        who: name,
        evidenceId,
      });

      await writeProgress(instanceId, state);

      const bus = getRoomBus(instanceId);
      bus.emit({ type: "progress", payload: { state } });
    }

    return NextResponse.json({ ok: true, state });
  }

  if (action === "solve_case") {
    const state = await readProgress(instanceId);
    if (!state.solved) {
      state.solved = true;
      state.updatedAt = Date.now();
      state.activity.unshift({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ts: Date.now(),
        type: "solve_case",
        who: name,
      });

      await writeProgress(instanceId, state);

      const bus = getRoomBus(instanceId);
      bus.emit({ type: "progress", payload: { state } });
    }

    return NextResponse.json({ ok: true, state });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
