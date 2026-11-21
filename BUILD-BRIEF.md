# Last Exit Paradise — Build Brief (gta6-cover-art-01)

Rewritten 2026-11-21 in the round-3 rebuild session (recording 01a1fba3).
Same entry, same spec, fresh words. The app lives in `~/workspace/gta6-cover-art/`;
the public repo is `ferdizi/gta6-cover-art-entry`, branch `main`.

## The bounty

- **gta6-cover-art-01**, $250, top 50 paid: 1st $50, 2nd $30, 3rd $15,
  4th–10th $5 each, 11th–50th $3 each.
- Entries close **Sat 21 Nov 2026, 17:30 WIB** (10:30 UTC). Result due 7 Dec.
- ~7,264 submissions, ~5,965 on the board. The top-50 line is a high win rate
  (the top three sit near 95%).
- Caps: **5 submissions a day, 10 total**. Force_Last: the last submission
  before the deadline is the final one.
- The judge (z-ai/glm-5.3-flash) compares entries pairwise from their
  SCREENSHOTS (a contact sheet, cover shown largest) plus a short outline of
  the source. The art matters most.
- Deliverables: a public GitHub repo (created after the bounty opened, OSI
  licence) with `main.ts` at the root, `vendor/makefun-app.ts` copied from the
  kit unchanged, static files under `app/` (`index.html` must work offline in
  desktop Chrome), 3–4 screenshots under `screenshots/` (first by name is the
  cover; at least one shows the app with a photo loaded, at least one shows an
  exported cover), and sealed recordings made with the kit's `record` command.
- `main.ts` copies `app/` + `screenshots/` to `/output` and writes
  `/output/dossier.json` (the starter `main.ts` already does this — keep it).
- Size caps: `app/` at most 993 files/dirs and 48 MiB in total, `index.html`
  at most 1 MiB. Screenshots: 3–4 files, each at most 256 KiB, long side at
  most 1280 px, short side at least 480 px. Names may only use
  letters/digits/`. _ -`.
- Photos must be your own, CC0, or AI-made. Never a real person without their
  agreement, never Rockstar artwork, logo or font.
- Own art, lettering and fonts only. No Rockstar logo, artwork or fonts.
- Kit: `~/workspace/gta6-cover-art-kit/gta6-cover-art-01-kit/`
  (`RULES.txt`, `cli/makefun.mjs`, `starter/`).
- Repo: `~/workspace/gta6-cover-art/` (starter already copied in).
  GitHub repo `ferdizi/gta6-cover-art-entry` — public, MIT `LICENSE` in the
  dir, `.makefun/owner.json` naming wallet
  `DJ63J746JAKJW2a7m775MmPCdrcoaHiVVEXm6xQW8n67`, repo About homepage
  `https://make.fun/bounty/gta6-cover-art-01` + topic `makefun`.
- Runtime: system Node v24 (`/usr/bin/node`) — the kit CLI and the recorder
  run under it. API key from `~/workspace/makefun/api-key.json` (never print
  it). Keypair `~/workspace/makefun/makefun-keypair.json`.

## What wins — the top three all look like this

Rank 1 "Golden Mile Cover Studio v4" (~95.2%), rank 2 "Palmline" (~95.1%),
rank 3 "Palmgrid" (~94.9%). Copy the look, never their art:

- A multi-panel grid (5–7 photo panels, slanted comic frames, thin
  gold/cream borders) with one big hero panel.
- A GIANT retro-chrome title across the middle: huge bold condensed letters,
  yellow→orange→pink gradient with horizontal sunset stripes, thick dark
  outline and glow. For example "SUNDOWN RACKET", "PALM FEVER", "NEON TIDE".
- A pink neon script/cursive subtitle under the title ("Paid in Sunsets",
  "one last summer", "Kings of the Causeway").
- Small black role tags on a panel corner ("THE DRIVER", "THE MECHANIC",
  "THE BOSS", "THE QUEEN", "THE BRAINS", "THE WILDCARD", "THE GETAWAY").
- Top bar: 5 gold stars + a quoted press line ("THE HOTTEST RIDE OF THE
  YEAR" — GOLDEN MILE GAZETTE) + a "VOL. 1" badge top-right.
- Bottom billing block (tiny caps production credits), "COMING SOON"
  bottom-left, barcode bottom-right, a gold seal/badge ("BEST CAST",
  "ORIGINAL COVER ART", "SEASON ONE").
- Warm sunset/neon grade (orange/pink/purple), palm trees, coast, neon glow.
- A tagline ribbon under the subtitle ("FIVE FRIENDS · ONE COAST · NO WAY
  BACK", "SEVEN SINNERS · ONE COAST · ZERO REGRETS").
- The app itself: the user uploads a photo (or more), face-aware crops per
  panel, caption/role/layout editing, several sunset/neon grades, PNG export
  in 3 sizes (1080×1080, 1080×1350, 1920×1080). Offline, desktop Chrome,
  static files only.

## The edge — four ideas from CoArena (take the best, not all four)

1. **A route that ties the panels together.** One hero panel + 4 smaller
   slanted panels laid out like moments along a coastal getaway. A fine
   glowing route line runs through the gaps between the panels, with small
   numbered stops and one restrained map-coordinate mark, ending at the hero
   panel. The title sits in two compact lines across the lower middle,
   sunset-stripe fill + deep-plum extruded shadow + fine cream keyline.
   Sample title "LAST EXIT / PARADISE", ribbon "ONE ROAD · FOUR ALIBIS ·
   NO WAY BACK." Why it wins: the top covers share the same decorative
   ingredients; a connected motif gives a memorable story and a clear
   reading path.
2. **The title as a physical sign.** Treat the title as a giant illuminated
   theatre/motel marquee sitting IN the scene, not text pasted on top. Thick
   condensed lettering, sunset bands clipped inside the letters, a dark
   dimensional side, cream outline, pink neon glow. A subtle perspective
   skew. It must stay legible in a small thumbnail; a soft dark fade behind
   it helps when the photo is busy.
3. **Face placement as the signature.** A large hero crop + smaller close-up
   and detail crops from the uploaded photo. The user sets a focal point per
   panel; automatic face suggestions + manual adjustment. Role tags anchored
   consistently to panel corners. The title lives in a reserved band BELOW
   the faces (never crossing eyes or mouths). A split two-line lockup: warm
   sunset fill above, pink script below, tagline in a narrow cream ribbon.
   The screenshot must prove every visible face is clear.
4. **Reflow, don't just crop, for every export shape.** One strong square
   master, then re-lay-out panels + title for portrait and widescreen (not
   just a crop of the square). The hero stays dominant in all three; move
   secondary panels, credits and barcode as needed. Title reflows: two
   lines in square, a narrower stacked lockup in portrait, a longer single
   line in widescreen. Never shrink it unreadable.

RECOMMENDATION: build the formula + idea 1 (route line) as the main edge,
with idea 3 (face-aware focal points, title never crossing faces) as the
functional proof. Idea 4 (true reflow per size) is the export-quality proof.
Skip idea 2 if time is short — the striped-chrome title already reads well.

## Screenshots (what the judge sees — make them excellent)

- `1-cover.jpg` (first by name = the cover, shown largest): the best exported
  cover, landscape 1920×1080 shown at ≤1280×720. Use the starter's sample
  photos (`app/samples/boulevard.jpg`, `pier.jpg` — AI-made, free to use)
  or generate your own AI photos. Multi-panel, giant striped-chrome title,
  script subtitle, role tags, stars + quote, billing block, barcode, seal.
- `2-editor.jpg`: the app in the browser with a photo loaded — editor UI,
  panels, controls, grades, crop handles.
- `3-cover.jpg`: a second exported cover in a different size (portrait
  1080×1350 shown at ≤1024×1280) proving the reflow.
- Optional 4th: the third size (square 1080×1080) or the grade/layout picker.
- The app supports `?shot=cover` / `?shot=editor` query params (see
  `app/src/shots.js` + `shots.json`) to render deterministic views for
  screenshots. Use them.
- Every screenshot ≤256 KiB, long side ≤1280, short side ≥480. Take them with
  the app's own export + a headless/desktop Chrome screenshot. NEVER edit,
  composite or borrow a cover.

## Build steps

1. Read the kit `RULES.txt` fully (especially the judge criteria, the dossier,
   and the screenshot rules) and the starter (`app/src/cover.js`, `main.js`,
   `shots.js`, `style.css`, `index.html`).
2. Replace the starter app with the full cover maker: canvas-based rendering
   (draw panels, title, subtitle, tags, top/bottom bars, grade), face-aware
   crop (manual focal points + a simple face heuristic; bundle no heavy
   detector — a manual focal point is the reliable path), grades (5–8
   sunset/neon presets via canvas filters/overlays), layouts (5–8 panel
   arrangements), roles (editable), 3-size PNG export (reflow per size,
   idea 4).
3. Fonts: use system/offline fonts only (no webfont fetch — it must work
   offline). Draw the striped-chrome title on canvas (gradient + stripe
   clipping + outline + glow). Script subtitle: use a cursive system font
   (e.g. "Brush Script MT", "Segoe Script", fallback cursive) — verify it
   renders in the test browser.
4. Serve locally (`node serve.ts`), open in desktop Chrome, load a sample
   photo, verify every panel/face/title, export all 3 sizes, take the 3–4
   screenshots, verify each is ≤256 KiB and within the size limits.
5. Run `main.ts` with `MAKEFUN_OUTPUT_DIR=out`, verify `dossier.json` builds
   and the gate caps hold (`app/` ≤48 MiB, ≤993 files; screenshots 3–4, each
   ≤256 KiB).
6. Commit + push to the GitHub repo. Verify the repo is public, `LICENSE` is
   MIT, About has the bounty URL + `makefun` topic, `.makefun/owner.json` is
   present.
7. STOP here and report back with the screenshots + the commit. DO NOT SUBMIT
   without an explicit go (rule: submit only on a go; after a server
   rejection, ask before resubmitting).

## Submit (only on an explicit go)

- The recording id is in `~/.makefun/recordings.json` (the recorder running
  for this build).
- `node <kit>/cli/makefun.mjs submit --competition gta6-cover-art-01 --repo-url https://github.com/ferdizi/gta6-cover-art-entry --commit <sha> --title "<name>" --recording <id> --repo ~/workspace/gta6-cover-art --keypair ~/workspace/makefun/makefun-keypair.json`
- `MAKEFUN_API_KEY` from `~/workspace/makefun/api-key.json` (export it; never
  print it). Minimal flags only.
- If REJECTED, do NOT resubmit — report the exact error and ask first.
