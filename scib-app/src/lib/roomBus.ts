type RoomEvent =
  | { type: "post"; payload: any }
  | { type: "ping"; payload: any }
  | { type: "progress"; payload: any };

type Listener = (evt: RoomEvent) => void;

class RoomBus {
  private listeners = new Set<Listener>();

  emit(evt: RoomEvent) {
    for (const listener of this.listeners) {
      try {
        listener(evt);
      } catch {}
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

const buses = new Map<string, RoomBus>();

export function getRoomBus(instanceId: string) {
  if (!buses.has(instanceId)) {
    buses.set(instanceId, new RoomBus());
  }
  return buses.get(instanceId)!;
}