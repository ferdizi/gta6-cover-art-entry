// Last Exit Paradise — the cover renderer.
// Draws a GTA-style multi-panel poster cover onto a canvas: slanted photo panels
// joined by a glowing coastal route line, a giant striped-chrome title, a pink
// neon script subtitle, role tags, a stars-and-quote top bar and a billing block
// with barcode and gold seal. Every size (square / portrait / landscape) reflows
// its panels and title instead of cropping the square master.

export const SIZES = {
  square: { w: 1080, h: 1080, label: '1080 x 1080' },
  portrait: { w: 1080, h: 1350, label: '1080 x 1350' },
  landscape: { w: 1920, h: 1080, label: '1920 x 1080' },
};

export const GRADES = [
  { id: 'sunset', name: 'Vice Sunset', swatch: '#ff7a3d', filter: 'saturate(1.3) contrast(1.08)', top: 'rgba(255,110,60,0.10)', bottom: 'rgba(214,40,120,0.38)' },
  { id: 'neon', name: 'Neon Nights', swatch: '#ff2e88', filter: 'saturate(1.45) contrast(1.1)', top: 'rgba(255,46,136,0.16)', bottom: 'rgba(90,20,180,0.42)' },
  { id: 'golden', name: 'Golden Mile', swatch: '#ffb347', filter: 'saturate(1.25) contrast(1.05)', top: 'rgba(255,190,80,0.18)', bottom: 'rgba(180,80,20,0.30)' },
  { id: 'vice', name: 'Vice Purple', swatch: '#8b5cf6', filter: 'saturate(1.35) contrast(1.08)', top: 'rgba(150,90,255,0.18)', bottom: 'rgba(60,10,110,0.42)' },
  { id: 'teal', name: 'Teal Coast', swatch: '#2dd4bf', filter: 'saturate(1.3) contrast(1.08)', top: 'rgba(45,212,191,0.14)', bottom: 'rgba(10,60,110,0.40)' },
  { id: 'noir', name: 'Noir Drive', swatch: '#94a3b8', filter: 'saturate(0.55) contrast(1.18)', top: 'rgba(120,130,160,0.10)', bottom: 'rgba(10,10,25,0.48)' },
];

// Each layout returns panels as fractions of the panel region (x/y/w/h in 0..1),
// plus the photo slot (0 = main photo, 1 = second photo), a focal point inside
// that photo (0..1, the face or detail the crop must keep) and a role tag.
export const LAYOUTS = [
  {
    id: 'coast', name: 'Coastal Route',
    panels: (r) => [
      { x: 0.00, y: 0.00, w: 0.47, h: 1.00, photo: 0, fx: 0.56, fy: 0.22, role: 'THE QUEEN' },
      { x: 0.49, y: 0.00, w: 0.245, h: 0.48, photo: 1, fx: 0.42, fy: 0.24, role: 'THE CAPTAIN' },
      { x: 0.755, y: 0.00, w: 0.245, h: 0.48, photo: 0, fx: 0.16, fy: 0.62, role: 'THE GETAWAY' },
      { x: 0.49, y: 0.52, w: 0.245, h: 0.48, photo: 0, fx: 0.86, fy: 0.55, role: 'THE DRIVER' },
      { x: 0.755, y: 0.52, w: 0.245, h: 0.48, photo: 1, fx: 0.78, fy: 0.62, role: 'THE BRAINS' },
    ],
  },
  {
    id: 'strip', name: 'Sunset Strip',
    panels: (r) => [
      { x: 0.00, y: 0.00, w: 0.20, h: 1.00, photo: 1, fx: 0.30, fy: 0.40, role: 'THE BOSS' },
      { x: 0.21, y: 0.00, w: 0.20, h: 1.00, photo: 0, fx: 0.56, fy: 0.22, role: 'THE QUEEN' },
      { x: 0.42, y: 0.00, w: 0.20, h: 1.00, photo: 0, fx: 0.85, fy: 0.60, role: 'THE DRIVER' },
      { x: 0.63, y: 0.00, w: 0.185, h: 1.00, photo: 1, fx: 0.42, fy: 0.24, role: 'THE CAPTAIN' },
      { x: 0.825, y: 0.00, w: 0.175, h: 1.00, photo: 0, fx: 0.16, fy: 0.62, role: 'THE GETAWAY' },
    ],
  },
  {
    id: 'grid', name: 'Vice Grid',
    panels: (r) => [
      { x: 0.00, y: 0.00, w: 0.50, h: 0.50, photo: 0, fx: 0.56, fy: 0.22, role: 'THE QUEEN' },
      { x: 0.515, y: 0.00, w: 0.485, h: 0.50, photo: 1, fx: 0.42, fy: 0.24, role: 'THE CAPTAIN' },
      { x: 0.00, y: 0.53, w: 0.325, h: 0.47, photo: 0, fx: 0.16, fy: 0.62, role: 'THE GETAWAY' },
      { x: 0.34, y: 0.53, w: 0.325, h: 0.47, photo: 1, fx: 0.78, fy: 0.62, role: 'THE BRAINS' },
      { x: 0.68, y: 0.53, w: 0.32, h: 0.47, photo: 0, fx: 0.86, fy: 0.55, role: 'THE DRIVER' },
    ],
  },
  {
    id: 'duo', name: 'Hero Duo',
    panels: (r) => [
      { x: 0.00, y: 0.00, w: 0.62, h: 1.00, photo: 0, fx: 0.56, fy: 0.22, role: 'THE QUEEN' },
      { x: 0.64, y: 0.00, w: 0.36, h: 0.48, photo: 1, fx: 0.42, fy: 0.24, role: 'THE CAPTAIN' },
      { x: 0.64, y: 0.52, w: 0.36, h: 0.48, photo: 0, fx: 0.16, fy: 0.62, role: 'THE GETAWAY' },
    ],
  },
  {
    id: 'mosaic', name: 'Mosaic Seven',
    panels: (r) => [
      { x: 0.00, y: 0.00, w: 0.34, h: 0.62, photo: 0, fx: 0.56, fy: 0.22, role: 'THE QUEEN' },
      { x: 0.355, y: 0.00, w: 0.31, h: 0.62, photo: 1, fx: 0.42, fy: 0.24, role: 'THE CAPTAIN' },
      { x: 0.68, y: 0.00, w: 0.32, h: 0.62, photo: 0, fx: 0.86, fy: 0.55, role: 'THE DRIVER' },
      { x: 0.00, y: 0.66, w: 0.245, h: 0.34, photo: 1, fx: 0.78, fy: 0.62, role: 'THE BRAINS' },
      { x: 0.26, y: 0.66, w: 0.245, h: 0.34, photo: 0, fx: 0.16, fy: 0.62, role: 'THE GETAWAY' },
      { x: 0.52, y: 0.66, w: 0.23, h: 0.34, photo: 0, fx: 0.56, fy: 0.22, role: 'THE WILDCARD' },
      { x: 0.765, y: 0.66, w: 0.235, h: 0.34, photo: 1, fx: 0.42, fy: 0.24, role: 'THE BOSS' },
    ],
  },
  {
    id: 'cascade', name: 'Cascade',
    panels: (r) => [
      { x: 0.00, y: 0.10, w: 0.30, h: 0.90, photo: 1, fx: 0.42, fy: 0.24, role: 'THE CAPTAIN' },
      { x: 0.315, y: 0.05, w: 0.36, h: 0.95, photo: 0, fx: 0.56, fy: 0.22, role: 'THE QUEEN' },
      { x: 0.69, y: 0.00, w: 0.31, h: 0.48, photo: 0, fx: 0.16, fy: 0.62, role: 'THE GETAWAY' },
      { x: 0.69, y: 0.52, w: 0.31, h: 0.48, photo: 0, fx: 0.86, fy: 0.55, role: 'THE DRIVER' },
    ],
  },
];

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

/** A slanted comic-frame path: the top edge leans right, the bottom edge left. */
function slantedPath(ctx, x, y, w, h, slant) {
  ctx.beginPath();
  ctx.moveTo(x + slant, y);
  ctx.lineTo(x + w + slant, y);
  ctx.lineTo(x + w - slant, y + h);
  ctx.lineTo(x - slant, y + h);
  ctx.closePath();
}

/** Draws `img` cover-fitting `rect`, keeping the focal point (fx, fy in 0..1) centred. */
export function drawFocalImage(ctx, img, rect, fx, fy, zoom, filter) {
  const { x, y, w, h } = rect;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(w / iw, h / ih) * (zoom || 1);
  const dw = iw * scale;
  const dh = ih * scale;
  // Where the focal point lands in the drawn image, then shift so it sits centred.
  let dx = x + w / 2 - fx * dw;
  let dy = y + h / 2 - fy * dh;
  dx = Math.min(x, Math.max(x + w - dw, dx));
  dy = Math.min(y, Math.max(y + h - dh, dy));
  ctx.save();
  ctx.filter = filter || 'none';
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.42;
    const px = cx + Math.cos(ang) * rad;
    const py = cy + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** The giant title: Anton capitals filled with a sunset gradient + horizontal
 *  stripes, a deep-plum extruded shadow and a cream keyline. Drawn via an
 *  offscreen canvas so the stripes clip exactly inside the letters. */
function drawChromeTitle(ctx, lines, cx, topY, maxW, fontPx, W) {
  const gap = fontPx * 0.08;
  // Fit the size first on the main context (no offscreen resize: resizing a
  // canvas wipes its context, which once left this title hollow).
  let size = fontPx;
  ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  while (size > 10 && lines.some((l) => ctx.measureText(l).width > maxW)) {
    size -= 2;
    ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  }
  const lineH = size + gap;
  const totalH = lines.length * size + (lines.length - 1) * gap;
  const off = document.createElement('canvas');
  off.width = Math.max(2, Math.ceil(maxW));
  off.height = Math.max(2, Math.ceil(totalH + size * 0.3));
  const o = off.getContext('2d');
  o.textAlign = 'center';
  o.textBaseline = 'middle';
  o.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  o.fillStyle = '#fff';
  lines.forEach((line, i) => o.fillText(line, off.width / 2, lineH * (i + 0.5)));
  // Sunset gradient + stripes, clipped inside the letters.
  o.globalCompositeOperation = 'source-in';
  const grad = o.createLinearGradient(0, 0, 0, off.height);
  grad.addColorStop(0, '#ffe95e');
  grad.addColorStop(0.38, '#ffb03a');
  grad.addColorStop(0.62, '#ff5e3a');
  grad.addColorStop(1, '#ff2e88');
  o.fillStyle = grad;
  o.fillRect(0, 0, off.width, off.height);
  // Stripes must use source-atop, not source-in: a partial fillRect under
  // source-in erases everything outside the rect. source-atop paints the
  // bands only where the letters already are and leaves the rest alone.
  o.globalCompositeOperation = 'source-atop';
  o.fillStyle = 'rgba(120, 10, 60, 0.28)';
  const stripeH = Math.max(3, size * 0.07);
  for (let y = size * 0.22; y < off.height; y += stripeH * 2.6) {
    o.fillRect(0, y, off.width, stripeH);
  }
  o.globalCompositeOperation = 'source-over';
  // Extruded plum shadow + cream keyline on the main canvas, then the fill.
  const drawY = topY + totalH / 2;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${size}px Anton, "Arial Narrow", sans-serif`;
  ctx.lineJoin = 'round';
  const extrude = Math.max(3, size * 0.055);
  ctx.fillStyle = '#2a0a3a';
  lines.forEach((line, i) => {
    const ly = drawY - totalH / 2 + lineH * (i + 0.5) + extrude;
    ctx.fillText(line, cx + extrude * 0.7, ly);
  });
  ctx.strokeStyle = '#fff3d6';
  ctx.lineWidth = Math.max(2, size * 0.045);
  lines.forEach((line, i) => {
    const ly = drawY - totalH / 2 + lineH * (i + 0.5);
    ctx.strokeText(line, cx, ly);
  });
  ctx.restore();
  const imgH = totalH + size * 0.3;
  // Align the image's text block (its top totalH) with the stroked text.
  ctx.drawImage(off, cx - off.width / 2, drawY - totalH / 2, off.width, imgH);
  return totalH;
}

function drawBarcode(ctx, x, y, w, h) {
  // Deterministic bars from a fixed seed so every export matches.
  let seed = 20261121;
  const next = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  ctx.fillStyle = '#fff3d6';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 22);
  ctx.fillStyle = '#14061f';
  let bx = x;
  while (bx < x + w - 3) {
    const bw = 1 + Math.floor(next() * 4);
    if (next() > 0.45) ctx.fillRect(bx, y, bw, h);
    bx += bw + 1 + Math.floor(next() * 3);
  }
  ctx.font = `${Math.max(9, h * 0.28)}px Oswald, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('8 901234 567890', x + w / 2, y + h + 3);
}

function drawSeal(ctx, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#f5b942';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8a5a00';
  ctx.lineWidth = Math.max(2, r * 0.07);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#5c2a00';
  starPath(ctx, 0, -r * 0.28, r * 0.26);
  ctx.fill();
  ctx.font = `700 ${r * 0.30}px Oswald, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BEST', 0, r * 0.22);
  ctx.fillText('CAST', 0, r * 0.52);
  ctx.restore();
}

/**
 * Draws the whole cover.
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement[]} photos - [main photo, second photo]
 * @param {object} state - { title, title2, subtitle, tagline, quote, quoteSource,
 *   layout, grade, size, panels } where panels (optional) overrides per-panel
 *   { photo, fx, fy, zoom, role } by index.
 */
export function drawCover(canvas, photos, state) {
  const size = SIZES[state.size] || SIZES.landscape;
  const W = size.w;
  const H = size.h;
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }
  const ctx = canvas.getContext('2d');
  const grade = gradeById(state.grade);
  const layout = layoutById(state.layout);
  const u = W / 1000; // scale unit: 1 unit = W/1000 px
  const v = H / 1000;

  // Deep sunset sky background.
  const sky = ctx.createLinearGradient(0, 0, W, H);
  sky.addColorStop(0, '#2b0f4a');
  sky.addColorStop(0.45, '#7a1e6e');
  sky.addColorStop(0.75, '#e8446a');
  sky.addColorStop(1, '#ff8a3d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  // Sun disc + palm silhouettes drawn behind the panels, peeking through gaps.
  const sunX = W * 0.82;
  const sunY = H * 0.30;
  const sunR = H * 0.16;
  const sun = ctx.createRadialGradient(sunX, sunY, sunR * 0.1, sunX, sunY, sunR);
  sun.addColorStop(0, 'rgba(255,240,170,0.95)');
  sun.addColorStop(0.6, 'rgba(255,180,80,0.55)');
  sun.addColorStop(1, 'rgba(255,120,60,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(sunX - sunR * 2, sunY - sunR * 2, sunR * 4, sunR * 4);

  // Panel region: below the top bar, above the title zone.
  const topBarH = H * 0.082;
  const region = {
    x: W * 0.022,
    y: topBarH + H * 0.012,
    w: W * 0.956,
    h: H * (state.size === 'portrait' ? 0.56 : 0.52),
  };
  const defs = layout.panels(region);
  const panels = defs.map((d, i) => {
    const over = (state.panels && state.panels[i]) || {};
    return {
      x: region.x + d.x * region.w,
      y: region.y + d.y * region.h,
      w: d.w * region.w,
      h: d.h * region.h,
      photo: over.photo ?? d.photo,
      fx: over.fx ?? d.fx,
      fy: over.fy ?? d.fy,
      zoom: over.zoom ?? 1,
      role: over.role ?? d.role,
    };
  });
  const slant = W * 0.006;

  // Photos inside slanted frames.
  panels.forEach((p) => {
    const img = photos[p.photo] || photos[0];
    if (!img) return;
    ctx.save();
    slantedPath(ctx, p.x, p.y, p.w, p.h, slant);
    ctx.clip();
    drawFocalImage(ctx, img, { x: p.x - slant, y: p.y, w: p.w + slant * 2, h: p.h }, p.fx, p.fy, p.zoom, grade.filter);
    ctx.restore();
    ctx.save();
    slantedPath(ctx, p.x, p.y, p.w, p.h, slant);
    ctx.strokeStyle = '#f7d774';
    ctx.lineWidth = Math.max(2, u * 2.2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(20,6,31,0.85)';
    ctx.lineWidth = Math.max(4, u * 4);
    ctx.stroke();
    ctx.restore();
  });

  // Grade wash over the panels only.
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.w, region.h);
  ctx.clip();
  const wash = ctx.createLinearGradient(0, region.y, 0, region.y + region.h);
  wash.addColorStop(0, grade.top);
  wash.addColorStop(1, grade.bottom);
  ctx.fillStyle = wash;
  ctx.fillRect(region.x, region.y, region.w, region.h);
  ctx.restore();

  // Title lines, decided up front: the route needs the real title box so a
  // stop is only moved when it would truly land on a letter.
  const titleLines = [];
  const t1 = (state.title || 'LAST EXIT').trim().toUpperCase();
  const t2 = (state.title2 || '').trim().toUpperCase();
  if (state.size === 'landscape' && !t2) titleLines.push(t1);
  else if (t2) titleLines.push(t1, t2);
  else {
    const words = t1.split(/\s+/);
    if (words.length > 1 && t1.length > 10) {
      const half = Math.ceil(words.length / 2);
      titleLines.push(words.slice(0, half).join(' '), words.slice(half).join(' '));
    } else titleLines.push(t1);
  }
  const titlePx = (titleLines.length > 1 ? (state.size === 'landscape' ? H * 0.105 : H * 0.082) : (state.size === 'landscape' ? H * 0.16 : H * 0.11));

  // The coastal route: a glowing line along the bottom edge of the panels,
  // joining the bottom-centre of each panel with numbered stops. It never
  // crosses a face — the line lives on the frames, the story reads below.
  // A stop that would land on the title's first line moves to its panel's
  // top-right corner instead, so no dot ever sits on a letter.
  const titleZoneY = region.y + region.h - H * 0.06;
  ctx.font = `${titlePx}px Anton, sans-serif`;
  const titleGuessW = Math.max(...titleLines.map((l) => ctx.measureText(l).width));
  const titleBox = {
    x0: W / 2 - titleGuessW / 2 - u * 8,
    x1: W / 2 + titleGuessW / 2 + u * 8,
    y0: titleZoneY + H * 0.005,
    y1: titleZoneY + H * 0.16,
  };
  const routePts = panels.map((p) => {
    const pt = { x: p.x + p.w / 2, y: p.y + p.h - Math.max(3, u * 3) };
    if (pt.x > titleBox.x0 && pt.x < titleBox.x1 && pt.y > titleBox.y0 && pt.y < titleBox.y1) {
      pt.x = p.x + p.w - u * 16;
      pt.y = p.y + u * 16;
    }
    return pt;
  });
  ctx.save();
  ctx.beginPath();
  routePts.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else {
      const prev = routePts[i - 1];
      ctx.quadraticCurveTo((prev.x + pt.x) / 2, Math.min(prev.y, pt.y) - H * 0.015, pt.x, pt.y);
    }
  });
  ctx.strokeStyle = 'rgba(255,225,150,0.95)';
  ctx.lineWidth = Math.max(2, u * 2.4);
  ctx.shadowColor = '#ffb03a';
  ctx.shadowBlur = u * 8;
  ctx.stroke();
  ctx.shadowBlur = 0;
  routePts.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, Math.max(7, u * 11), 0, Math.PI * 2);
    ctx.fillStyle = '#14061f';
    ctx.fill();
    ctx.strokeStyle = '#f7d774';
    ctx.lineWidth = Math.max(1.5, u * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffe9a8';
    ctx.font = `700 ${Math.max(9, u * 12)}px Oswald, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), pt.x, pt.y + 1);
  });
  ctx.restore();

  // Role tags on each panel's top-left corner.
  panels.forEach((p) => {
    const label = (p.role || '').trim().toUpperCase();
    if (!label) return;
    ctx.font = `600 ${Math.max(10, u * 13)}px Oswald, sans-serif`;
    const tw = ctx.measureText(label).width;
    const pad = u * 8;
    const th = Math.max(16, u * 20);
    const tx = p.x + u * 8;
    const ty = p.y + u * 8;
    ctx.fillStyle = 'rgba(12,4,22,0.92)';
    ctx.fillRect(tx, ty, tw + pad * 2, th);
    ctx.strokeStyle = '#f7d774';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx, ty, tw + pad * 2, th);
    ctx.fillStyle = '#ffe9a8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, tx + pad, ty + th / 2 + 1);
  });

  // Dark fade behind the title so it reads over busy photos.
  const fade = ctx.createLinearGradient(0, titleZoneY, 0, H * 0.94);
  fade.addColorStop(0, 'rgba(20,6,31,0)');
  fade.addColorStop(0.25, 'rgba(20,6,31,0.55)');
  fade.addColorStop(1, 'rgba(20,6,31,0.82)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, titleZoneY, W, H * 0.94 - titleZoneY);

  // Title: two lines in square/portrait, one long line in landscape when it fits.
  // (titleLines and titlePx were decided before the route, above.)
  const titleTop = titleZoneY + H * 0.015;
  const titleH = drawChromeTitle(ctx, titleLines, W / 2, titleTop, W * 0.94, titlePx, W);

  // Pink neon script subtitle, tilted, under the title.
  const sub = (state.subtitle || '').trim();
  if (sub) {
    ctx.save();
    ctx.translate(W / 2, titleTop + titleH + H * 0.028);
    ctx.rotate(-0.03);
    ctx.font = `${H * 0.052}px Pacifico, cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff2e88';
    ctx.shadowBlur = H * 0.02;
    ctx.fillStyle = '#ff8fd0';
    ctx.fillText(sub, 0, 0);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffd7ef';
    ctx.fillText(sub, 0, -1);
    ctx.restore();
  }

  // Tagline ribbon.
  const tag = (state.tagline || '').trim().toUpperCase();
  if (tag) {
    const ty = titleTop + titleH + H * 0.085;
    ctx.font = `600 ${Math.max(11, H * 0.021)}px Oswald, sans-serif`;
    const tw = Math.min(W * 0.80, ctx.measureText(tag).width + W * 0.05);
    const th = H * 0.038;
    const tx = (W - tw) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tx + th * 0.5, ty);
    ctx.lineTo(tx + tw - th * 0.5, ty);
    ctx.lineTo(tx + tw, ty + th);
    ctx.lineTo(tx, ty + th);
    ctx.closePath();
    ctx.fillStyle = '#fff3d6';
    ctx.fill();
    ctx.fillStyle = '#3a0a2e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, W / 2, ty + th / 2 + 1);
    ctx.restore();
  }

  // Top bar: stars + press quote + VOL. 1 badge.
  ctx.fillStyle = 'rgba(16,5,28,0.92)';
  ctx.fillRect(0, 0, W, topBarH);
  ctx.fillStyle = '#f7d774';
  ctx.fillRect(0, topBarH - Math.max(2, u * 2), W, Math.max(2, u * 2));
  const starR = Math.min(topBarH * 0.26, W * 0.02);
  const starsW = starR * 2.4 * 5;
  let sx = W * 0.022;
  for (let i = 0; i < 5; i++) {
    starPath(ctx, sx + starR + i * starR * 2.4, topBarH / 2, starR);
    ctx.fillStyle = '#f5b942';
    ctx.fill();
    ctx.strokeStyle = '#8a5a00';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const quote = (state.quote || '').trim().toUpperCase();
  const qsrc = (state.quoteSource || '').trim().toUpperCase();
  ctx.fillStyle = '#ffe9a8';
  ctx.font = `600 ${Math.max(10, H * 0.02)}px Oswald, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const quoteText = qsrc ? `"${quote}" — ${qsrc}` : `"${quote}"`;
  ctx.fillText(quoteText, W * 0.55, topBarH / 2 + 1, W * 0.56);
  // VOL. 1 badge.
  ctx.font = `700 ${Math.max(10, H * 0.02)}px Oswald, sans-serif`;
  const vol = 'VOL. 1';
  const vw = ctx.measureText(vol).width + W * 0.02;
  const vh = topBarH * 0.62;
  ctx.strokeStyle = '#f7d774';
  ctx.lineWidth = Math.max(1.5, u * 1.6);
  ctx.strokeRect(W - vw - W * 0.018, (topBarH - vh) / 2, vw, vh);
  ctx.fillStyle = '#ffe9a8';
  ctx.fillText(vol, W - vw / 2 - W * 0.018, topBarH / 2 + 1);

  // Bottom billing block.
  const botY = H * 0.945;
  ctx.fillStyle = 'rgba(16,5,28,0.92)';
  ctx.fillRect(0, H * 0.925, W, H * 0.075);
  ctx.fillStyle = '#f7d774';
  ctx.fillRect(0, H * 0.925, W, Math.max(2, u * 2));
  ctx.fillStyle = '#fff3d6';
  ctx.font = `${Math.max(9, H * 0.016)}px Oswald, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A GOLDEN MILE PICTURE  ·  IN ASSOCIATION WITH PALMLINE STUDIOS', W / 2, botY - H * 0.012, W * 0.6);
  ctx.fillStyle = 'rgba(255,243,214,0.75)';
  ctx.font = `${Math.max(8, H * 0.013)}px Oswald, sans-serif`;
  ctx.fillText('STARRING THE CREW  ·  MUSIC BY NEON TIDE  ·  SHOT ON THE COAST  ·  © MMXXVI', W / 2, botY + H * 0.014, W * 0.6);
  // COMING SOON, bottom-left.
  ctx.textAlign = 'left';
  ctx.font = `${Math.max(12, H * 0.024)}px Anton, sans-serif`;
  ctx.fillStyle = '#ffe95e';
  ctx.fillText('COMING SOON', W * 0.022, botY + H * 0.004);
  // Barcode bottom-right, seal above it.
  drawBarcode(ctx, W * 0.885, H * 0.935, W * 0.085, H * 0.028);
  drawSeal(ctx, W * 0.935, H * 0.875, H * 0.042);

  return { panels, region };
}
