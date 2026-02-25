# PWA (Progressive Web App) – vrieling.salgai.nl

Deze webapp is een PWA: gebruikers kunnen de app op het startscherm zetten op Android (Chrome) en iOS (Safari) en in standalone-modus gebruiken.

## Keuze implementatie: @ducanh2912/next-pwa

- **Waarom:** Onderhouden fork van `next-pwa`, compatibel met Next.js App Router en Workbox. Service worker wordt automatisch gegenereerd; geen custom server nodig. Ondersteunt `disable` in development zodat de SW alleen in production actief is.
- **Alternatief:** `next-pwa` (origineel) is minder actief onderhouden; `@ducanh2912/next-pwa` heeft betere ondersteuning voor recente Next.js.

## Build (Next.js 16 + Webpack)

Next.js 16 gebruikt standaard Turbopack; `@ducanh2912/next-pwa` werkt met Webpack. Daarom wordt er gebuild met het `--webpack`-vlag: `npm run build` roept `next build --webpack` aan. Op Vercel moet je in **Build Command** desnoods `next build --webpack` zetten (of de npm script `build` blijft gewoon `next build --webpack`).

## Bestanden en structuur

| Bestand / map | Doel |
|---------------|------|
| `public/manifest.webmanifest` | Web App Manifest (naam, icons, theme_color, display: standalone, start_url, scope) |
| `public/icons/` | PWA-icons: 16, 32, 180 (apple-touch), 192, 512, maskable 192/512 |
| `next.config.mjs` | PWA-plugin (`@ducanh2912/next-pwa`) + runtime caching |
| `app/layout.tsx` | Metadata (manifest link, theme_color, appleWebApp), viewport, PwaInstallPrompt |
| `components/pwa-install-prompt.tsx` | Install-CTA (Android) en iOS “Zet op beginscherm”-instructie |
| `scripts/generate-pwa-icons.cjs` | Genereert PNG-icons uit `public/icon.svg` |

Na een build verschijnen o.a. in `public/`:

- `sw.js` (service worker)
- `workbox-*.js` / `worker-*.js` (Workbox runtime)
- `fallback-*.js` (fallback-pagina, indien geconfigureerd)

## Icons genereren

Icons worden gegenereerd vanuit `public/icon.svg`. Bij wijziging van het logo:

```bash
npm run pwa:icons
```

Dit schrijft o.a.:

- `public/icons/icon-16.png`, `icon-32.png` (favicon-formaten)
- `public/icons/apple-touch-icon.png` (180×180, iOS)
- `public/icons/icon-192.png`, `icon-512.png` (manifest, purpose: any)
- `public/icons/icon-maskable-192.png`, `icon-maskable-512.png` (maskable, veilige zone ~80%)

Voor maskable icons houdt het script een veilige marge aan zodat Android ze goed kan maskeren (rond, squircle, etc.).

## Caching en privacy

- **HTML/pagina’s:** Network-first (updates komen door na refresh).
- **Static assets** (`_next/static`, afbeeldingen, fonts): Cache-first.
- **API-routes** (`/api/*`): **NetworkOnly** – geen caching van responses (geen gevoelige data/antwoorden in cache).

De service worker is alleen actief in **production** (`NODE_ENV === "production"`). In development staat PWA uit (`disable: true`).

## Test-checklist

### Chrome (Android / desktop)

- [ ] **Installable:** Applicatie > Manifest: geen fouten; “Install app” / install-icoon beschikbaar.
- [ ] **Standalone:** Na installatie opent de app in eigen venster (geen browser-UI).
- [ ] **Service worker:** Application > Service Workers: `sw.js` geregistreerd en actief.
- [ ] **Install-CTA:** Op een ondersteund device (of met install-criteria) verschijnt de “Installeer app”-balk (component `PwaInstallPrompt`); na installatie verdwijnt deze.

### iOS (Safari)

- [ ] **Add to Home Screen:** Deel-menu (Tik op Deel) → “Zet op beginscherm” toevoegen.
- [ ] **Icon:** Na toevoegen is het icon op het beginscherm correct (apple-touch-icon 180×180).
- [ ] **Standalone:** Na openen vanaf beginscherm: fullscreen zonder Safari-UI (statusbalk zichtbaar, afhankelijk van `apple-mobile-web-app-status-bar-style`).
- [ ] **Instructie:** Bij eerste bezoek (iOS Safari) kan de korte instructie “Tik op Deel → Zet op beginscherm” getoond worden; sluiten en sessionStorage zorgen dat deze niet steeds terugkomt.

### Updates na deploy

- [ ] Nieuwe deploy: na een refresh (of bij volgende bezoek) worden pagina’s network-first opgehaald; gebruikers zien de nieuwe versie.
- [ ] Static assets (JS/CSS) worden cache-first geserveerd; bij een nieuwe build krijgen ze nieuwe bestandsnamen, dus nieuwe cache entries.

### Lighthouse (Chrome DevTools)

- [ ] **PWA-basis:** Lighthouse > Progressive Web App: voldoet aan de basis (manifest, service worker, HTTPS, icons, etc.).

## Vercel / HTTPS

PWA vereist **HTTPS**. Op Vercel is dat standaard het geval. Controleer dat de site via `https://` wordt aangeboden; dan werken install prompt en service worker correct.

## Optioneel: offline fallback

Standaard is geen offline-fallbackpagina geconfigureerd. Wil je een eigen offline-pagina, dan kan dat via de `fallbacks`-optie van `@ducanh2912/next-pwa` (bijv. een route `app/~offline/page.tsx`). Zie [Offline support](https://ducanh-next-pwa.vercel.app/docs/next-pwa/offline-fallbacks).
