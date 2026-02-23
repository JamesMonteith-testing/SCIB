import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRoomBus } from "@/lib/roomBus";

export const dynamic = "force-dynamic";

function sseFormat(event: string, data: any) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const queryInstance = url.searchParams.get("instance");

  const jar = await cookies();
  const cookieInstance = jar.get("scib_badge_v1")?.value;

  const instanceId =
    (queryInstance || cookieInstance || "DEFAULT")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 48) || "DEFAULT";

  const bus = getRoomBus(instanceId);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      controller.enqueue(
        encoder.encode(
          sseFormat("hello", { ok: true, ts: Date.now(), instanceId })
        )
      );

      const unsubscribe = bus.subscribe((evt) => {
        controller.enqueue(
          encoder.encode(sseFormat(evt.type, evt.payload))
        );
      });

      const timer = setInterval(() => {
        controller.enqueue(
          encoder.encode(sseFormat("ping", { ts: Date.now() }))
        );
      }, 20000);

      (controller as any).__cleanup = () => {
        clearInterval(timer);
        unsubscribe();
      };
    },
    cancel(controller) {
      const cleanup = (controller as any).__cleanup;
      if (typeof cleanup === "function") cleanup();
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
