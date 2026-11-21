// Last Exit Paradise — deterministic shot views (round-3 rebuild, 2026-11-21).
// ?shot=cover&size=&photo=&caption=&title=&subtitle=&tagline=&layout=&grade=
// ?shot=editor — renders the editor with both samples loaded.
// Sets window.__shotReady when the view has finished rendering.
function param(name, fallback) {
  const v = new URLSearchParams(location.search).get(name);
  return v === null || v === '' ? fallback : v;
}

async function shotCover(mod) {
  const { state, photos, loadImage, guessFace } = mod;
  const { exportCover } = await import('./cover.js');
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
    const file = photoName.includes('.') ? photoName : `${photoName}.jpg`;
    const other = photoName === 'boulevard' ? 'pier.jpg' : 'boulevard.jpg';
    photos.A = await loadImage(`samples/${file}`);
    photos.B = await loadImage(`samples/${other}`);
    guessFace('A');
    guessFace('B');
  } catch { /* samples are bundled; a miss still renders the gradient fallback */ }
  try {
    await document.fonts.ready;
  } catch { /* local fonts; a miss still renders */ }
  const canvas = exportCover(state.size, photos, state);
  const stage = document.getElementById('shotStage');
  stage.innerHTML = '';
  stage.appendChild(canvas);
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100vh';
  window.__shotReady = true;
}

async function shotEditor(mod) {
  const { photos, loadImage, guessFace, render } = mod;
  const photoName = param('photo', 'boulevard');
  try {
    const file = photoName.includes('.') ? photoName : `${photoName}.jpg`;
    const other = photoName === 'boulevard' ? 'pier.jpg' : 'boulevard.jpg';
    photos.A = await loadImage(`samples/${file}`);
    photos.B = await loadImage(`samples/${other}`);
    guessFace('A');
    guessFace('B');
  } catch { /* fall through */ }
  try {
    await document.fonts.ready;
  } catch { /* local fonts; a miss still renders */ }
  render();
  window.__shotReady = true;
}

window.addEventListener('DOMContentLoaded', async () => {
  const mod = await import('./main.js');
  const shot = param('shot', '');
  if (shot === 'cover') {
    await shotCover(mod);
    return;
  }
  await mod.initEditor();
  if (shot === 'editor') {
    await shotEditor(mod);
  } else {
    window.__shotReady = true;
  }
});
