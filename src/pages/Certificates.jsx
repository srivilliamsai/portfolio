import React, { useCallback, useEffect, useRef, useState } from 'react';
import BackLink from '../components/common/BackLink';
import SEO from '../components/common/SEO';
import CredlyCredentials from '../components/portfolio/CredlyCredentials';
import { portfolio } from '../data/portfolio';
import { certificates } from '../data/certificates';

const formatDate = (value) => new Date(value + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// Justified rows keep every document's original proportions, like the Playground.
const galleryLayout = (columns, gap) => {
  const layout = [];
  for (let start = 0; start < certificates.length;) {
    const remaining = certificates.length - start;
    // Balance the last rows instead of stretching a lone document across the page.
    const count = Math.min(columns, remaining === columns + 1 ? columns - 1 : remaining);
    const row = certificates.slice(start, start + count);
    const total = row.reduce((sum, item) => sum + item.width / item.height, 0);
    row.forEach((certificate) => {
      const share = (certificate.width / certificate.height) / total;
      layout.push({ width: `${share * 100}%`, gap: `${(count - 1) * gap * share}px` });
    });
    start += count;
  }
  return layout;
};
const wideLayout = galleryLayout(3, 12);
const phoneLayout = galleryLayout(2, 8);
const gallery = certificates.map((certificate, index) => ({ ...certificate, style: {
  '--tile-ratio': certificate.width / certificate.height,
  '--wide-width': wideLayout[index].width, '--wide-gap': wideLayout[index].gap,
  '--phone-width': phoneLayout[index].width, '--phone-gap': phoneLayout[index].gap,
  '--tile-delay': `${Math.min(index, 8) * 35}ms`,
} }));

function CertificateViewer({ certificate, index, count, onStep, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
    };
  }, []);
  return <dialog ref={dialogRef} className="certificate-viewer" aria-labelledby="certificate-viewer-title" aria-describedby="certificate-viewer-description"
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={(event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        onStep(event.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
    <div className="certificate-viewer-content">
      <div className="sr-only">
        <h2 id="certificate-viewer-title">{certificate.title}</h2>
        <p id="certificate-viewer-description">{certificate.issuer}. {certificate.kind}. {certificate.issued}.
          {certificate.validUntil && <> Valid through {formatDate(certificate.validUntil)}.</>}
          {certificate.note && <> {certificate.note}</>}
        </p>
      </div>
      <img key={certificate.id} className="certificate-viewer-image" src={certificate.src} alt={certificate.title + ' — ' + certificate.issuer} width={certificate.width} height={certificate.height} />
      <nav className="certificate-viewer-controls" aria-label="Certificate viewer controls">
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous certificate">← Prev</button>
        <span aria-live="polite" aria-atomic="true">{index + 1} / {count}</span>
        <button type="button" onClick={() => onStep(1)} aria-label="Next certificate">Next →</button>
        <button type="button" ref={closeRef} onClick={onClose} aria-label="Close certificate viewer">Close</button>
      </nav>
    </div>
  </dialog>;
}


export default function Certificates() {
  const [selected, setSelected] = useState(null);
  const selectedIndex = certificates.findIndex((certificate) => certificate.id === selected);
  const closeViewer = useCallback(() => setSelected(null), []);
  const step = (direction) => setSelected((current) => {
    const index = certificates.findIndex((certificate) => certificate.id === current);
    return certificates[(index + direction + certificates.length) % certificates.length].id;
  });
  return <>
    <SEO title="Certificates | Sri Villiam Sai" description="Three selected certificates from Google Cloud, MongoDB and Anthropic, followed by all 117 badges and credentials from Sri’s public Credly profile." canonical="/certificates" />
    <section className="certificates-page" aria-labelledby="certificates-title">
      <header className="certificates-header">
        <h1 id="certificates-title">Certificates</h1>
        <p className="sr-only">Three selected certificates. Open any certificate to view it larger.</p>
      </header>
      <ul className="certificate-gallery" aria-label="Certificate gallery">
        {gallery.map((certificate, index) => <li key={certificate.id} style={certificate.style}>
          <button className="certificate-tile" type="button" aria-label={'View ' + certificate.title + ' — ' + certificate.issuer} aria-haspopup="dialog" onClick={() => setSelected(certificate.id)}
            onPointerMove={(event) => {
              if (event.pointerType === 'touch') return;
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty('--view-x', `${event.clientX - rect.left}px`);
              event.currentTarget.style.setProperty('--view-y', `${event.clientY - rect.top}px`);
            }} onPointerLeave={(event) => {
              event.currentTarget.style.removeProperty('--view-x');
              event.currentTarget.style.removeProperty('--view-y');
            }}>
            <img src={certificate.thumbnail} alt="" width={certificate.width} height={certificate.height} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
            <span className="certificate-tile-view" aria-hidden="true">View</span>
            <span className="sr-only">{certificate.kind} · {certificate.issued}</span>
          </button>
        </li>)}
      </ul>
      <CredlyCredentials />
      <footer className="certificates-footer">
        <BackLink to="/#certifications">Back to learning</BackLink>
        <a className="portfolio-metal-button" href={portfolio.credentials} target="_blank" rel="noreferrer">View credentials on Credly <span aria-hidden="true">↗</span></a>
      </footer>
    </section>
    {selectedIndex >= 0 && <CertificateViewer certificate={certificates[selectedIndex]} index={selectedIndex} count={certificates.length} onStep={step} onClose={closeViewer} />}
  </>;
}
