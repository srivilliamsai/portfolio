import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { decodeFragment, scrollToSection } from '../../utils/scroll';

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    let observer;
    let timeout;
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const scroll = () => scrollToSection(decodeFragment(hash), { focus: hash === '#main-content' });
        if (!scroll()) {
          // A lazy route may not have mounted its fragment target yet.
          observer = new MutationObserver(() => { if (scroll()) observer.disconnect(); });
          observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
          timeout = setTimeout(() => observer.disconnect(), 5000);
        }
      } else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); clearTimeout(timeout); };
  }, [pathname, hash, key]);
  return null;
}
