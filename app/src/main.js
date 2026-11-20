// Last Exit Paradise — editor (rebuild, 2026-11-21).
// Dark sunset editor: two photo slots (upload or AI-made samples), click the
// preview to move a panel's focal point, skin-tone centroid first-guess face
// finder on upload, editable roles, layout / grade / size pickers, PNG export
// in three sizes, and a "Surprise me" randomiser.
import { SIZES, LAYOUTS, GRADES, DEFAULT_ROLES, defaultState, drawCover, exportCover, layoutPanels } from './cover.js';

export const state = defaultState();
export const photos = { A: null, B: null };
let selectedPanel = 0;

const $ = (id) => document.getElementById(id);

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadSample(slot, name) {
  photos[slot] = await loadImage(`samples/${name}`);
  guessFace(slot);
  render();
}

function isSkin(r, g, b) {
  return r > 95 && r > g && r > b && (r - g) > 12 && (r - g) < 90 && (r - b) > 15 && Math.abs(r - g) > 8;
}

// First-guess face finder: centroid of skin-toned pixels, per photo slot.
// (A densest-row variant was tried and reverted: it cut faces at panel edges;
// the centroid keeps whole faces visible inside their panels.)
export function guessFace(slot) {
  const img = photos[slot];
  if (!img) return null;
  try {
    const c = document.createElement('canvas');
    const w = 120, h = Math.max(40, Math.round((120 * img.naturalHeight) / img.naturalWidth));
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    let sx = 0, sy = 0, n = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (isSkin(d[i], d[i + 1], d[i + 2])) { sx += x; sy += y; n++; }
    }
    if (n < 20) return null;
    const fx = sx / n / w, fy = sy / n / h;
    state.panels.forEach((p) => { if (p.photo === slot) { p.fx = fx; p.fy = Math.min(0.7, Math.max(0.2, fy)); } });
    return { fx, fy };
  } catch { return null; }
}

export function render() {
  const canvas = $('cover');
  if (!canvas) return;
  const size = SIZES[state.size] || SIZES.landscape;
  if (canvas.width !== size.w || canvas.height !== size.h) { canvas.width = size.w; canvas.height = size.h; }
  drawCover(canvas, photos, state);
  renderPanelList();
  syncControls();
}

function syncControls() {
  const set = (id, v) => { const el = $(id); if (el && el.value !== v) el.value = v; };
  set('layout', state.layout); set('grade', state.grade); set('size', state.size);
  set('title', state.title); set('subtitle', state.subtitle); set('tagline', state.tagline);
  const sel = $('selectedPanel'); if (sel) sel.textContent = `Panel ${selectedPanel + 1} of 5 — click the cover to move its focal point`;
  const foc = $('focalReadout');
  if (foc) { const p = state.panels[selectedPanel]; foc.textContent = `focal ${p.fx.toFixed(2)} · ${p.fy.toFixed(2)} · photo ${p.photo}`; }
}

function renderPanelList() {
  const list = $('panelList');
  if (!list) return;
  list.innerHTML = '';
  state.panels.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'panel-row' + (i === selectedPanel ? ' selected' : '');
    row.innerHTML = `<button class="panel-pick" type="button">#${i + 1}</button>
      <input class="role-input" type="text" value="${(state.roles[i % state.roles.length] || '').replace(/"/g, '&quot;')}" aria-label="Role for panel ${i + 1}">
      <select class="photo-select" aria-label="Photo for panel ${i + 1}">
        <option value="A"${p.photo === 'A' ? ' selected' : ''}>Photo A</option>
        <option value="B"${p.photo === 'B' ? ' selected' : ''}>Photo B</option>
      </select>
      <span class="focal">focal ${p.fx.toFixed(2)} · ${p.fy.toFixed(2)}</span>`;
    row.querySelector('.panel-pick').addEventListener('click', () => { selectedPanel = i; render(); });
    row.querySelector('.role-input').addEventListener('input', (e) => { state.roles[i % state.roles.length] = e.target.value.toUpperCase(); render(); });
    row.querySelector('.photo-select').addEventListener('change', (e) => { p.photo = e.target.value; render(); });
    list.appendChild(row);
  });
}

// Click preview -> move the selected panel's focal point (inverse cover-fit map).
export function onPreviewClick(ev) {
  const canvas = $('cover');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const cx = ((ev.clientX - rect.left) / rect.width) * canvas.width;
  const cy = ((ev.clientY - rect.top) / rect.height) * canvas.height;
  const panels = layoutPanels(state.layout, canvas.width, canvas.height);
  let hit = -1;
  panels.forEach((p, i) => { if (cx >= p.x && cx <= p.x + p.w && cy >= p.y && cy <= p.y + p.h) hit = i; });
  if (hit < 0) return;
  selectedPanel = hit;
  const p = panels[hit];
  const spec = state.panels[hit];
  const img = photos[spec.photo];
  if (img) {
    // inverse of the cover-fit crop used in cover.js
    const scale = Math.max(p.w / img.naturalWidth, p.h / img.naturalHeight);
    const sw = p.w / scale, sh = p.h / scale;
    let sx = spec.fx * img.naturalWidth - sw / 2;
    let sy = spec.fy * img.naturalHeight - sh / 2;
    sx = Math.max(0, Math.min(img.naturalWidth - sw, sx));
    sy = Math.max(0, Math.min(img.naturalHeight - sh, sy));
    const u = (cx - p.x) / p.w, v = (cy - p.y) / p.h;
    spec.fx = Math.min(0.98, Math.max(0.02, (sx + u * sw) / img.naturalWidth));
    spec.fy = Math.min(0.98, Math.max(0.02, (sy + v * sh) / img.naturalHeight));
  }
  render();
}

function download(canvas, name) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}

export function exportSize(sizeName) {
  const canvas = exportCover(sizeName, photos, { ...state, size: sizeName });
  download(canvas, `last-exit-paradise-${sizeName}.png`);
  return canvas;
}

// Offscreen export hook for screenshots / automation.
window.__exportCover = (sizeName) => exportCover(sizeName, photos, { ...state, size: sizeName || state.size });

export function surpriseMe() {
  state.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
  const grades = Object.keys(GRADES);
  state.grade = grades[Math.floor(Math.random() * grades.length)];
  const titles = ['LAST EXIT\nPARADISE', 'PALM FEVER\nNIGHTS', 'SUNDOWN\nRACKET', 'NEON TIDE\nGETAWAY'];
  state.title = titles[Math.floor(Math.random() * titles.length)];
  state.panels.forEach((p) => { p.photo = Math.random() < 0.5 ? 'A' : 'B'; });
  render();
}

function bindUpload(inputId, slot) {
  const input = $(inputId);
  if (!input) return;
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    try { photos[slot] = await loadImage(url); guessFace(slot); render(); }
    catch { alert('Could not read that photo.'); }
  });
}

export function initEditor() {
  bindUpload('uploadA', 'A');
  bindUpload('uploadB', 'B');
  const sampleA = $('sampleA'); if (sampleA) sampleA.addEventListener('click', () => loadSample('A', 'boulevard.jpg'));
  const sampleB = $('sampleB'); if (sampleB) sampleB.addEventListener('click', () => loadSample('B', 'pier.jpg'));
  const sampleA2 = $('sampleA2'); if (sampleA2) sampleA2.addEventListener('click', () => loadSample('A', 'pier.jpg'));
  const sampleB2 = $('sampleB2'); if (sampleB2) sampleB2.addEventListener('click', () => loadSample('B', 'boulevard.jpg'));
  [['layout', 'layout'], ['grade', 'grade'], ['size', 'size']].forEach(([id, key]) => {
    const el = $(id); if (el) el.addEventListener('change', () => { state[key] = el.value; render(); });
  });
  [['title', 'title'], ['subtitle', 'subtitle'], ['tagline', 'tagline']].forEach(([id, key]) => {
    const el = $(id); if (el) el.addEventListener('input', () => { state[key] = el.value; render(); });
  });
  const canvas = $('cover');
  if (canvas) canvas.addEventListener('click', onPreviewClick);
  const surprise = $('surprise'); if (surprise) surprise.addEventListener('click', surpriseMe);
  document.querySelectorAll('[data-export]').forEach((btn) => {
    btn.addEventListener('click', () => exportSize(btn.dataset.export));
  });
  // Load both samples by default so the editor is never empty.
  Promise.all([loadSample('A', 'boulevard.jpg'), loadSample('B', 'pier.jpg')]).then(render).catch(render);
  render();
}
