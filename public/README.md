# Assets to drop in

The page renders **dashed placeholders** until these files exist. Add a file with the exact
name/path below and it replaces its placeholder automatically — no code change needed.

## Feature-row images

Shown in rounded cards. **4:3** works best (e.g. 1200×900); app screenshots look great here.

| Path | Feature row |
|------|-------------|
| `images/save-from-browser.png` | Save any page in one click |
| `images/your-files.png` | They are just files |
| `images/sync.png` | Bring your own sync |
| `images/native-reader.png` | A native reader |

## Video

| Path | What | Notes |
|------|------|-------|
| `video/readcontrol-promo.mp4` | The promo video | H.264/AAC MP4, 16:9. Loads only after the user clicks play. |
| `images/video-poster.png` | Video thumbnail | 16:9 (e.g. 1600×900). Shown before play. |

## Social / OG image (optional)

| Path | What |
|------|------|
| `images/og.png` | 1200×630 Open Graph preview. Wire it into `app/layout.tsx` `openGraph.images` when ready. |
