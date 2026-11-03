import { useEffect } from 'react';
import { absoluteUrl } from '../../config/site';

export default function SEO({ title, description, canonical, noIndex = false }) {
  useEffect(() => {
    const setMeta = (attribute, key, value) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.content = value;
    };
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = absoluteUrl(canonical);
      setMeta('property', 'og:url', absoluteUrl(canonical));
    } else if (noIndex) {
      document.querySelector('link[rel="canonical"]')?.remove();
    }
  }, [title, description, canonical, noIndex]);

  return null;
}
