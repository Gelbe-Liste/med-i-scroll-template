# med.i.scroll – Gelbe Liste Template

Technischer React/Vite-Prototyp für ein wiederverwendbares Scrollytelling-Format im Gelbe-Liste-Kontext.

## Enthalten

- mobile-first Responsive Design
- Gelbe-Liste-inspirierte gelb/schwarz/weiße Gestaltung
- Co-Branding-Zeile für Sponsor/Partner
- Hero + 6 Story-Schritte
- Sticky Visual / Scroll Story
- Scroll-Fortschritt
- Quiz
- Video-Demo
- Tooltip
- Survey
- Download-/Link-Module
- CTA
- Piano-Analytics-Adapter
- Reduced-Motion-Unterstützung

## Tracking-Events

- `page.display`
- `story_step_view`
- `scroll_depth` (25/50/75/100)
- `module_complete`
- `quiz_answer`
- `video_start`
- `video_pause`
- `tooltip_open`
- `survey_answer`
- `pdf_download`
- `outbound_click`
- `cta_click`

## Start

```bash
npm install
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

## Inhalte pro Kundenprojekt anpassen

Zentrale Datei:

`src/data/content.ts`

Dort liegen:

- Brand-/Sponsor-Text
- Hero-Titel
- Intro
- Disclaimer
- sämtliche Story-Schritte

## Piano Analytics

In `index.html` befindet sich eine vorbereitete, auskommentierte SDK-Konfiguration.

Benötigt werden:

- Piano Site-ID
- Collect Domain

Der Adapter liegt unter:

`src/tracking/piano.ts`

Ohne aktive Piano-Konfiguration werden Events im Dev-Modus in der Browser-Konsole ausgegeben.

## Für den Produktivbetrieb noch ergänzen

- finales Gelbe-Liste-/Vidal-Branding und Logo-Assets
- Sponsorlogo / Co-Branding-Freigabe
- echte medizinisch-redaktionell geprüfte Inhalte
- finale Bild-/Video-Assets und Lizenzen
- echte Download-Dateien
- Impressum / Datenschutz
- Piano Site-ID / Collect Domain / Event-Naming final abstimmen
- Consent-/CMP-Integration prüfen
- Browser-/Device-QA
- SEO-/Metadaten
- Vercel-/Hosting-Deployment
