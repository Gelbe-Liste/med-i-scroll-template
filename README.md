# med.i.scroll – Gelbe Liste (Vercel-safe)

Diese Variante wurde für ein möglichst robustes Vercel-Deployment reduziert.

## Stack

- React 19
- Vite 8
- JavaScript / JSX
- CSS
- native IntersectionObserver + Scroll Events
- keine TypeScript-Buildstufe
- keine zusätzliche Animationsbibliothek

## Start lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel

Das Repository enthält eine `vercel.json` mit:

- Framework: Vite
- Install Command: `npm install --no-audit --no-fund`
- Build Command: `npm run build`
- Output Directory: `dist`

Vercel sollte das Projekt damit ohne zusätzliche Dashboard-Anpassungen deployen.

## Piano Analytics

`src/tracking/piano.js` verwendet `window.pa.sendEvent(...)`, sobald Piano auf der Seite verfügbar ist.
Ohne Piano werden Events im Development-Modus in der Konsole ausgegeben.
