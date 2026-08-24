declare global {
  interface Window {
    pa?: {
      sendEvent: (eventName: string, properties?: Record<string, unknown>) => void;
    };
  }
}

type TrackingProperties = Record<string, string | number | boolean | null | undefined>;
const onceKeys = new Set<string>();

export function trackEvent(eventName: string, properties: TrackingProperties = {}) {
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  );

  if (window.pa?.sendEvent) {
    window.pa.sendEvent(eventName, clean);
    return;
  }

  if (import.meta.env.DEV) {
    console.info("[Piano demo]", eventName, clean);
  }
}

export function trackOnce(
  key: string,
  eventName: string,
  properties: TrackingProperties = {}
) {
  if (onceKeys.has(key)) return;
  onceKeys.add(key);
  trackEvent(eventName, properties);
}
