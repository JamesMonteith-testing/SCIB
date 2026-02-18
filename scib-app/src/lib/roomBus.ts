export type RoomEvent =
  | { type: "post"; payload: { id: string; ts: number; who: string; text: string } }
  | { type: "ping"; payload: { ts: number } };

type Listener = (evt: RoomEvent) => void;

type Bus = {
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

export const roomBus: Bus = g.__SCIB_ROOM_BUS__ || (g.__SCIB_ROOM_BUS__ = createBus());
