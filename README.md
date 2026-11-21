# Last Exit Paradise — GTA 6 Cover Art Maker

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/ferdizi/gta6-cover-art-entry/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/ferdizi/gta6-cover-art-entry/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

An entry for the [gta6-cover-art-01 bounty on make.fun](https://make.fun/bounty/gta6-cover-art-01): a GTA 6-style multi-panel poster cover maker. Upload a photo (or use the AI-made samples), and it builds a sunset cover with slanted gold-bordered panels, a glowing gold route line with numbered stops, role tags, a giant striped-chrome title, a pink script subtitle and a tagline ribbon — then exports it in three sizes.

## What it makes

- **5 photo panels** — one big hero + 4 small, in 6 slanted layouts (coast, strip, grid, duo, mosaic, cascade), each with its own photo slot (A/B), focal point and role tag (`THE CAPTAIN`, `THE GETAWAY`, `THE DRIVER`, `THE BRAINS`).
- **A route that ties the panels together** — a glowing gold line joins the bottom edges of the panels with numbered stops 1–5, ending at the hero. A stop that would land inside the title moves to its panel's top-right corner.
- **Giant chrome title** — "LAST EXIT / PARADISE" in Anton, yellow→orange→pink gradient with sunset stripes, plum extrusion and a cream keyline. "Paid in Sunsets" in pink Pacifico script below, with the ribbon "ONE ROAD · FOUR ALIBIS · NO WAY BACK".
- **Poster furniture** — 5 gold stars + press quote ("THE HOTTEST RIDE OF THE YEAR" — GOLDEN MILE GAZETTE) + VOL. 1 badge on top; billing block, deterministic barcode and a gold BEST CAST seal at the bottom.
- **Face-aware crops** — click the cover to move a panel's focal point; a skin-tone centroid gives a first-guess face position on upload.
- **6 grades** (sunset, neon, golden, vice, teal, noir) and **true reflow export** in 1080×1080, 1080×1350 and 1920×1080 — panels and title are re-laid-out per size, never just cropped.

## How it works

Everything is plain client-side JavaScript on a `<canvas>` — no build step, no server, no network calls at runtime.

- **Renderer** (`app/src/cover.js`) — `drawCover(canvas, photos, state)` draws the whole poster from a state object: it lays out the panels for the chosen layout and size, applies the grade with canvas filters and a colour wash, then paints the route line, chrome title, ribbon, press bar, billing block, barcode and seal in that order. `exportCover(size)` re-runs the same renderer at 1080×1080, 1080×1350 or 1920×1080, so each size is a true reflow rather than a crop.
- **Editor** (`app/src/main.js`) — the sunset-styled page around the canvas: two photo slots (upload or the built-in samples), click-to-set focal points, an editable panel list (role, photo A/B, focal readout), and pickers for layout, grade and size. A skin-tone centroid gives the first-guess face position for each uploaded photo.
- **Export** — the editor downloads a PNG per size straight from the canvas (`canvas.toBlob`), and `window.__exportCover` exposes the same renderer for scripted screenshots via `app/src/shots.js` (`?shot=cover&size=…`).

## Run it

Static files only, works offline in desktop Chrome. Serve `app/`:

```sh
node serve.ts
# app/ is on http://localhost:8080
```

Or open `app/index.html` directly. Deterministic views for screenshots: `?shot=cover&size=landscape&photo=boulevard`, `?shot=editor`, `?shot=cover&size=portrait`, `?shot=cover&size=square&layout=grid&grade=neon`.

## Screenshots

The four screenshots in `screenshots/` are the app's own exports: the landscape cover, the editor with both samples loaded, the portrait reflow and the square grid/neon cover.

## Fonts & photos

Fonts are OFL-licensed (Anton, Pacifico, Oswald — see `app/fonts/`). Sample photos (`app/samples/boulevard.jpg`, `pier.jpg`) are AI-made and free to use. No Rockstar artwork, logo or font is used anywhere.

---

Built for make.fun — referral code `qgr0hfw9`.
