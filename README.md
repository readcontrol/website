# Read Control — landing page

Marketing site for **Read Control**, built with **Next.js 16** (App Router) and
plain CSS. Dark theme, palette sampled from the app's `layout.png` (near-black
charcoal + cream). Statically exported — host it anywhere.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build (static)

```bash
npm run build      # emits ./out — deploy to any static host
```

## Structure

```
app/
  layout.tsx       fonts (Inter), metadata, <html>
  page.tsx         all sections (nav, hero, video, features, CTA, footer)
  globals.css      design tokens + styles
  icon.svg         bookmark favicon
components/
  WavingFlag.tsx   client wrapper: reduced-motion detection + dynamic (ssr:false) load
  FlagCanvas.tsx   the 3D cloth hero (three.js / react-three-fiber)
  PromoVideo.tsx   self-hosted video with a click-to-play poster facade
  Media.tsx        feature image frame with a labelled placeholder fallback
lib/
  content.tsx      feature copy + inline icons (edit feature list here)
public/            drop images & the promo video here — see public/README.md
```

## The hero flag

A real 3D cloth banner (`FlagCanvas`) rendered with **three.js /
react-three-fiber**. A PBR cloth material has a traveling-wave displacement
injected into its vertex shader (pinned at the top dowel, free at the swallowtail
bottom) with normals recomputed for correct lighting. Hover to stir up wind;
click for a gust. The lighting environment is **procedural** (drei
`Lightformer`s) so nothing is fetched from a CDN — it works offline and in the
static export. Loaded via `dynamic(..., { ssr: false })`, with a static cream
bookmark as the loading fallback, and paused under `prefers-reduced-motion`.

## Assets

Images and the promo video are **not** committed — the page shows labelled
placeholders until you add them. Filenames and sizes are listed in
[`public/README.md`](./public/README.md).

## Editing content

- **Feature rows & bullets:** `lib/content.tsx` (`FEATURES`, `EXTRAS`).
- **Hero copy / CTA links:** top of `app/page.tsx` (`DOWNLOAD`, `GITHUB`).
- **Colors / spacing:** `:root` tokens in `app/globals.css`.
