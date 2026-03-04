import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoomBus } from "@/lib/roomBus";

export const dynamic = "force-dynamic";

function cleanInstanceIdOrNull(input: string | null | undefined) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe.length > 0 ? safe : null;
}

export async function GET(req: Request) {
  const jar = await cookies();
  const url = new URL(req.url);

  const queryInstance = url.searchParams.get("instance");
  const sharedInstance = jar.get("scib_case01_instance_v1")?.value;

  // IMPORTANT:
  // No badge fallback. No DEFAULT fallback.
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

  const bus = getRoomBus(instanceId);

  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();

      function send(event: string, data: any) {
        try {
          controller.enqueue(enc.encode(`event: ${event}\n`));
          controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // ignore
        }
      }

      send("hello", { ok: true, instanceId, ts: Date.now() });

      const unsubscribe = bus.subscribe((evt) => {
        // evt.type is the SSE event name
        send(evt.type, evt.payload);
      });

      const ping = setInterval(() => {
        send("ping", { ts: Date.now() });
      }, 20000);

      return () => {
        try {
          clearInterval(ping);
        } catch {}
        try {
          unsubscribe();
        } catch {}
        try {
          controller.close();
        } catch {}
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
