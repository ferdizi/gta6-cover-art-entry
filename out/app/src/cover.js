// Last Exit Paradise — cover renderer (round-3 rebuild, 2026-11-21).
// Paints a GTA 6-style multi-panel poster cover on a canvas: slanted
// gold-bordered photo panels, a glowing gold route line with numbered stops,
// a giant striped chrome title, pink script subtitle, tagline ribbon, press
// top bar, billing block, deterministic barcode and a gold BEST CAST seal.
// Pure canvas, no dependencies.

export const SIZES = {
  square: { w: 1080, h: 1080, label: 'Square 1080 × 1080' },
  portrait: { w: 1080, h: 1350, label: 'Portrait 1080 × 1350' },
  landscape: { w: 1920, h: 1080, label: 'Landscape 1920 × 1080' },
};

export const LAYOUTS = ['coast', 'strip', 'grid', 'duo', 'mosaic', 'cascade'];

export const GRADES = {
  sunset: { filter: 'saturate(1.25) contrast(1.08) sepia(0.18) hue-rotate(-8deg)', wash: '#ff7a2f', washAlpha: 0.10 },
  neon: { filter: 'saturate(1.65) contrast(1.12) hue-rotate(12deg)', wash: '#ff2e88', washAlpha: 0.10 },
  golden: { filter: 'sepia(0.35) saturate(1.35) contrast(1.05)', wash: '#ffb400', washAlpha: 0.10 },
  vice: { filter: 'saturate(1.45) hue-rotate(-28deg) contrast(1.06)', wash: '#c44dff', washAlpha: 0.11 },
  teal: { filter: 'saturate(1.1) hue-rotate(38deg) contrast(1.05)', wash: '#00c2a8', washAlpha: 0.09 },
  noir: { filter: 'grayscale(1) contrast(1.22) brightness(0.94)', wash: '#8a8a9a', washAlpha: 0.08 },
};

export const DEFAULT_ROLES = ['THE CAPTAIN', 'THE GETAWAY', 'THE DRIVER', 'THE BRAINS'];

export function defaultState() {
  return {
    layout: 'coast',
    grade: 'sunset',
    size: 'landscape',
    title: 'LAST EXIT\nPARADISE',
    subtitle: 'Paid in Sunsets',
    tagline: 'ONE ROAD · FOUR ALIBIS · NO WAY BACK',
    panels: [
      { role: 'THE CAPTAIN', photo: 'A', fx: 0.5, fy: 0.42 },
      { role: 'THE GETAWAY', photo: 'B', fx: 0.5, fy: 0.5 },
      { role: 'THE DRIVER', photo: 'A', fx: 0.35, fy: 0.45 },
      { role: 'THE BRAINS', photo: 'B', fx: 0.62, fy: 0.4 },
      { role: 'THE CAPTAIN', photo: 'A', fx: 0.5, fy: 0.55 },
    ],
  };
}

// ---- geometry ------------------------------------------------------------

// Panel rects as fractions of the panel area. Each layout gets a table per
// aspect class (wide covers vs tall covers); rects are [x, y, w, h].
const LAYOUT_TABLES = {
  coast: {
    wide: [
      [0, 0, 0.565, 1], [0.585, 0, 0.2, 0.49], [0.8, 0, 0.2, 0.49],
      [0.585, 0.51, 0.2, 0.49], [0.8, 0.51, 0.2, 0.49],
    ],
    tall: [
      [0, 0, 0.52, 1], [0.54, 0, 0.22, 0.49], [0.78, 0, 0.22, 0.49],
      [0.54, 0.51, 0.22, 0.49], [0.78, 0.51, 0.22, 0.49],
    ],
  },
  strip: {
    wide: [
      [0, 0, 0.34, 1], [0.355, 0, 0.148, 1], [0.518, 0, 0.148, 1],
      [0.681, 0, 0.148, 1], [0.844, 0, 0.148, 1],
    ],
    tall: [
      [0, 0, 1, 0.34], [0, 0.355, 1, 0.148], [0, 0.518, 1, 0.148],
      [0, 0.681, 1, 0.148], [0, 0.844, 1, 0.148],
    ],
  },
  grid: {
    wide: [
      [0, 0, 0.485, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.515, 0.323, 0.485],
      [0.338, 0.515, 0.323, 0.485], [0.677, 0.515, 0.323, 0.485],
    ],
    tall: [
      [0, 0, 0.58, 0.5], [0.6, 0, 0.4, 0.5], [0, 0.515, 0.323, 0.485],
      [0.338, 0.515, 0.323, 0.485], [0.677, 0.515, 0.323, 0.485],
    ],
  },
  duo: {
    wide: [
      [0, 0, 0.6, 1], [0.62, 0, 0.38, 0.32], [0.62, 0.34, 0.185, 0.32],
      [0.815, 0.34, 0.185, 0.32], [0.62, 0.68, 0.38, 0.32],
    ],
    tall: [
      [0, 0, 1, 0.6], [0, 0.62, 0.38, 0.38], [0.4, 0.62, 0.185, 0.38],
      [0.6, 0.62, 0.185, 0.38], [0.8, 0.62, 0.2, 0.38],
    ],
  },
  mosaic: {
    wide: [
      [0.24, 0.08, 0.52, 0.84], [0, 0, 0.22, 0.44], [0.78, 0, 0.22, 0.44],
      [0, 0.56, 0.22, 0.44], [0.78, 0.56, 0.22, 0.44],
    ],
    tall: [
      [0.18, 0.24, 0.64, 0.52], [0, 0, 0.4, 0.22], [0.6, 0, 0.4, 0.22],
      [0, 0.78, 0.4, 0.22], [0.6, 0.78, 0.4, 0.22],
    ],
  },
  cascade: {
    wide: [
      [0, 0, 0.4, 0.55], [0.42, 0.08, 0.28, 0.5], [0.72, 0.16, 0.28, 0.5],
      [0.06, 0.62, 0.42, 0.38], [0.52, 0.68, 0.48, 0.32],
    ],
    tall: [
      [0, 0, 0.55, 0.4], [0.08, 0.42, 0.5, 0.28], [0.16, 0.72, 0.5, 0.28],
      [0.62, 0.06, 0.38, 0.42], [0.68, 0.52, 0.32, 0.48],
    ],
  },
};

export function panelArea(w, h) {
  const topBarH = Math.round(h * 0.075);
  const bottomBarH = Math.round(h * 0.085);
  const margin = Math.round(w * 0.02);
  return {
    x: margin,
    y: topBarH + Math.round(margin * 0.5),
    w: w - margin * 2,
    h: h - topBarH - bottomBarH - Math.round(margin * 1.5),
    topBarH,
    bottomBarH,
    margin,
  };
}

// Rects for the current size + layout, in cover coordinates. Each rect also
// carries its slant (top edge shifted right) for the comic-frame lean.
export function layoutPanels(sizeName, layoutName) {
  const { w, h } = SIZES[sizeName] || SIZES.landscape;
  const area = panelArea(w, h);
  const aspect = w >= h ? 'wide' : 'tall';
  const table = (LAYOUT_TABLES[layoutName] || LAYOUT_TABLES.coast)[aspect];
  const slant = Math.max(4, Math.round(h * 0.012));
  return table.map(([fx, fy, fw, fh]) => ({
    x: area.x + fx * area.w,
    y: area.y + fy * area.h,
    w: fw * area.w,
    h: fh * area.h,
    slant,
  }));
}

function slantPath(ctx, r) {
  ctx.beginPath();
  ctx.moveTo(r.x + r.slant, r.y);
  ctx.lineTo(r.x + r.w + r.slant, r.y);
  ctx.lineTo(r.x + r.w, r.y + r.h);
  ctx.lineTo(r.x, r.y + r.h);
  ctx.closePath();
}

// Cover-fit source rect for an image inside a panel, centred on (fx, fy).
function coverFitRect(imgW, imgH, pw, ph, fx, fy) {
  const scale = Math.max(pw / imgW, ph / imgH);
  const sw = pw / scale;
  const sh = ph / scale;
  let sx = fx * imgW - sw / 2;
  let sy = fy * imgH - sh / 2;
  sx = Math.max(0, Math.min(imgW - sw, sx));
  sy = Math.max(0, Math.min(imgH - sh, sy));
  return { sx, sy, sw, sh };
}

// ---- small drawing helpers ------------------------------------------------

function drawStar(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = r * 0.7;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function hashSeed(text) {
  let s = 2166136261;
  for (let i = 0; i < text.length; i++) {
    s ^= text.charCodeAt(i);
    s = Math.imul(s, 16777619);
  }
  return s >>> 0;
}

// ---- panels ---------------------------------------------------------------

function drawPanel(ctx, img, rect, panel, grade) {
  const g = GRADES[grade] || GRADES.sunset;
  ctx.save();
  slantPath(ctx, rect);
  ctx.clip();
  if (img) {
    const src = coverFitRect(img.naturalWidth || img.width, img.naturalHeight || img.height, rect.w, rect.h, panel.fx, panel.fy);
    ctx.filter = g.filter;
    ctx.drawImage(img, src.sx, src.sy, src.sw, src.sh, rect.x, rect.y, rect.w, rect.h);
    ctx.filter = 'none';
    ctx.globalAlpha = g.washAlpha;
    ctx.fillStyle = g.wash;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = 1;
  } else {
    const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
    grad.addColorStop(0, '#3a1440');
    grad.addColorStop(1, '#12060f');
    ctx.fillStyle = grad;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.fillStyle = '#d9a8c2';
    ctx.font = `600 ${Math.max(12, rect.w * 0.04)}px Oswald, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('NO PHOTO', rect.x + rect.w / 2, rect.y + rect.h / 2);
  }
  ctx.restore();
  // Gold border on the slanted frame.
  ctx.save();
  slantPath(ctx, rect);
  ctx.strokeStyle = '#f7c948';
  ctx.lineWidth = Math.max(2, rect.w * 0.008);
  ctx.shadowColor = '#f7c948';
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.restore();
  // Role tag, top-left corner of the panel.
  const tagSize = Math.max(11, Math.round(rect.w * 0.045));
  ctx.save();
  ctx.font = `700 ${tagSize}px Oswald, sans-serif`;
  const label = panel.role || '';
  const tw = ctx.measureText(label).width;
  const padX = tagSize * 0.5;
  const bx = rect.x + rect.slant + 4;
  const by = rect.y + 4;
  ctx.fillStyle = 'rgba(10, 4, 12, 0.88)';
  ctx.fillRect(bx, by, tw + padX * 2, tagSize * 1.7);
  ctx.fillStyle = '#ffe9a8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, bx + padX, by + tagSize * 0.88);
  ctx.restore();
}

// ---- title ----------------------------------------------------------------

// Fits the title lines to the cover width and returns the drawing metrics.
function titleMetrics(ctx, w, h, lines) {
  const stretch = 1.45;
  let size = Math.round(h * 0.14);
  const measure = (px) => {
    ctx.font = `${px}px Anton, sans-serif`;
    return Math.max(...lines.map((ln) => ctx.measureText(ln).width)) * stretch;
  };
  while (size > 40 && measure(size) > w * 0.94) size -= 4;
  const widths = lines.map((ln) => {
    ctx.font = `${size}px Anton, sans-serif`;
    return ctx.measureText(ln).width * stretch;
  });
  return { size, stretch, widths, maxWidth: Math.max(...widths) };
}

// Title plan (metrics + box) without drawing — the route line needs the box
// first so it can dodge the title, and the title is painted over the line.
function measureTitleBox(ctx, w, h, state) {
  const lines = state.title.split('\n').map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return null;
  const m = titleMetrics(ctx, w, h, lines);
  const lineH = m.size * 0.9;
  const blockH = lines.length * lineH;
  const aspect = w > h ? 'wide' : w < h ? 'tall' : 'square';
  const topY = h * (aspect === 'wide' ? 0.52 : aspect === 'tall' ? 0.54 : 0.55);
  return {
    lines, m, lineH, blockH, topY, cx: w / 2,
    box: {
      x: w / 2 - m.maxWidth / 2,
      y: topY - m.size * 0.08,
      w: m.maxWidth,
      h: blockH + m.size * 0.12,
      size: m.size,
      bottom: topY + blockH,
    },
  };
}

function drawChromeTitle(ctx, w, h, state, area, plan) {
  if (!plan) return null;
  const { lines, m, lineH, blockH, topY, cx } = plan;

  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const o = off.getContext('2d');
  const drawLines = (dx, dy, color) => {
    o.fillStyle = color;
    lines.forEach((ln, i) => {
      o.save();
      o.translate(cx + dx, topY + i * lineH + dx * 0 + dy);
      o.scale(m.stretch, 1);
      o.font = `${m.size}px Anton, sans-serif`;
      o.textAlign = 'center';
      o.textBaseline = 'top';
      o.fillText(ln, 0, 0);
      o.restore();
    });
  };
  // Plum extrusion, offset down-right.
  drawLines(m.size * 0.035, m.size * 0.055, '#3d0a2e');
  // Main letter bodies in white (the mask for the gradient).
  drawLines(0, 0, '#ffffff');
  // Sunset gradient clipped to the letters: 'source-in' over the FULL canvas.
  o.globalCompositeOperation = 'source-in';
  const grad = o.createLinearGradient(0, topY, 0, topY + blockH);
  grad.addColorStop(0, '#ffe14d');
  grad.addColorStop(0.35, '#ff9a2f');
  grad.addColorStop(0.65, '#ff5e3a');
  grad.addColorStop(1, '#ff2e88');
  o.fillStyle = grad;
  o.fillRect(0, 0, w, h);
  // Sunset stripes clipped to the letters: 'source-atop' over the FULL canvas.
  // (Never 'source-in' + a partial fillRect — that erases everything outside it.)
  o.globalCompositeOperation = 'source-atop';
  const band = Math.max(6, Math.round(m.size * 0.16));
  o.fillStyle = 'rgba(255, 255, 255, 0.22)';
  for (let y = topY; y < topY + blockH; y += band * 2) {
    o.fillRect(0, y, w, band);
  }
  o.globalCompositeOperation = 'source-over';

  // Neon glow + paste onto the cover.
  ctx.save();
  ctx.shadowColor = '#ff2e88';
  ctx.shadowBlur = Math.round(h * 0.02);
  ctx.drawImage(off, 0, 0);
  ctx.restore();
  // Cream keyline (plum under-stroke first, then cream) around the letters.
  lines.forEach((ln, i) => {
    ctx.save();
    ctx.translate(cx, topY + i * lineH);
    ctx.scale(m.stretch, 1);
    ctx.font = `${m.size}px Anton, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3d0a2e';
    ctx.lineWidth = Math.max(3, m.size * 0.03);
    ctx.strokeText(ln, 0, 0);
    ctx.strokeStyle = '#fff3c4';
    ctx.lineWidth = Math.max(2, m.size * 0.014);
    ctx.strokeText(ln, 0, 0);
    ctx.restore();
  });

  return plan.box;
}

// ---- furniture ------------------------------------------------------------

function drawTopBar(ctx, w, area) {
  const h = area.topBarH;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#2b0a2e');
  grad.addColorStop(1, '#1a0618');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  // Five gold stars, left.
  const r = h * 0.3;
  for (let i = 0; i < 5; i++) {
    drawStar(ctx, area.margin + r + i * r * 2.4, h / 2, r, '#f7c948');
  }
  // VOL. 1 badge, right (measured first so the quote can fit around it).
  ctx.font = `700 ${Math.round(h * 0.32)}px Oswald, sans-serif`;
  const label = 'VOL. 1';
  const tw = ctx.measureText(label).width;
  const bx = w - area.margin - tw - h * 0.36;
  // Press quote, centred in the space between the stars and the badge.
  const starsRight = area.margin + (h * 0.3) * 11.6;
  const quote = '\u201CTHE HOTTEST RIDE OF THE YEAR\u201D \u2014 GOLDEN MILE GAZETTE';
  let qSize = Math.round(h * 0.34);
  ctx.font = `700 ${qSize}px Oswald, sans-serif`;
  const avail = bx - starsRight - h * 0.4;
  while (qSize > 12 && ctx.measureText(quote).width > avail) {
    qSize -= 1;
    ctx.font = `700 ${qSize}px Oswald, sans-serif`;
  }
  ctx.fillStyle = '#ffe9a8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(quote, (starsRight + bx) / 2, h / 2 + 1);
  ctx.font = `700 ${Math.round(h * 0.32)}px Oswald, sans-serif`;
  ctx.strokeStyle = '#f7c948';
  ctx.lineWidth = Math.max(1.5, h * 0.03);
  ctx.strokeRect(bx, h * 0.2, tw + h * 0.36, h * 0.6);
  ctx.fillStyle = '#f7c948';
  ctx.fillText(label, bx + (tw + h * 0.36) / 2, h / 2 + 1);
}

function drawBottomBar(ctx, w, h, area, state) {
  const y = h - area.bottomBarH;
  ctx.fillStyle = '#241028';
  ctx.fillRect(0, y, w, area.bottomBarH);
  ctx.fillStyle = '#ffe9a8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const l1 = Math.round(area.bottomBarH * 0.2);
  const l2 = Math.round(area.bottomBarH * 0.17);
  ctx.font = `600 ${l1}px Oswald, sans-serif`;
  ctx.fillText('A GOLDEN MILE PICTURE  ·  IN ASSOCIATION WITH PALMINE STUDIOS', area.margin, y + area.bottomBarH * 0.32);
  ctx.font = `400 ${l2}px Oswald, sans-serif`;
  ctx.fillStyle = '#d9a8c2';
  ctx.fillText('LAST EXIT PARADISE  ·  COMING SOON  ·  A COASTAL GETAWAY IN FIVE STOPS', area.margin, y + area.bottomBarH * 0.68);
  // Deterministic barcode, seeded from the title.
  const seed = hashSeed(state.title + state.tagline);
  let rand = seed;
  const next = () => {
    rand = (Math.imul(rand, 1664525) + 1013904223) >>> 0;
    return rand / 4294967296;
  };
  const bx = w * 0.78;
  const bw = w * 0.13;
  const bh = area.bottomBarH * 0.55;
  const by = y + (area.bottomBarH - bh) / 2;
  ctx.fillStyle = '#ffffff';
  let x = bx;
  while (x < bx + bw) {
    const bwBar = 1 + Math.floor(next() * 4) * (w / 1920);
    const gap = (1 + next() * 3) * (w / 1920);
    if (next() > 0.3) ctx.fillRect(x, by, Math.max(1, bwBar), bh);
    x += Math.max(2, bwBar + gap);
  }
  // Gold BEST CAST seal, far right.
  const sr = area.bottomBarH * 0.46;
  const scx = w - area.margin - sr;
  const scy = y + area.bottomBarH / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(scx, scy, sr, 0, Math.PI * 2);
  ctx.fillStyle = '#f7c948';
  ctx.fill();
  ctx.lineWidth = Math.max(1.5, sr * 0.08);
  ctx.strokeStyle = '#7a5b00';
  ctx.beginPath();
  ctx.arc(scx, scy, sr * 0.78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#3d0a2e';
  ctx.font = `700 ${Math.round(sr * 0.42)}px Oswald, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('BEST', scx, scy - sr * 0.08);
  ctx.fillText('CAST', scx, scy + sr * 0.38);
  ctx.restore();
}

function drawRoute(ctx, rects, titleBox) {
  const pts = rects.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h }));
  const inside = (p) => titleBox
    && p.x > titleBox.x - 6 && p.x < titleBox.x + titleBox.w + 6
    && p.y > titleBox.y - 6 && p.y < titleBox.y + titleBox.h + 6;
  const stops = pts.map((p, i) => {
    if (inside(p)) {
      const r = rects[i];
      return { x: r.x + r.w - 14, y: r.y + 16 };
    }
    return p;
  });
  ctx.save();
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = Math.max(2, 3);
  ctx.shadowColor = '#ffd94d';
  ctx.shadowBlur = 10;
  // Gentle sag between stops: a quadratic bowed slightly below each chord.
  // (Bowing toward the previous stop made big loops on tall covers.)
  ctx.beginPath();
  ctx.moveTo(stops[0].x, stops[0].y);
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1];
    const b = stops[i];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const sag = Math.min(20, dist * 0.06);
    ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + sag, b.x, b.y);
  }
  ctx.stroke();
  ctx.restore();
  stops.forEach((p, i) => {
    const r = 13;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1033';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffd94d';
    ctx.stroke();
    ctx.fillStyle = '#ffe9a8';
    ctx.font = `700 ${Math.round(r * 1.05)}px Oswald, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), p.x, p.y + 1);
    ctx.restore();
  });
}

function drawSubtitleAndRibbon(ctx, w, h, state, titleBox) {
  const base = titleBox ? titleBox.bottom : h * 0.72;
  const subSize = Math.round((titleBox ? titleBox.size : h * 0.15) * 0.34);
  const subY = base + subSize * 0.55;
  ctx.save();
  ctx.font = `${subSize}px Pacifico, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff2e88';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#ff7ab8';
  ctx.fillText(state.subtitle, w / 2, subY);
  ctx.restore();
  // Cream tagline ribbon with slanted ends.
  const tagSize = Math.max(12, Math.round(h * 0.02));
  ctx.save();
  ctx.font = `700 ${tagSize}px Oswald, sans-serif`;
  const tw = ctx.measureText(state.tagline).width;
  const pad = tagSize * 1.4;
  const bw = tw + pad * 2;
  const bh = tagSize * 2.1;
  const bx = (w - bw) / 2;
  const by = subY + subSize * 0.5;
  const slant = 12;
  ctx.beginPath();
  ctx.moveTo(bx + slant, by);
  ctx.lineTo(bx + bw, by);
  ctx.lineTo(bx + bw - slant, by + bh);
  ctx.lineTo(bx, by + bh);
  ctx.closePath();
  ctx.fillStyle = '#ffe9a8';
  ctx.fill();
  ctx.fillStyle = '#3d0a2e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.tagline, w / 2, by + bh / 2 + 1);
  ctx.restore();
}

// ---- main entry -----------------------------------------------------------

export function drawCover(canvas, photos, state) {
  const { w, h } = SIZES[state.size] || SIZES.landscape;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  // Sunset background: deep plum up top, orange at the bottom.
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#2a0a33');
  bg.addColorStop(0.45, '#7a1e5c');
  bg.addColorStop(0.75, '#ff7a2f');
  bg.addColorStop(1, '#ffb347');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const area = panelArea(w, h);
  const rects = layoutPanels(state.size, state.layout);
  state.panels.forEach((panel, i) => {
    const img = photos ? photos[panel.photo] : null;
    drawPanel(ctx, img, rects[i], panel, state.grade);
  });
  const titlePlan = measureTitleBox(ctx, w, h, state);
  const titleBox = titlePlan ? titlePlan.box : null;
  drawRoute(ctx, rects, titleBox);
  drawChromeTitle(ctx, w, h, state, area, titlePlan);
  drawSubtitleAndRibbon(ctx, w, h, state, titleBox);
  drawTopBar(ctx, w, area);
  drawBottomBar(ctx, w, h, area, state);

  canvas._panels = rects;
  canvas._titleBox = titleBox;
  canvas._area = area;
  return canvas;
}

export function exportCover(size, photos, state) {
  const canvas = document.createElement('canvas');
  const next = { ...state, size, panels: state.panels.map((p) => ({ ...p })) };
  return drawCover(canvas, photos, next);
}
