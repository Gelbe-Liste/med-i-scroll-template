const onceKeys = new Set();

export function trackEvent(eventName, properties = {}) {
  const cleanProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  );

  if (window.pa?.sendEvent) {
    window.pa.sendEvent(eventName, cleanProperties);
    return;
  }

  if (import.meta.env.DEV) {
    console.info("[tracking]", eventName, cleanProperties);
  }
}

export function trackOnce(key, eventName, properties = {}) {
  if (onceKeys.has(key)) return;
  onceKeys.add(key);
  trackEvent(eventName, properties);
}
