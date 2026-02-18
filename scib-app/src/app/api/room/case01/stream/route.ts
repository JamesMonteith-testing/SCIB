import { NextResponse } from "next/server";
import { roomBus } from "@/lib/roomBus";

export const dynamic = "force-dynamic";

function sseFormat(event: string, data: any) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // initial hello so the client knows the stream is live
      controller.enqueue(encoder.encode(sseFormat("hello", { ok: true, ts: Date.now() })));

      const unsubscribe = roomBus.subscribe((evt) => {
        controller.enqueue(encoder.encode(sseFormat(evt.type, evt.payload)));
      });

      // keep-alive ping every 20s (helps proxies)
      const timer = setInterval(() => {
        controller.enqueue(encoder.encode(sseFormat("ping", { ts: Date.now() })));
      }, 20000);

      // If client disconnects, Next will cancel the stream and call cancel()
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
