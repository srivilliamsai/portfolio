export function decodeFragment(hash = '') {
  const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
  try { return decodeURIComponent(fragment); }
  catch { return fragment; }
}

export function scrollBehavior(reducedMotion = false) {
  return reducedMotion ? 'instant' : 'smooth';
}

export function scrollToSection(id, { focus = false } = {}) {
  const target = document.getElementById(id);
  if (!target) return false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: scrollBehavior(reducedMotion) });
  if (focus) target.focus({ preventScroll: true });
  return true;
}
