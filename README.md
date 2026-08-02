# ReadControl — landing page

Marketing site for **ReadControl**, built with **Next.js 16** (App Router) and **Tailwind CSS**.
Dark theme, palette sampled from the app. Statically exported (`output: export`), so it can be
hosted on any static host.

Part of the **ReadControl** project → [github.com/readcontrol/root](https://github.com/readcontrol/root).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & lint

```bash
npm run build      # emits ./out — deploy to any static host
npm run lint       # ESLint (eslint-config-next)
```

## Structure

```
app/
  layout.tsx       metadata, fonts, <html>
  page.tsx         the page: all sections in order
  globals.css      Tailwind import + design tokens
  icon.png         favicon
components/         section + UI pieces (Letter, PromoVideo, Media, Faq, …)
lib/
  content.tsx      feature copy — edit the feature list here
  persist.ts       small localStorage helper for the interactive demo bits
public/            images & the promo video — see public/README.md
```

## Editing content

- **Feature copy:** `lib/content.tsx`.
- **Hero copy / links (Download, GitHub):** top of `app/page.tsx`.
- **Colors / spacing:** the `:root` tokens in `app/globals.css`.

## Assets

Images and the promo video are **not** committed — the page shows labelled placeholders until you
add them. Filenames and sizes are listed in [`public/README.md`](./public/README.md).
