// Fixed scenes for screenshots: ?shot=editor shows the page with a sample photo;
// ?shot=cover shows the cover alone at the requested export size.
// window.__shotReady is set once the cover has been painted.
export async function runShot(shot, query, api) {
  const photo = query.get('photo') ?? 'boulevard';
  const other = photo === 'boulevard' ? 'pier' : 'boulevard';
  const caption = query.get('caption');
  if (caption) {
    const words = caption.trim().toUpperCase().split(/\s+/);
    if (words.length > 1) {
      const half = Math.ceil(words.length / 2);
      api.setState({ title: words.slice(0, half).join(' '), title2: words.slice(half).join(' ') });
    } else {
      api.setState({ title: caption.trim().toUpperCase(), title2: '' });
    }
  }
  if (query.get('title')) api.setState({ title: query.get('title'), title2: query.get('title2') ?? '' });
  if (query.get('subtitle')) api.setState({ subtitle: query.get('subtitle') });
  if (query.get('tagline')) api.setState({ tagline: query.get('tagline') });
  if (query.get('layout')) api.setState({ layout: query.get('layout') });
  if (query.get('grade')) api.setState({ grade: query.get('grade') });
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    api.setState({ size: query.get('size') || 'landscape' });
  }
  await api.loadPhoto(0, `samples/${photo}.jpg`, `${photo}.jpg (sample)`);
  await api.loadPhoto(1, `samples/${other}.jpg`, `${other}.jpg (sample)`);
  await api.redraw();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    window.__shotReady = true;
  }));
}
