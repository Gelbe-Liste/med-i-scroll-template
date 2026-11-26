# START HIER – v6.7 · Consent + PostHog EU + Piano auf Vercel Production

**Neuer Stand:** 26.11.2026 · Analytics-Consent Release v1.5.0

## 1. Quellcode bereitstellen

- Diese Version entpacken, **den Inhalt des obersten Projektordners** in das mit Vercel verbundene Git-Repository übernehmen, committen und auf den Produktionsbranch pushen.
- Alternativ aus dem Projektordner `vercel --prod` verwenden. Ein ZIP als Datei wird nicht direkt von Vercel als Anwendung deployed.
- Existierende Inhalte und App-Navigation bleiben erhalten; neu sind Consent-UI, Gating und Datenschutz-Vorlagenseite.
- Nach dem Build die reguläre Domain testen. Prüfen, ob die gelbe Consent-Box beim ersten Besuch sichtbar ist.

## 2. Environment Variables in Vercel **für Production**

```dotenv
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_PROJECT_TOKEN=phc_HIER_PROJECT_TOKEN
VITE_POSTHOG_DEPLOY_ENV=production
VITE_PIANO_ENABLED=false
VITE_PIANO_ESSENTIAL_APPROVED=false
VITE_PIANO_CUSTOM_VIDEO_EVENTS=false
```

Der numerische Project ID wird nicht benötigt. Der öffentliche `phc_...`-Token wird nicht fest in den ZIP-Quellcode geschrieben. Änderungen an Vercel-Variablen werden **erst nach neuem Production-Build** wirksam.

## 3. Nutzer-Einwilligung (jetzt integriert)

- Erster Aufruf (oder nach Ablauf der lokalen Entscheidung): gelbe Consent-Box, ohne Tracking.
- `Nur notwendige Funktionen`: Anwendung nutzbar, PostHog und Piano erfassen nichts.
- `Analytics zustimmen`: bei korrekt hinterlegtem Token Beginn der PostHog-Erfassung; Piano nur bei separater Freigabe und Aktivierung.
- Nach Entscheidung: kleine Schaltfläche **Datenschutz**, darüber jederzeit erneut auswählen bzw. Zustimmung widerrufen.
- Entscheidung bleibt 180 Tage pro Domain bestehen. Kein rückwirkendes Nachsenden vorheriger Interaktionen.
- Für beide Analytics-Anbieter gilt dieselbe Einwilligung, soweit derselbe Zweck vom Datenschutzteam freigegeben wird.

## 4. Funktionsprüfung über die Production-Domain

1. Seite im privaten Browserfenster aufrufen. Banner muss sichtbar sein.
2. F12 / Netzwerk → nach `eu.i.posthog.com` suchen. **Vor Zustimmung: keine Requests.**
3. `Nur notwendige Funktionen` wählen, einige Kapitel bzw. Screens bedienen. Weiterhin **keine Requests**.
4. Über **Datenschutz** Einstellungen öffnen, `Analytics zustimmen` wählen. Netzwerkrequests prüfen; PostHog → Activity → Last hour: z. B. `page.display` und `$pageview`.
5. Weitere fachliche Interaktionen ausführen und Events nach `project_id` filtern.
6. Über **Datenschutz → Einwilligung widerrufen** Zustimmung zurücknehmen. Neue Interaktionen dürfen keine Requests mehr auslösen.
7. Seite aktualisieren: Ablehnung bleibt gespeichert. Die Entscheidung wird nach max. 180 Tagen erneut abgefragt.

**Hinweis:** Testevents auf der Production-Domain tragen `deployment_environment=production`. Für Kundenreports Testzeitraum separat notieren/ausfiltern. Event-Eingang in PostHog ist erst mit realem Token und Netzwerkrequests bestätigt.

## 5. Datenschutz-Freigabe vor breiter Datenerhebung

`/datenschutz.html` ist eine **gekennzeichnete Projektvorlage**, keine abschließend rechtlich geprüfte Datenschutzerklärung. Vor Kunden-Go-live Verantwortliche, Datenschutzkontakt, Verarbeitung, AVV/DPA, Speicherdauer, PostHog-IP-Datenverarbeitung, Widerrufs-/Betroffenenrechte und ggf. Piano ergänzen und freigeben lassen.

Die Formulierung **pseudonymisiert** ist technisch richtig: PostHog verwendet einen zufälligen, wiedererkennbaren `distinct_id`. Vollständige Anonymisierung ist dadurch nicht gegeben.

## 6. Tests und Fehlerbehebung

- `npm ci && npm run build` in einer Umgebung mit Paketregister oder das Vercel-Build-Log prüfen.
- `npm run test:analytics` (Node 22) ausführen.
- Wenn kein Request nach Zustimmung: Vercel Production-Variablen, Redeployment, PostHog-EU-Projekt/Token, Adblocker und `connect-src`-CSP prüfen.
- Falls Piano künftig freigegeben wird: vor Aktivierung Data Model, SDK-Consent-Modus und tatsächliche Event-Übermittlung mit Analytics/Datenschutz abstimmen.
