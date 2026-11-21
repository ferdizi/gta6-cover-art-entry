# Last Exit Paradise — GTA 6 Cover Art Maker

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/ferdizi/gta6-cover-art-entry/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/ferdizi/gta6-cover-art-entry/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

An entry for the [gta6-cover-art-01 bounty on make.fun](https://make.fun/bounty/gta6-cover-art-01). It turns your own photos into a GTA 6-style multi-panel poster cover: five slanted gold-bordered panels, a glowing gold route line with numbered stops, role tags, a giant striped-chrome title, a pink script subtitle and a tagline ribbon — exported as a PNG in three sizes.

## What it makes

- **Five photo panels** — one big hero plus four small ones, in six slanted layouts (coast, strip, grid, duo, mosaic, cascade). Every panel has its own photo slot (A or B), focal point and role tag (`THE CAPTAIN`, `THE GETAWAY`, `THE DRIVER`, `THE BRAINS`).
- **A route that ties the panels together** — a glowing gold line joins the bottom edges of the panels with numbered stops 1–5 and ends at the hero. A stop that would land inside the title moves up to its panel's top-right corner instead.
- **A giant chrome title** — "LAST EXIT / PARADISE" in Anton, a yellow→orange→pink gradient with sunset stripes, plum extrusion and a cream keyline. "Paid in Sunsets" in pink Pacifico script underneath, with the ribbon "ONE ROAD · FOUR ALIBIS · NO WAY BACK".
- **Poster furniture** — five gold stars and a press quote ("THE HOTTEST RIDE OF THE YEAR" — GOLDEN MILE GAZETTE) with a VOL. 1 badge across the top; a billing block, a deterministic barcode and a gold BEST CAST seal along the bottom.
- **Face-aware crops** — click the cover to move a panel's focal point; a skin-tone centroid gives a first-guess face position when a photo is uploaded.
- **Six grades** (sunset, neon, golden, vice, teal, noir) and **true reflow export** at 1080×1080, 1080×1350 and 1920×1080 — the panels and the title are re-laid-out for each size, never just cropped.

## How it works

Everything is plain client-side JavaScript on a `<canvas>` — no build step, no server, no network calls while it runs.

- **Renderer** (`app/src/cover.js`) — `drawCover(canvas, photos, state)` paints the whole poster from a state object: it lays out the panels for the chosen layout and size, grades each photo with canvas filters and a colour wash, then draws the route line, chrome title, ribbon, press bar, billing block, barcode and seal in that order. `exportCover(size)` runs the same renderer at 1080×1080, 1080×1350 or 1920×1080, so each size is a true reflow rather than a crop.
- **Editor** (`app/src/main.js`) — the sunset-styled page around the canvas: two photo slots (upload your own or use the built-in samples), click-to-set focal points, an editable panel list (role, photo A/B, focal readout), and pickers for layout, grade and size. A skin-tone centroid gives the first-guess face position for each uploaded photo.
- **Export** — the editor downloads a PNG per size straight from the canvas (`canvas.toBlob`), and `window.__exportCover` exposes the same renderer for scripted screenshots through `app/src/shots.js` (`?shot=cover&size=…`).

## Run it

Static files only, works offline in desktop Chrome. Serve `app/`:

```sh
node serve.ts
# app/ is on http://localhost:8080
```

Or open `app/index.html` directly. Deterministic views for screenshots: `?shot=cover&size=landscape&photo=boulevard`, `?shot=editor`, `?shot=cover&size=portrait`, `?shot=cover&size=square&layout=grid&grade=neon`.

## Covers

Four built-in views, rendered by the app itself:

- **Coast / sunset** — the landscape cover (1920×1080), slanted coast layout in the sunset grade.
- **Editor preview** — the sunset editor with both sample photos loaded.
- **Portrait grid / neon** — the cover reflowed to 1080×1350 in the grid layout and neon grade.
- **Square grid / neon** — the grid layout in neon at 1080×1080.

All three export sizes are true reflows: 1080×1080, 1080×1350 and 1920×1080.

## Screenshots

The four screenshots in `screenshots/` are the app's own exports: the landscape cover, the editor with both samples loaded, the portrait reflow and the square grid/neon cover.

## Fonts & photos

Fonts are OFL-licensed (Anton, Pacifico, Oswald — see `app/fonts/`). Sample photos (`app/samples/boulevard.jpg`, `pier.jpg`) are AI-made and free to use. No Rockstar artwork, logo or font is used anywhere.

---

Built for make.fun — referral code `qgr0hfw9`.
