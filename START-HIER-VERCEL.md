# START HIER – med.i.scroll v6.6 · Vercel Deployment + PostHog EU

**Stand:** 26.11.2026 · Verpackung/QA v1.4.1 · Basis ist die bestehende Mastertemplate-Version. Der fachliche Tracking-Layer bleibt erhalten.

## Was ist vorbereitet?

- React/Vite-Quellprojekt inkl. `src/tracking/piano.*` (unverändert separat schaltbar) und `src/tracking/posthog.js` (PostHog EU).
- `vercel.json`: Vite-Build, `npm ci`, Ausgabe `dist`.
- `.env.example`: Dokumentation der Umgebungsvariablen. **Keine `.env` mit echtem Token im ZIP.**
- Zwei Kopiervorlagen `VERCEL-ENV-PREVIEW.txt` und `VERCEL-ENV-PRODUCTION.txt`.
- `deployment_environment` wird als PostHog-Event-Property `preview` bzw. `production` übertragen. Kundenberichte immer nach `project_id` **und** `deployment_environment=production` filtern.

## 1 · Projekt auf Vercel deployen

Vercel ist Git- bzw. CLI-basiert. Das ZIP ist **Quellcode zum Entpacken**, nicht automatisch ein hochladbares Vercel-Bundle.

**Bei vorhandenem Vercel-Projekt/Git-Repository:** ZIP entpacken; den Inhalt des Verzeichnisses (inkl. `package.json`, `src`, `public`, `vercel.json`) im zugehörigen Git-Repository als neuen Commit bereitstellen und pushen. Das bestehende Vercel-Projekt baut den Commit neu. Bei fehlendem Git-Zugang Entwicklungs-/IT-Team um diesen Commit bitten.

**Bei neuem Vercel-Projekt:** Inhalt in ein Git-Repository pushen → Vercel > Add New > Project > Import Git Repository. Framework `Vite`, Root Directory mit `package.json`, Output Directory `dist`.

**Alternativ mit CLI (nach `npm` und Vercel-Login):** `vercel` aus dem entpackten Projektordner aufrufen und das Projekt verknüpfen. Für ein produktives Deployment `vercel --prod` erst nach Freigabe einsetzen.

## 2 · Vercel Environment Variables (im Vercel-Dashboard)

In `Settings > Environment Variables` pro Projekt erfassen. Die Datei `VERCEL-ENV-PREVIEW.txt` enthält alle Namen/Werte.

| Variablenname | Preview-Wert |
|---|---|
| `VITE_POSTHOG_ENABLED` | `true` |
| `VITE_POSTHOG_PROJECT_TOKEN` | eigener öffentlicher Token `phc_...` aus PostHog EU |
| `VITE_POSTHOG_DEPLOY_ENV` | `preview` |
| `VITE_PIANO_ENABLED` | `false` |
| `VITE_PIANO_ESSENTIAL_APPROVED` | `false` |

Die numerische PostHog-Project-ID wird **nicht benötigt**. Beide Mastertemplates können denselben PostHog EU Token verwenden und werden über `project_id` unterschieden.

Für **Production** zunächst `VITE_POSTHOG_ENABLED=false` setzen; siehe `VERCEL-ENV-PRODUCTION.txt`. Vite-Variablen werden beim **Build** eingebettet: nach jeder Änderung ein neues Deployment erstellen.

## 3 · Consent: Vor produktiver Datenerfassung erforderlich

Die Anwendungen enthalten **keine fertige CMP-/Cookie-Banner-Oberfläche**. Nur das bestehende Consent-Signal ist technisch vorbereitet. Ohne diese Einwilligungsschnittstelle sendet PostHog auch mit aktivierter Umgebungsvariable **keine** Events.

Die echte Consent-Plattform muss bei gültiger Analytics-Einwilligung und bei Widerruf aufrufen:

```js
window.dispatchEvent(new CustomEvent('medi:analytics-consent', { detail: { posthog: true } }));
// Beim Widerruf:
window.dispatchEvent(new CustomEvent('medi:analytics-consent', { detail: { posthog: false } }));
```

Eine bereits früher erteilte gültige Einwilligung muss nach dem Laden der Anwendung erneut an den Adapter übergeben werden. Vor Produktion: AVV, Datenschutzhinweise, Rechtsgrundlage/CMP, Netzwerkpolitik/CSP und Datenminimierung von IT/Datenschutz freigeben lassen.

## 4 · Erster Preview-Test (nur nach eigener bewusster Testeinwilligung)

1. In Vercel die **Preview**-Umgebungsvariablen setzen und neuen Preview-Build deployen.
2. Preview-URL aufrufen. Chrome/Firefox Entwicklertools > Konsole öffnen.
3. Als bewusst einwilligender Testnutzer in die Konsole eingeben:

   ```js
   window.dispatchEvent(new CustomEvent('medi:analytics-consent', {detail: {posthog: true}}));
   ```

4. In der Anwendung Kapitel/Module aufrufen und CTAs testen.
5. PostHog EU > **Activity**: nach `page.display`, `$pageview`, `click.action` sowie `project_id` und `deployment_environment=preview` filtern.
6. Im Browser-Tab `Network` nach `eu.i.posthog.com/i/v0/e/` filtern. Bei fehlenden Requests zuerst Consent-Signal und Vercel-Variablen prüfen.
7. Zum Widerruf dieselbe Anweisung mit `posthog:false` ausführen. Danach dürfen keine neuen Events versendet werden.

**Wichtig:** Events mit Preview-Token können echte PostHog-Events im Projekt erzeugen. Sie gehören nicht in produktive Kundenreports; daher `deployment_environment=production` filtern oder besser ein separates QA-PostHog-Projekt nutzen.

## 5 · Produktiver Go-live

- CMP stellt die korrekten Signale bereit (inkl. bestehender Einwilligung und Widerruf).
- PostHog-/Datenschutzfreigabe dokumentiert und DPA/Datenschutzhinweise geprüft.
- Preview-Events und KPIs sind in PostHog geprüft; Dashboard-Filter `project_id`, `deployment_environment` festgelegt.
- Erst dann `VITE_POSTHOG_ENABLED=true` **für Production** setzen, Production-Rebuild auslösen und in Activity prüfen.
- Piano weiterhin **deaktiviert**, bis das Vidal-Piano-Data-Model und Consent freigegeben sind.

## Verifikation der ZIP-Quelle

Unit-Test des PostHog-Adapters: `npm run test:analytics`. Vollständiger Build: `npm ci && npm run build` (oder Vercel-Buildlog). Der vollständige Build konnte bei der Erstellung nicht durchgeführt werden, weil die npm-Pakete hier nicht aus dem Internet geladen werden können.
