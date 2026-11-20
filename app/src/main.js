// Last Exit Paradise — editor wiring.
// Loads the two sample photos (or the user's uploads), keeps the cover state,
// redraws the live preview on every change, lets the user click a panel to set
// that panel's focal point, and exports the cover as a PNG in all three sizes.
import { drawCover, GRADES, LAYOUTS, SIZES } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const status = document.getElementById('status');

/** The cover state: words, layout, grade, size and one override per panel. */
export const state = {
  title: 'LAST EXIT',
  title2: 'PARADISE',
  subtitle: 'Paid in Sunsets',
  tagline: 'ONE ROAD · FOUR ALIBIS · NO WAY BACK',
  quote: 'THE HOTTEST RIDE OF THE YEAR',
  quoteSource: 'GOLDEN MILE GAZETTE',
  layout: 'coast',
  grade: 'sunset',
  size: 'landscape',
  panels: [],
};

const photos = [null, null];
let lastPanels = [];
let selectedPanel = 0;
let fontsReady = false;

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function ensureFonts() {
  if (fontsReady) return;
  try {
    await Promise.all([
      document.fonts.load('70px Anton'),
      document.fonts.load('40px Pacifico'),
      document.fonts.load('600 20px Oswald'),
      document.fonts.load('700 20px Oswald'),
    ]);
    await document.fonts.ready;
  } catch {
    // System fallbacks still draw; the cover never blocks on a font.
  }
  fontsReady = true;
}

async function redraw() {
  await ensureFonts();
  lastPanels = drawCover(canvas, photos, state).panels;
  renderPanelList();
}

function setStatus(text) {
  status.textContent = text;
}

/** Renders one preview-size canvas per export size is unnecessary: the live
 *  canvas always shows the chosen size; export renders offscreen at full size. */
export function exportCover(sizeId) {
  const size = SIZES[sizeId] || SIZES.landscape;
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off, photos, { ...state, size: sizeId });
  return new Promise((resolve) => {
    off.toBlob((blob) => resolve(blob), 'image/png');
  });
}

// Test hook: lets a headless check (and the maker) export without clicking.
window.__exportCover = exportCover;

async function downloadExport(sizeId) {
  setStatus(`Exporting ${SIZES[sizeId].label}…`);
  const blob = await exportCover(sizeId);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cover-${sizeId}-${SIZES[sizeId].w}x${SIZES[sizeId].h}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  setStatus(`Saved cover-${sizeId}-${SIZES[sizeId].w}x${SIZES[sizeId].h}.png`);
}

/** Panel list: role text, photo slot and focal-point readout per panel. */
function renderPanelList() {
  const list = document.getElementById('panels');
  if (!list) return;
  if (list.childElementCount === lastPanels.length) {
    // Update only the readouts, keep the user's focus in the text fields.
    lastPanels.forEach((p, i) => {
      const focus = list.querySelector(`[data-focus="${i}"]`);
      if (focus) focus.textContent = `Focus ${Math.round(p.fx * 100)}%, ${Math.round(p.fy * 100)}%`;
    });
    return;
  }
  list.innerHTML = '';
  lastPanels.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'panel-row' + (i === selectedPanel ? ' selected' : '');
    row.innerHTML = `
      <button type="button" class="panel-pick" data-panel="${i}">${i + 1}</button>
      <input type="text" data-role="${i}" maxlength="16" value="${(state.panels[i]?.role ?? p.role ?? '').replace(/"/g, '&quot;')}" aria-label="Role for panel ${i + 1}">
      <select data-photo="${i}" aria-label="Photo for panel ${i + 1}">
        <option value="0">Photo A</option>
        <option value="1">Photo B</option>
      </select>
      <span class="focus" data-focus="${i}"></span>`;
    row.querySelector(`[data-photo="${i}"]`).value = String(state.panels[i]?.photo ?? p.photo ?? 0);
    list.appendChild(row);
  });
  list.querySelectorAll('[data-role]').forEach((input) => {
    input.addEventListener('input', () => {
      const i = Number(input.dataset.role);
      state.panels[i] = { ...(state.panels[i] || {}), role: input.value };
      redraw();
    });
  });
  list.querySelectorAll('[data-photo]').forEach((select) => {
    select.addEventListener('change', () => {
      const i = Number(select.dataset.photo);
      state.panels[i] = { ...(state.panels[i] || {}), photo: Number(select.value) };
      redraw();
    });
  });
  list.querySelectorAll('[data-panel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedPanel = Number(btn.dataset.panel);
      renderPanelList();
      setStatus(`Panel ${selectedPanel + 1} selected — click the preview to move its focus.`);
    });
  });
}

/** Clicking the preview sets the selected panel's focal point at that spot. */
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;
  const hit = lastPanels.findIndex((p) => cx >= p.x && cx <= p.x + p.w && cy >= p.y && cy <= p.y + p.h);
  if (hit === -1) return;
  selectedPanel = hit;
  const p = lastPanels[hit];
  const img = photos[p.photo] || photos[0];
  if (!img) return;
  // Map the click (canvas coords) back into the photo's own coordinates.
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(p.w / iw, p.h / ih) * (p.zoom || 1);
  const dw = iw * scale;
  const dh = ih * scale;
  let dx = p.x + p.w / 2 - p.fx * dw;
  let dy = p.y + p.h / 2 - p.fy * dh;
  dx = Math.min(p.x, Math.max(p.x + p.w - dw, dx));
  dy = Math.min(p.y, Math.max(p.y + p.h - dh, dy));
  const fx = Math.min(0.98, Math.max(0.02, (cx - dx) / dw));
  const fy = Math.min(0.98, Math.max(0.02, (cy - dy) / dh));
  state.panels[hit] = { ...(state.panels[hit] || {}), fx, fy };
  redraw();
  setStatus(`Panel ${hit + 1} focus moved to ${Math.round(fx * 100)}%, ${Math.round(fy * 100)}%.`);
});

/** A light skin-tone scan: the centroid of skin-coloured pixels in the photo,
 *  used as a first-guess face position the user can then drag by clicking. */
export function skinToneCentroid(img) {
  const off = document.createElement('canvas');
  off.width = 64;
  off.height = 64;
  const ctx = off.getContext('2d');
  ctx.drawImage(img, 0, 0, 64, 64);
  const data = ctx.getImageData(0, 0, 64, 64).data;
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const i = (y * 64 + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 95 && g > 40 && b > 20 && r > g + 15 && r > b + 15 && Math.abs(r - g) < 90) {
        sx += x;
        sy += y;
        n++;
      }
    }
  }
  if (n < 20) return null;
  return { x: sx / n / 64, y: sy / n / 64 };
}

function bindText(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    state[key] = el.value;
    redraw();
  });
}

function buildPickers() {
  const layoutBox = document.getElementById('layouts');
  LAYOUTS.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (l.id === state.layout ? ' active' : '');
    b.textContent = l.name;
    b.addEventListener('click', () => {
      state.layout = l.id;
      state.panels = [];
      layoutBox.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      b.classList.add('active');
      redraw();
    });
    layoutBox.appendChild(b);
  });
  const gradeBox = document.getElementById('grades');
  GRADES.forEach((g) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch' + (g.id === state.grade ? ' active' : '');
    b.style.background = g.swatch;
    b.title = g.name;
    b.setAttribute('aria-label', g.name);
    b.addEventListener('click', () => {
      state.grade = g.id;
      gradeBox.querySelectorAll('.swatch').forEach((c) => c.classList.remove('active'));
      b.classList.add('active');
      redraw();
    });
    gradeBox.appendChild(b);
  });
  const sizeBox = document.getElementById('sizes');
  Object.entries(SIZES).forEach(([id, s]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (id === state.size ? ' active' : '');
    b.textContent = s.label;
    b.addEventListener('click', () => {
      state.size = id;
      sizeBox.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      b.classList.add('active');
      redraw();
    });
    sizeBox.appendChild(b);
  });
}

async function loadPhoto(slot, url, name) {
  photos[slot] = await loadImage(url);
  const thumb = document.getElementById(slot === 0 ? 'thumbA' : 'thumbB');
  if (thumb) {
    thumb.src = url;
    thumb.hidden = false;
  }
  const label = document.getElementById(slot === 0 ? 'photoAName' : 'photoBName');
  if (label) label.textContent = name;
  // First guess at the face: the skin-tone centroid, so hero crops land on it.
  const face = skinToneCentroid(photos[slot]);
  if (face) {
    state.panels.forEach((p, i) => {
      if ((p.photo ?? lastPanels[i]?.photo ?? 0) === slot) {
        state.panels[i] = { ...p, fx: face.x, fy: Math.min(0.5, face.y) };
      }
    });
  }
  redraw();
}

function bindUploads() {
  const upA = document.getElementById('photoA');
  const upB = document.getElementById('photoB');
  upA.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await loadPhoto(0, URL.createObjectURL(file), file.name);
    setStatus(`Photo A loaded: ${file.name}`);
  });
  upB.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await loadPhoto(1, URL.createObjectURL(file), file.name);
    setStatus(`Photo B loaded: ${file.name}`);
  });
  document.getElementById('sampleA').addEventListener('click', () => loadPhoto(0, 'samples/boulevard.jpg', 'boulevard.jpg (sample)'));
  document.getElementById('sampleB').addEventListener('click', () => loadPhoto(1, 'samples/pier.jpg', 'pier.jpg (sample)'));
}

bindText('title', 'title');
bindText('title2', 'title2');
bindText('subtitle', 'subtitle');
bindText('tagline', 'tagline');
bindText('quote', 'quote');
bindText('quoteSource', 'quoteSource');
buildPickers();
bindUploads();

document.getElementById('exportSquare').addEventListener('click', () => downloadExport('square'));
document.getElementById('exportPortrait').addEventListener('click', () => downloadExport('portrait'));
document.getElementById('exportLandscape').addEventListener('click', () => downloadExport('landscape'));
document.getElementById('shuffle').addEventListener('click', () => {
  const layouts = LAYOUTS.map((l) => l.id);
  state.layout = layouts[Math.floor(Math.random() * layouts.length)];
  state.grade = GRADES[Math.floor(Math.random() * GRADES.length)].id;
  document.querySelectorAll('#layouts .chip').forEach((c) => c.classList.toggle('active', c.textContent === LAYOUTS.find((l) => l.id === state.layout).name));
  document.querySelectorAll('#grades .swatch').forEach((c, i) => c.classList.toggle('active', GRADES[i].id === state.grade));
  state.panels = [];
  redraw();
  setStatus('Surprise me: new layout + grade.');
});

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), {
    loadPhoto,
    setState(next) {
      Object.assign(state, next);
      state.panels = next.panels || [];
    },
    redraw,
  });
} else {
  loadPhoto(0, 'samples/boulevard.jpg', 'boulevard.jpg (sample)');
  loadPhoto(1, 'samples/pier.jpg', 'pier.jpg (sample)');
}
