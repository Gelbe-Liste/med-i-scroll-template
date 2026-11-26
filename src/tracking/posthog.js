// PostHog EU – leichter Event-Adapter ohne PostHog-SDK, Session-Replay oder Autocapture.
// Offizieller Capture-Endpunkt: https://eu.i.posthog.com/i/v0/e/
// KEINE Übermittlung vor externer Consent-Freigabe. Kein Tracking durch bloßes Laden der App.
const enabled = String(import.meta.env.VITE_POSTHOG_ENABLED || "false").toLowerCase() === "true";
const token = String(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || "").trim();
const endpoint = "https://eu.i.posthog.com/i/v0/e/";
const validToken = /^phc_[A-Za-z0-9_-]+$/.test(token);
const deployEnvRaw = String(import.meta.env.VITE_POSTHOG_DEPLOY_ENV || "unconfigured").toLowerCase();
const deployEnvironment = ["preview", "production", "development"].includes(deployEnvRaw)
  ? deployEnvRaw : "unconfigured";
const identityStorageKey = "med_i_posthog_distinct_id_v1";
const sessionStorageKey = "med_i_posthog_session_v1";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_MAX_MS = 24 * 60 * 60 * 1000;
const restrictedProperty = /(^|_)(email|phone|telephone|address|full_name|patient|patient_id|user_id|first_name|last_name|ip_address|search_query|search_term|free_text|form_value)(_|$)/i;
let allowed = false;
let context = {};
let latestPage = null;
let pageviewSent = false;
let lastVirtualPage = { key: "", at: 0 };
let volatileId = null;
let volatileSession = null;

function uuidv7() {
  // Korrektes UUIDv7 für PostHog-Sessions (RFC 9562, timestamp in ms).
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let timestamp = BigInt(Date.now());
  for (let i = 5; i >= 0; i--) { bytes[i] = Number(timestamp & 255n); timestamp >>= 8n; }
  bytes[6] = (bytes[6] & 15) | 0x70;
  bytes[8] = (bytes[8] & 63) | 0x80;
  const hex = Array.from(bytes, x => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function readStorage(store, key) { try { return store.getItem(key); } catch { return null; } }
function writeStorage(store, key, value) { try { store.setItem(key, value); } catch { /* Storage kann im privaten Modus fehlen. */ } }
function clearStorage(store, key) { try { store.removeItem(key); } catch { /* no-op */ } }

function anonymousId() {
  if (!volatileId) {
    volatileId = readStorage(window.localStorage, identityStorageKey) || crypto.randomUUID();
    writeStorage(window.localStorage, identityStorageKey, volatileId);
  }
  return volatileId;
}

function activeSession() {
  const now = Date.now();
  let stored = volatileSession;
  if (!stored) {
    try { stored = JSON.parse(readStorage(window.sessionStorage, sessionStorageKey) || "null"); }
    catch { stored = null; }
  }
  if (!stored || typeof stored.id !== "string" || !/^[0-9a-f-]{36}$/i.test(stored.id)
    || now - stored.last > SESSION_TIMEOUT_MS || now - stored.started > SESSION_MAX_MS || now < stored.started) {
    stored = { id: uuidv7(), started: now, last: now };
  }
  stored.last = now;
  volatileSession = stored;
  writeStorage(window.sessionStorage, sessionStorageKey, JSON.stringify(stored));
  return stored.id;
}

function safeUrl(value) {
  try {
    const url = new URL(value || window.location.href, window.location.origin);
    if (!/^https?:$/.test(url.protocol)) return undefined;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch { return undefined; }
}

function cleanProperties(props = {}) {
  const cleaned = {};
  for (const [key, value] of Object.entries(props)) {
    if (restrictedProperty.test(key) || value === undefined || value === null || value === "") continue;
    if (typeof value === "string") {
      if (value.length > 512 || /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(value)) continue;
      if (key === "page_url") { const url = safeUrl(value); if (url) cleaned[key] = url; continue; }
      if (key === "destination_path") {
        if (/^(mailto:|tel:)/i.test(value)) continue;
        const pathOnly = value.split(/[?#]/, 1)[0].slice(0, 255);
        if (pathOnly) cleaned[key] = pathOnly;
        continue;
      }
      cleaned[key] = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      cleaned[key] = value;
    } else if (Array.isArray(value)) {
      cleaned[key] = value.filter(x => typeof x === "string" && x.length <= 200 || typeof x === "number" || typeof x === "boolean").slice(0, 30);
    }
  }
  return cleaned;
}

function acquisition() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const val = params.get(key);
    if (val && /^[a-zA-Z0-9_.: -]{1,100}$/.test(val)) result[key] = val;
  }
  return result;
}

function send(eventName, props = {}) {
  if (!allowed || !enabled || !validToken || !navigator.onLine) return;
  const clean = cleanProperties({ ...context, ...props });
  // Person profiles ausdrücklich nicht anlegen; Auswertung über anonymen distinct_id.
  const body = {
    token,
    event: eventName,
    properties: {
      ...clean,
      ...acquisition(),
      deployment_environment: deployEnvironment,
      distinct_id: anonymousId(),
      $session_id: activeSession(),
      $process_person_profile: false,
      $lib: "med-i-posthog-capture-adapter",
      $lib_version: "1.0.1"
    },
    timestamp: new Date().toISOString()
  };
  void fetch(endpoint, {
    method: "POST", mode: "cors", credentials: "omit", keepalive: true,
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }).then(response => {
    if (!response.ok && import.meta.env.DEV) console.warn("[PostHog] HTTP", response.status);
  }).catch(error => { if (import.meta.env.DEV) console.warn("[PostHog] Event fehlgeschlagen", error); });
}

function sendPhysicalPageview(props) {
  if (pageviewSent) return;
  pageviewSent = true;
  send("$pageview", {
    ...props,
    $current_url: safeUrl(),
    $host: window.location.hostname,
    $pathname: window.location.pathname,
    $title: document.title
  });
}

export function initPosthogTracking(initialContext = {}) {
  context = cleanProperties({ ...context, ...initialContext });
  // Keine automatische Consent-Annahme; Consent kommt ausschließlich von der CMP.
  if (enabled && !validToken && import.meta.env.DEV) console.warn("[PostHog] Public project token (phc_…) fehlt.");
}

export function setPosthogTrackingContext(nextContext = {}) {
  context = cleanProperties({ ...context, ...nextContext });
}

export function sendToPosthog(eventName, properties = {}) {
  const merged = cleanProperties({ ...context, ...properties });
  if (eventName === "page.display") latestPage = merged;
  if (!allowed) return; // Vor Consent weder versenden noch Ereignisse puffern.
  if (eventName === "page.display") {
    const key = String(merged.page || "") + "|" + String(merged.screen_id || "");
    const at = Date.now();
    if (lastVirtualPage.key === key && at - lastVirtualPage.at < 300) return; // React StrictMode.
    lastVirtualPage = { key, at };
    sendPhysicalPageview(merged);
  }
  send(eventName, merged);
}

export function setPosthogConsent(consented) {
  const next = consented === true;
  if (!next) {
    allowed = false;
    volatileId = null;
    volatileSession = null;
    pageviewSent = false;
    lastVirtualPage = { key: "", at: 0 };
    clearStorage(window.localStorage, identityStorageKey);
    clearStorage(window.sessionStorage, sessionStorageKey);
    return;
  }
  if (!enabled || !validToken || allowed) return;
  allowed = true;
  // Bei Freigabe während einer laufenden Ansicht nur die *aktuelle* Ansicht erfassen.
  // Frühere Interaktionen werden aus Datenschutzgründen nicht nachgesendet.
  if (latestPage) sendToPosthog("page.display", latestPage);
}

// Integrationsvertrag für CMP: window.dispatchEvent(new CustomEvent("medi:analytics-consent", {detail:{posthog:true}}))
// Beim Widerruf denselben Event mit posthog:false senden. KEIN automatisches Consent.
if (typeof window !== "undefined") {
  window.addEventListener("medi:analytics-consent", event => {
    setPosthogConsent(event?.detail?.posthog === true);
  });
}
