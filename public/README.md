# Assets to drop in

The page renders **dashed placeholders** until these files exist. Add a file
with the exact name/path below and it replaces its placeholder automatically —
no code change needed.

## Video

| Path | What | Notes |
|------|------|-------|
| `video/readcontrol-promo.mp4` | The promo video | H.264/AAC MP4, 16:9. Only loads after the user clicks play. |
| `images/video-poster.png` | Video thumbnail | 16:9 (e.g. 1600×900). Shown before play. |

## Feature-row images

Each is shown in a rounded card. **4:3** works best (e.g. 1200×900). App
screenshots on the charcoal UI look great here.

| Path | Feature row |
|------|-------------|
| `images/save-from-browser.png` | Clip any page in one click |
| `images/your-files.png` | Plain files, forever |
| `images/sync.png` | Bring your own sync |
| `images/native-reader.png` | A native reader |
| `images/search.png` | Find & sort anything |

## Social / OG image (optional)

| Path | What |
|------|------|
| `images/og.png` | 1200×630 Open Graph preview. Wire it into `app/layout.tsx` `openGraph.images` when ready. |
