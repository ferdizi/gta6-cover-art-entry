// Last Exit Paradise — editor (round-3 rebuild, 2026-11-21).
// Dark sunset editor: two photo slots (upload or AI-made samples), click the
// preview to move a panel's focal point, skin-tone centroid first-guess face
// finder on upload, editable roles, layout / grade / size pickers, PNG export
// in three sizes, and a "Surprise me" randomiser.
import { SIZES, LAYOUTS, GRADES, defaultState, drawCover, exportCover, layoutPanels } from './cover.js';

export const state = defaultState();
export const photos = { A: null, B: null };
let selectedPanel = 0;

const $ = (id) => document.getElementById(id);

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`cannot load ${src}`));
    img.src = src;
  });
}

export async function loadSample(slot, name) {
  photos[slot] = await loadImage(`samples/${name}.jpg`);
  guessFace(slot);
  render();
}

function isSkinPixel(r, g, b) {
  return r > 90 && g > 40 && b > 20 && r > g + 15 && r > b + 20 && r - g < 80;
}

// First-guess face finder: centroid of skin-toned pixels, per photo slot.
// (A densest-row variant was tried and reverted: it cut faces at panel edges;
// the centroid keeps whole faces visible inside their panels.)
export function guessFace(slot) {
  const img = photos[slot];
  if (!img) return null;
  try {
    const probe = document.createElement('canvas');
    const pw = 64;
    const ph = Math.max(8, Math.round((64 * img.naturalHeight) / img.naturalWidth));
    probe.width = pw;
    probe.height = ph;
    const pctx = probe.getContext('2d');
    pctx.drawImage(img, 0, 0, pw, ph);
    const data = pctx.getImageData(0, 0, pw, ph).data;
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (isSkinPixel(data[i], data[i + 1], data[i + 2])) {
        sx += (i / 4) % pw;
        sy += Math.floor(i / 4 / pw);
        n++;
      }
    }
    if (n < 20) return null;
    const fx = Math.min(0.95, Math.max(0.05, sx / n / pw));
    const fy = Math.min(0.95, Math.max(0.05, sy / n / ph));
    state.panels.forEach((p) => {
      if (p.photo === slot) {
        p.fx = fx;
        p.fy = fy;
      }
    });
    return { fx, fy };
  } catch {
    return null;
  }
}

// Inverse cover-fit: given a click inside a panel, work out which point of
// the source photo sits under it, and move that panel's focal point there.
function clickToFocal(img, rect, panel, cx, cy) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(rect.w / iw, rect.h / ih);
  const sw = rect.w / scale;
  const sh = rect.h / scale;
  const sx = Math.max(0, Math.min(iw - sw, panel.fx * iw - sw / 2));
  const sy = Math.max(0, Math.min(ih - sh, panel.fy * ih - sh / 2));
  const srcX = sx + (cx / rect.w) * sw;
  const srcY = sy + (cy / rect.h) * sh;
  return {
    fx: Math.min(0.95, Math.max(0.05, srcX / iw)),
    fy: Math.min(0.95, Math.max(0.05, srcY / ih)),
  };
}

function pointInPanel(x, y, r) {
  if (y < r.y || y > r.y + r.h) return false;
  const t = (y - r.y) / r.h;
  const left = r.x + r.slant * (1 - t);
  const right = r.x + r.w + r.slant * (1 - t);
  return x >= left && x <= right;
}

function buildPicker(el, items, current, onPick) {
  el.innerHTML = '';
  items.forEach((item) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = item.label;
    if (item.value === current) b.classList.add('on');
    b.addEventListener('click', () => {
      onPick(item.value);
      el.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
    });
    el.appendChild(b);
  });
}

function buildPanelList() {
  const list = $('panelList');
  list.innerHTML = '';
  state.panels.forEach((panel, i) => {
    const row = document.createElement('div');
    row.className = 'panel-row' + (i === selectedPanel ? ' selected' : '');
    row.dataset.index = i;
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.textContent = `#${i + 1}`;
    pick.addEventListener('click', () => {
      selectedPanel = i;
      render();
    });
    const role = document.createElement('input');
    role.className = 'role-input';
    role.value = panel.role;
    role.maxLength = 18;
    role.addEventListener('input', () => {
      panel.role = role.value.toUpperCase();
      render();
    });
    const photo = document.createElement('select');
    photo.className = 'photo-select';
    ['A', 'B'].forEach((slot) => {
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = `Photo ${slot}`;
      if (panel.photo === slot) opt.selected = true;
      photo.appendChild(opt);
    });
    photo.addEventListener('change', () => {
      panel.photo = photo.value;
      render();
    });
    const focal = document.createElement('div');
    focal.className = 'panel-focal';
    focal.textContent = `focal ${panel.fx.toFixed(2)} · ${panel.fy.toFixed(2)} · photo ${panel.photo}`;
    row.append(pick, role, photo, focal);
    list.appendChild(row);
  });
}

function downloadPng(size) {
  const canvas = exportCover(size, photos, state);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `last-exit-paradise-${size}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}

export function render() {
  const canvas = $('cover');
  drawCover(canvas, photos, state);
  const panel = state.panels[selectedPanel];
  $('focalReadout').textContent = `Panel ${selectedPanel + 1} of ${state.panels.length} — click the cover to move its focal point`;
  $('hint').textContent = `focal ${panel.fx.toFixed(2)} · ${panel.fy.toFixed(2)} · photo ${panel.photo}`;
  document.querySelectorAll('#panelList .panel-row').forEach((row, i) => {
    row.classList.toggle('selected', i === selectedPanel);
    const f = row.querySelector('.panel-focal');
    const p = state.panels[i];
    if (f) f.textContent = `focal ${p.fx.toFixed(2)} · ${p.fy.toFixed(2)} · photo ${p.photo}`;
  });
}

export async function initEditor() {
  buildPicker($('layoutPicker'), LAYOUTS.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })), state.layout, (v) => {
    state.layout = v;
    render();
  });
  buildPicker($('gradePicker'), Object.keys(GRADES).map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })), state.grade, (v) => {
    state.grade = v;
    render();
  });
  buildPicker($('sizePicker'), Object.keys(SIZES).map((v) => ({ value: v, label: SIZES[v].label })), state.size, (v) => {
    state.size = v;
    render();
  });
  buildPanelList();

  $('titleInput').addEventListener('input', (e) => {
    state.title = e.target.value;
    render();
  });
  $('subtitleInput').addEventListener('input', (e) => {
    state.subtitle = e.target.value;
    render();
  });
  $('taglineInput').addEventListener('input', (e) => {
    state.tagline = e.target.value;
    render();
  });
  $('photoA').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    photos.A = await loadImage(URL.createObjectURL(file));
    guessFace('A');
    render();
  });
  $('photoB').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    photos.B = await loadImage(URL.createObjectURL(file));
    guessFace('B');
    render();
  });
  document.querySelectorAll('[data-slot][data-photo]').forEach((btn) => {
    btn.addEventListener('click', () => loadSample(btn.dataset.slot, btn.dataset.photo));
  });

  const exportBtns = $('exportBtns');
  exportBtns.innerHTML = '';
  Object.keys(SIZES).forEach((size) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = SIZES[size].label;
    b.addEventListener('click', () => downloadPng(size));
    exportBtns.appendChild(b);
  });

  $('surpriseBtn').addEventListener('click', () => {
    state.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
    state.grade = Object.keys(GRADES)[Math.floor(Math.random() * Object.keys(GRADES).length)];
    state.panels.forEach((p) => {
      p.photo = Math.random() < 0.5 ? 'A' : 'B';
    });
    buildPicker($('layoutPicker'), LAYOUTS.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })), state.layout, (v) => {
      state.layout = v;
      render();
    });
    buildPicker($('gradePicker'), Object.keys(GRADES).map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })), state.grade, (v) => {
      state.grade = v;
      render();
    });
    render();
  });

  $('cover').addEventListener('click', (e) => {
    const canvas = $('cover');
    const box = canvas.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * canvas.width;
    const y = ((e.clientY - box.top) / box.height) * canvas.height;
    const rects = layoutPanels(state.size, state.layout);
    const hit = rects.findIndex((r) => pointInPanel(x, y, r));
    if (hit < 0) return;
    selectedPanel = hit;
    const panel = state.panels[hit];
    const img = photos[panel.photo];
    if (!img) return;
    const rect = rects[hit];
    const f = clickToFocal(img, rect, panel, x - rect.x, y - rect.y);
    panel.fx = f.fx;
    panel.fy = f.fy;
    render();
  });

  window.__exportCover = (size) => exportCover(size, photos, state);
  try {
    await document.fonts.ready;
  } catch { /* fonts are local; a miss still renders */ }
  render();
}
