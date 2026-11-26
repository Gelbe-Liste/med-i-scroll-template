import { useEffect, useState } from "react";
import { CONSENT_STORAGE_KEY, readAnalyticsConsent, storeAnalyticsConsent, broadcastAnalyticsConsent } from "./analyticsConsent.js";
import "./analyticsConsent.css";

/** Wiederverwendbar in med.i.scroll und med.i.tap; keine zusätzliche Consent-Bibliothek. */
export default function AnalyticsConsent({ privacyHref = "/datenschutz.html" }) {
  const [choice, setChoice] = useState(readAnalyticsConsent);
  const [showPanel, setShowPanel] = useState(() => readAnalyticsConsent() === null);

  useEffect(() => {
    // Entscheidung bei erneutem Seitenaufruf synchron an beide Adapter übergeben.
    // Ohne gespeicherte Entscheidung lautet der Status zwingend 'keine Zustimmung'.
    broadcastAnalyticsConsent(readAnalyticsConsent());
    const onStorage = (event) => {
      if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
      const next = readAnalyticsConsent();
      setChoice(next);
      setShowPanel(next === null);
      broadcastAnalyticsConsent(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const decide = (next) => {
    storeAnalyticsConsent(next);
    setChoice(next);
    setShowPanel(false);
  };

  return (
    <>
      {showPanel ? (
        <section className="medi-consent" role="dialog" aria-modal="false" aria-labelledby="medi-consent-title" aria-describedby="medi-consent-description">
          <div className="medi-consent__heading">
            <span className="medi-consent__shield" aria-hidden="true">✓</span>
            <h2 id="medi-consent-title">Datenschutz &amp; Nutzungsanalyse</h2>
          </div>
          <p>Wir möchten verstehen, wie unsere medizinischen Informationsangebote genutzt werden, um ihre Qualität und Benutzerfreundlichkeit zu verbessern.</p>
          <p id="medi-consent-description">Hierzu erfassen wir Ihre Nutzungsdaten wie Kapitelaufrufe, Scrolltiefe und Interaktionen. Die Analyse erfolgt <strong>pseudonymisiert</strong> und nur mit Ihrer Einwilligung. Sie können diese jederzeit widerrufen.</p>
          <p className="medi-consent__detail">Bei Zustimmung verwenden wir PostHog (EU Cloud) und, sofern freigegeben, Piano Analytics. Ohne Zustimmung bleibt die Anwendung uneingeschränkt nutzbar. <a href={privacyHref} target="_blank" rel="noopener noreferrer">Datenschutzhinweise</a></p>
          <div className="medi-consent__actions">
            <button type="button" className="medi-consent__button medi-consent__button--reject" onClick={() => decide("rejected")}>{choice === "accepted" ? "Einwilligung widerrufen" : "Nur notwendige Funktionen"}</button>
            <button type="button" className="medi-consent__button medi-consent__button--accept" onClick={() => decide("accepted")}>Analytics zustimmen</button>
          </div>
        </section>
      ) : (
        <button type="button" className="medi-consent__manage" onClick={() => setShowPanel(true)} aria-label="Datenschutzeinstellungen öffnen">
          <span aria-hidden="true">⚙</span> Datenschutz
        </button>
      )}
    </>
  );
}
