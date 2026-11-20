// Last Exit Paradise — cover renderer (rebuild, 2026-11-21, session gta6-cover-art-01 rebuild).
// Draws a GTA 6-style multi-panel poster cover on canvas: slanted gold-bordered
// photo panels, a glowing gold route line with numbered stops, a giant striped
// chrome title, pink script subtitle, tagline ribbon, press top bar, billing
// block, deterministic barcode and a gold BEST CAST seal. Pure canvas, no deps.
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
    roles: [...DEFAULT_ROLES],
    // per panel: which photo slot (A/B) and focal point in photo coords 0..1
    panels: [
      { photo: 'A', fx: 0.5, fy: 0.42 },
      { photo: 'B', fx: 0.5, fy: 0.5 },
      { photo: 'A', fx: 0.35, fy: 0.45 },
      { photo: 'B', fx: 0.62, fy: 0.4 },
      { photo: 'A', fx: 0.5, fy: 0.55 },
    ],
  };
}

// Panel rects in fractions of the canvas. Hero + 4 small panels in every layout.
function layoutRects(layout) {
  switch (layout) {
    case 'strip': return [
      [0.03, 0.09, 0.94, 0.40],
      [0.03, 0.51, 0.225, 0.36],
      [0.27, 0.51, 0.225, 0.36],
      [0.51, 0.51, 0.225, 0.36],
      [0.75, 0.51, 0.22, 0.36],
    ];
    case 'grid': return [
      [0.03, 0.09, 0.47, 0.38],
      [0.52, 0.09, 0.45, 0.38],
      [0.03, 0.49, 0.30, 0.38],
      [0.35, 0.49, 0.30, 0.38],
      [0.67, 0.49, 0.30, 0.38],
    ];
    case 'duo': return [
      [0.03, 0.09, 0.46, 0.52],
      [0.51, 0.09, 0.46, 0.52],
      [0.03, 0.63, 0.30, 0.24],
      [0.35, 0.63, 0.30, 0.24],
      [0.67, 0.63, 0.30, 0.24],
    ];
    case 'mosaic': return [
      [0.03, 0.09, 0.60, 0.44],
      [0.65, 0.09, 0.32, 0.22],
      [0.65, 0.33, 0.32, 0.20],
      [0.03, 0.55, 0.30, 0.32],
      [0.35, 0.55, 0.62, 0.32],
    ];
    case 'cascade': return [
      [0.03, 0.09, 0.55, 0.42],
      [0.14, 0.53, 0.40, 0.34],
      [0.56, 0.09, 0.41, 0.30],
      [0.56, 0.41, 0.41, 0.30],
      [0.03, 0.53, 0.09, 0.34],
    ];
    case 'coast':
    default: return [
      [0.03, 0.09, 0.54, 0.78],
      [0.59, 0.09, 0.38, 0.36],
      [0.59, 0.47, 0.185, 0.40],
      [0.785, 0.47, 0.185, 0.40],
      [0.59, 0.09, 0.38, 0.36], // placeholder replaced below (kept 5 panels)
    ];
  }
}

export function layoutPanels(layout, W, H) {
  let rects = layoutRects(layout);
  if (layout === 'coast') {
    // coast: hero left, 2x2 small grid right (hero + 4 small = 5 panels)
    rects = [
      [0.03, 0.09, 0.54, 0.78],
      [0.59, 0.09, 0.185, 0.36],
      [0.785, 0.09, 0.185, 0.36],
      [0.59, 0.47, 0.185, 0.40],
      [0.785, 0.47, 0.185, 0.40],
    ];
  }
  return rects.map(([fx, fy, fw, fh], i) => ({
    index: i,
    x: fx * W, y: fy * H, w: fw * W, h: fh * H,
    slant: Math.max(6, W * 0.012),
  }));
}

function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawPhotoCover(ctx, img, dx, dy, dw, dh, fx, fy, filter) {
  if (!img || !img.naturalWidth) {
    const g = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh);
    g.addColorStop(0, '#ff9a3d'); g.addColorStop(0.5, '#ff5e7a'); g.addColorStop(1, '#7a2ea6');
    ctx.fillStyle = g; ctx.fillRect(dx, dy, dw, dh);
    return;
  }
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale, sh = dh / scale;
  let sx = fx * iw - sw / 2, sy = fy * ih - sh / 2;
  sx = Math.max(0, Math.min(iw - sw, sx));
  sy = Math.max(0, Math.min(ih - sh, sy));
  ctx.save();
  if (filter) ctx.filter = filter;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
}

function slantedPath(ctx, p) {
  const s = p.slant;
  ctx.beginPath();
  ctx.moveTo(p.x + s, p.y);
  ctx.lineTo(p.x + p.w, p.y);
  ctx.lineTo(p.x + p.w - s, p.y + p.h);
  ctx.lineTo(p.x, p.y + p.h);
  ctx.closePath();
}

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Title geometry, recomputed per export size (true reflow, not a crop).
function titleLayout(W, H, sizeName, titleText) {
  const lines = titleText.split('\n').map((s) => s.trim()).filter(Boolean);
  const isWide = sizeName === 'landscape';
  let useLines = lines;
  if (isWide && lines.length > 1) useLines = [lines.join(' ')];
  const bandH = H * (isWide ? 0.20 : 0.26);
  const bandY = H * (isWide ? 0.57 : 0.56);
  const maxW = W * 0.92;
  let size = Math.min(bandH / useLines.length * 1.05, W * 0.16);
  // shrink until the longest line fits
  const meas = document.createElement('canvas').getContext('2d');
  for (let guard = 0; guard < 40; guard++) {
    meas.font = `${size}px Anton, 'Arial Narrow', sans-serif`;
    const widest = Math.max(...useLines.map((l) => meas.measureText(l).width));
    if (widest <= maxW || size < 10) break;
    size *= 0.94;
  }
  const lineH = size * 0.98;
  const totalH = lineH * useLines.length;
  return { lines: useLines, size, lineH, x: W / 2, y: bandY + (bandH - totalH) / 2, w: maxW, h: bandH, bandY, bandH };
}

export function drawCover(canvas, photos, state) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  const grade = GRADES[state.grade] || GRADES.sunset;
  const panels = layoutPanels(state.layout, W, H);

  // Sunset sky background.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2b0f3d'); bg.addColorStop(0.45, '#a62b5e');
  bg.addColorStop(0.75, '#ff7a2f'); bg.addColorStop(1, '#ffc46b');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // Sun disc glow behind the panels.
  const sun = ctx.createRadialGradient(W * 0.72, H * 0.30, 10, W * 0.72, H * 0.30, W * 0.42);
  sun.addColorStop(0, 'rgba(255,220,120,0.85)'); sun.addColorStop(1, 'rgba(255,220,120,0)');
  ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);

  // Panels.
  panels.forEach((p, i) => {
    const spec = (state.panels && state.panels[i]) || { photo: 'A', fx: 0.5, fy: 0.45 };
    const img = photos ? photos[spec.photo] : null;
    ctx.save();
    slantedPath(ctx, p); ctx.clip();
    drawPhotoCover(ctx, img, p.x, p.y, p.w, p.h, spec.fx, spec.fy, grade.filter);
    ctx.fillStyle = grade.wash; ctx.globalAlpha = grade.washAlpha;
    ctx.fillRect(p.x, p.y, p.w, p.h); ctx.globalAlpha = 1;
    // bottom shade so role tags stay legible
    const sh = ctx.createLinearGradient(0, p.y + p.h * 0.6, 0, p.y + p.h);
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = sh; ctx.fillRect(p.x, p.y + p.h * 0.6, p.w, p.h * 0.4);
    ctx.restore();
    // Gold slanted border.
    ctx.save();
    slantedPath(ctx, p);
    ctx.strokeStyle = '#f7c948'; ctx.lineWidth = Math.max(2, W * 0.003);
    ctx.shadowColor = 'rgba(247,201,72,0.7)'; ctx.shadowBlur = W * 0.006;
    ctx.stroke(); ctx.restore();
    // Role tag, top-left of the panel (bottom corners sit in the title /
    // subtitle zone, where a tag would be covered by the lettering).
    const role = (state.roles && state.roles[i % state.roles.length]) || DEFAULT_ROLES[i % 4];
    const fs = Math.max(11, Math.round(W * 0.011));
    ctx.font = `700 ${fs}px Oswald, sans-serif`;
    const tw = ctx.measureText(role).width;
    const pad = fs * 0.55;
    const tx = p.x + Math.max(6, W * 0.008), ty = p.y + fs * 0.9;
    ctx.fillStyle = 'rgba(10,5,18,0.88)';
    ctx.fillRect(tx - pad * 0.5, ty - fs * 0.85, tw + pad, fs * 1.5);
    ctx.fillStyle = '#ffe9a8'; ctx.textBaseline = 'middle';
    ctx.fillText(role, tx, ty + fs * 0.05);
  });

  // Title geometry (measured now, used by the route line + the title itself).
  const tl = titleLayout(W, H, state.size, state.title);
  const titleBox = { x: tl.x - tl.w / 2, y: tl.y - tl.size * 0.15, w: tl.w, h: tl.lineH * tl.lines.length + tl.size * 0.3 };

  // Golden route line joining the bottom edges of the panels, stops 1-5.
  const stops = panels.map((p) => ({ x: p.x + p.w / 2, y: p.y + p.h, panel: p }));
  const adjusted = stops.map((s, i) => {
    const inside = s.x > titleBox.x - 10 && s.x < titleBox.x + titleBox.w + 10 &&
      s.y > titleBox.y - 10 && s.y < titleBox.y + titleBox.h + 10;
    if (inside) return { x: s.panel.x + s.panel.w - W * 0.02, y: s.panel.y + H * 0.02, moved: true };
    return { ...s, moved: false };
  });
  ctx.save();
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = Math.max(2, W * 0.0028);
  ctx.shadowColor = '#ffbf00'; ctx.shadowBlur = W * 0.012; ctx.lineJoin = 'round';
  ctx.beginPath();
  adjusted.forEach((s, i) => { if (i === 0) ctx.moveTo(s.x, s.y); else { const p = adjusted[i - 1]; ctx.quadraticCurveTo((p.x + s.x) / 2, Math.min(p.y, s.y) - H * 0.03, s.x, s.y); } });
  ctx.stroke(); ctx.restore();
  adjusted.forEach((s, i) => {
    ctx.save();
    ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(9, W * 0.011), 0, Math.PI * 2);
    ctx.fillStyle = '#1b0b2e'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = '#ffd94d'; ctx.stroke();
    ctx.fillStyle = '#ffe9a8'; ctx.font = `700 ${Math.max(11, W * 0.011)}px Oswald, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), s.x, s.y + 1);
    ctx.restore();
  });

  // Chrome title on its own full-size canvas.
  // CRITICAL: 'source-in' with a PARTIAL fillRect erases everything outside
  // the rect. So the gradient fill and the stripe fills both cover the WHOLE
  // canvas; 'source-in' / 'source-atop' clip them to the existing letters.
  const tc = document.createElement('canvas'); tc.width = W; tc.height = H;
  const t = tc.getContext('2d');
  t.textAlign = 'center'; t.textBaseline = 'top';
  t.font = `${tl.size}px Anton, 'Arial Narrow', sans-serif`;
  // Plum extrusion, stacked below-right.
  t.fillStyle = '#4a1042';
  const ext = Math.max(3, tl.size * 0.07);
  for (let k = 5; k >= 1; k--) {
    tl.lines.forEach((line, li) => t.fillText(line, tl.x + (ext * k) / 5, tl.y + li * tl.lineH + (ext * k) / 5));
  }
  // Solid letter shapes, then gradient clipped inside them.
  t.fillStyle = '#ffffff';
  tl.lines.forEach((line, li) => t.fillText(line, tl.x, tl.y + li * tl.lineH));
  t.globalCompositeOperation = 'source-in';
  const grad = t.createLinearGradient(0, tl.y, 0, tl.y + tl.lineH * tl.lines.length);
  grad.addColorStop(0, '#ffe95e'); grad.addColorStop(0.45, '#ff9a1f');
  grad.addColorStop(0.75, '#ff4d6d'); grad.addColorStop(1, '#ff7ad9');
  t.fillStyle = grad; t.fillRect(0, 0, W, H);
  // Sunset stripes, clipped to the letters via 'source-atop' (full canvas).
  t.globalCompositeOperation = 'source-atop';
  const stripeH = Math.max(3, tl.size * 0.09);
  t.fillStyle = 'rgba(255,255,255,0.55)';
  for (let y = tl.y + tl.size * 0.22; y < tl.y + tl.lineH * tl.lines.length; y += stripeH * 3) {
    t.fillRect(0, y, W, stripeH);
  }
  t.fillStyle = 'rgba(60,10,60,0.28)';
  for (let y = tl.y + tl.size * 0.55; y < tl.y + tl.lineH * tl.lines.length; y += stripeH * 3) {
    t.fillRect(0, y, W, stripeH * 0.8);
  }
  t.globalCompositeOperation = 'source-over';
  // Cream keyline around the letters.
  t.strokeStyle = '#fff3d6'; t.lineWidth = Math.max(1.5, tl.size * 0.022);
  t.lineJoin = 'round';
  tl.lines.forEach((line, li) => t.strokeText(line, tl.x, tl.y + li * tl.lineH));
  ctx.save();
  ctx.shadowColor = 'rgba(255,80,160,0.55)'; ctx.shadowBlur = W * 0.02;
  ctx.drawImage(tc, 0, 0);
  ctx.restore();

  // Pink script subtitle.
  const subSize = Math.max(20, tl.size * 0.34);
  ctx.save();
  ctx.font = `${subSize}px Pacifico, cursive`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(255,46,136,0.8)'; ctx.shadowBlur = W * 0.012;
  ctx.fillStyle = '#ff8fc7';
  ctx.fillText(state.subtitle || 'Paid in Sunsets', W / 2, tl.y + tl.lineH * tl.lines.length + subSize * 0.15);
  ctx.restore();

  // Tagline ribbon.
  const ribY = tl.y + tl.lineH * tl.lines.length + subSize * 1.12;
  const ribFs = Math.max(12, Math.round(W * 0.013));
  ctx.font = `700 ${ribFs}px Oswald, sans-serif`;
  const ribText = state.tagline || '';
  const ribW = ctx.measureText(ribText).width + ribFs * 3;
  const ribX = (W - ribW) / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(255,243,214,0.96)';
  ctx.beginPath();
  ctx.moveTo(ribX + ribFs * 0.6, ribY); ctx.lineTo(ribX + ribW - ribFs * 0.6, ribY);
  ctx.lineTo(ribX + ribW, ribY + ribFs * 1.7); ctx.lineTo(ribX + ribFs * 0.6, ribY + ribFs * 1.7);
  ctx.lineTo(ribX, ribY + ribFs * 1.7); ctx.lineTo(ribX, ribY); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7a1e4d'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(ribText, W / 2, ribY + ribFs * 0.88);
  ctx.restore();

  // Top bar: 5 gold stars + press quote + VOL. 1 badge.
  const topY = H * 0.045;
  const starR = Math.max(8, W * 0.011);
  const quoteFs = Math.max(12, Math.round(W * 0.0135));
  ctx.save();
  ctx.fillStyle = 'rgba(12,4,24,0.55)'; ctx.fillRect(0, 0, W, H * 0.075);
  for (let i = 0; i < 5; i++) {
    const cx = W * 0.05 + i * starR * 2.6;
    ctx.fillStyle = '#ffd94d'; ctx.shadowColor = '#ffbf00'; ctx.shadowBlur = 6;
    starPath(ctx, cx, topY, starR); ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff3d6'; ctx.font = `700 ${quoteFs}px Oswald, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('“THE HOTTEST RIDE OF THE YEAR” — GOLDEN MILE GAZETTE', W * 0.52, topY);
  ctx.textAlign = 'right';
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 1.5;
  const badge = 'VOL. 1';
  const bw = ctx.measureText(badge).width + quoteFs * 1.4;
  ctx.strokeRect(W - bw - W * 0.02, topY - quoteFs * 0.85, bw, quoteFs * 1.7);
  ctx.fillText(badge, W - W * 0.02 - quoteFs * 0.7, topY);
  ctx.restore();

  // Bottom billing block + barcode + gold seal.
  const botY = H - H * 0.065;
  ctx.save();
  ctx.fillStyle = 'rgba(12,4,24,0.62)'; ctx.fillRect(0, botY - H * 0.012, W, H * 0.077);
  ctx.fillStyle = '#ffe9a8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const billFs = Math.max(10, Math.round(W * 0.0105));
  ctx.font = `600 ${billFs}px Oswald, sans-serif`;
  ctx.fillText('A GOLDEN MILE PICTURE  ·  IN ASSOCIATION WITH PALMINE STUDIOS', W * 0.03, botY + H * 0.008);
  ctx.font = `400 ${billFs * 0.9}px Oswald, sans-serif`;
  ctx.fillStyle = '#ffd9ec';
  ctx.fillText('LAST EXIT PARADISE  ·  COMING SOON  ·  A COASTAL GETAWAY IN FIVE STOPS', W * 0.03, botY + H * 0.032);
  // Deterministic barcode from the title.
  const seed = hashStr(state.title + '|last-exit-paradise');
  let bx = W * 0.80, bw2 = 0;
  let s = seed;
  for (let i = 0; i < 48; i++) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const wdt = (1 + (s % 3)) * (W * 0.0016);
    const gap = (s >> 3) % 2 === 0 ? W * 0.0009 : W * 0.0018;
    if ((s >> 5) % 3 !== 0) { ctx.fillStyle = '#fff3d6'; ctx.fillRect(bx, botY - H * 0.004, wdt, H * 0.038); }
    bx += wdt + gap; bw2 = bx;
  }
  // Gold seal.
  const sealR = Math.max(22, W * 0.028);
  const scx = W * 0.955, scy = botY + H * 0.018;
  ctx.beginPath(); ctx.arc(scx, scy, sealR, 0, Math.PI * 2);
  ctx.fillStyle = '#f7c948'; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = '#8a5a00'; ctx.stroke();
  ctx.beginPath(); ctx.arc(scx, scy, sealR * 0.78, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#5a2a00'; ctx.textAlign = 'center';
  ctx.font = `700 ${Math.max(8, sealR * 0.24)}px Oswald, sans-serif`;
  ctx.fillText('BEST', scx, scy - sealR * 0.18);
  ctx.fillText('CAST', scx, scy + sealR * 0.22);
  ctx.restore();

  return { panels, titleBox, stops: adjusted };
}

export function exportCover(sizeName, photos, state) {
  const size = SIZES[sizeName] || SIZES.landscape;
  const canvas = document.createElement('canvas');
  canvas.width = size.w; canvas.height = size.h;
  drawCover(canvas, photos, { ...state, size: sizeName });
  return canvas;
}
