// Last Exit Paradise — deterministic shot views (rebuild, 2026-11-21).
// ?shot=cover&size=&photo=&caption=&title=&subtitle=&tagline=&layout=&grade=
// ?shot=editor — renders the editor with both samples loaded.
// Sets window.__shotReady when the view has finished rendering.
import { state, photos, loadImage, guessFace, render } from './main.js';
import { exportCover } from './cover.js';

function param(name, fallback) {
  const v = new URLSearchParams(location.search).get(name);
  return v === null || v === '' ? fallback : v;
}

async function loadPhoto(name) {
  if (!name) return null;
  const file = name.includes('.') ? name : `${name}.jpg`;
  return loadImage(`samples/${file}`);
}

async function shotCover() {
  document.body.classList.add('shot-cover');
  const size = param('size', 'landscape');
  const photoName = param('photo', 'boulevard');
  const caption = param('caption', '');
  state.size = ['square', 'portrait', 'landscape'].includes(size) ? size : 'landscape';
  state.layout = param('layout', state.layout);
  state.grade = param('grade', state.grade);
  if (param('title', '')) state.title = param('title', '').replace(/\\n/g, '\n');
  if (param('subtitle', '')) state.subtitle = param('subtitle', '');
  if (param('tagline', '')) state.tagline = param('tagline', '');
  if (caption) state.subtitle = caption;
  try {
    const a = await loadPhoto(photoName);
    const b = await loadPhoto(photoName === 'boulevard' ? 'pier' : 'boulevard');
    photos.A = a; photos.B = b;
    guessFace('A'); guessFace('B');
  } catch { /* samples are bundled; a miss still renders the gradient fallback */ }
  await document.fonts.ready;
  const canvas = exportCover(state.size, photos, state);
  const stage = document.getElementById('shotStage');
  stage.innerHTML = '';
  stage.appendChild(canvas);
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100vh';
  window.__shotReady = true;
}

async function shotEditor() {
  const photoName = param('photo', 'boulevard');
  state.layout = param('layout', state.layout);
  state.grade = param('grade', state.grade);
  try {
    photos.A = await loadPhoto(photoName);
    photos.B = await loadPhoto(photoName === 'boulevard' ? 'pier' : 'boulevard');
    guessFace('A'); guessFace('B');
  } catch { /* fall through */ }
  await document.fonts.ready;
  render();
  window.__shotReady = true;
}

window.addEventListener('DOMContentLoaded', async () => {
  const { initEditor } = await import('./main.js');
  const shot = param('shot', '');
  if (shot === 'cover') { await shotCover(); return; }
  initEditor();
  if (shot === 'editor') { await shotEditor(); }
  else { window.__shotReady = true; }
});
