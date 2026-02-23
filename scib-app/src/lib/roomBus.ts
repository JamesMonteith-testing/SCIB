export type RoomEvent =
  | { type: "post"; payload: { id: string; ts: number; who: string; text: string } }
  | { type: "ping"; payload: { ts: number } };

type Listener = (evt: RoomEvent) => void;

export type Bus = {
  subscribe: (fn: Listener) => () => void;
  emit: (evt: RoomEvent) => void;
};

// Keep a single bus across dev hot reloads
const g = globalThis as any;

function createBus(): Bus {
  const listeners = new Set<Listener>();

  return {
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    emit(evt) {
      for (const fn of listeners) {
        try {
          fn(evt);
        } catch {
          // ignore listener errors
        }
      }
    },
  };
}

// Back-compat global bus (legacy - do not use for new room instances)
export const roomBus: Bus = g.__SCIB_ROOM_BUS__ || (g.__SCIB_ROOM_BUS__ = createBus());

function cleanInstanceId(input: string) {
  const raw = (input || "").trim();
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return safe || "DEFAULT";
}

// Instance-scoped buses (prevents cross-user leakage)
type BusMap = { [key: string]: Bus };

export function getRoomBus(instanceId: string): Bus {
  const key = cleanInstanceId(instanceId);

  const map: BusMap = g.__SCIB_ROOM_BUS_MAP__ || (g.__SCIB_ROOM_BUS_MAP__ = {});
  map[key] = map[key] || createBus();
  return map[key];
}
