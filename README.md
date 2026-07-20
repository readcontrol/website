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
  WavingFlag.tsx   interactive, waving bookmark hero (SVG + requestAnimationFrame)
  PromoVideo.tsx   self-hosted video with a click-to-play poster facade
lib/
  content.tsx      feature copy + inline icons (edit feature list here)
public/            drop images & the promo video here — see public/README.md
```

## The hero flag

`WavingFlag` draws a bookmark as an SVG polygon whose edges ripple with a
traveling sine wave (pinned at top, free at bottom). Move the pointer over it to
add wind and make it lean; click to send a ripple. Respects
`prefers-reduced-motion` (renders a gentle static curve).

## Assets

Images and the promo video are **not** committed — the page shows labelled
placeholders until you add them. Filenames and sizes are listed in
[`public/README.md`](./public/README.md).

## Editing content

- **Feature rows & bullets:** `lib/content.tsx` (`FEATURES`, `EXTRAS`).
- **Hero copy / CTA links:** top of `app/page.tsx` (`DOWNLOAD`, `GITHUB`).
- **Colors / spacing:** `:root` tokens in `app/globals.css`.
