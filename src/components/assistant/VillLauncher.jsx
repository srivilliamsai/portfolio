import React, { useEffect, useId, useRef, useState } from 'react';

// The reference's little screen, placed in the site's own navigation.
export default function VillLauncher({ onOpen, onPrepare, className = '' }) {
  const id = useId().replaceAll(':', '');
  const face = useRef(null), eyes = useRef(null);
  const [happy, setHappy] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, blink = 0, open = 0;
    const move = event => {
      if (reduced.matches || document.hidden || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = face.current?.getBoundingClientRect();
        if (!rect || !eyes.current) return;
        const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / 300));
        const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / 300));
        eyes.current.style.translate = `${x * 4}px ${y * 2.5}px`;
      });
    };
    const schedule = () => {
      blink = window.setTimeout(() => {
        if (!reduced.matches && !document.hidden) {
          eyes.current?.classList.add('is-blinking');
          open = window.setTimeout(() => eyes.current?.classList.remove('is-blinking'), 120);
        }
        schedule();
      }, 2400 + Math.random() * 3000);
    };
    window.addEventListener('pointermove', move, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
      clearTimeout(blink);
      clearTimeout(open);
    };
  }, []);
  return <button type="button" className={`vill-launcher ${className}`} onClick={onOpen}
    onPointerEnter={() => { setHappy(true); onPrepare?.(); }} onPointerLeave={() => setHappy(false)} onPointerDown={() => onPrepare?.()}
    onFocus={() => { setHappy(true); onPrepare?.(); }} onBlur={() => setHappy(false)}
    aria-label="Say hello to WILL" aria-haspopup="dialog">
    <svg ref={face} className="vill-launcher-face" viewBox="0 0 64 48" width="40" height="30" aria-hidden="true">
      <defs>
        <radialGradient id={`vill-face-${id}`} cx=".45" cy=".4" r=".75"><stop stopColor="var(--launcher-screen-highlight)"/><stop offset=".6" stopColor="var(--launcher-screen-mid)"/><stop offset="1" stopColor="var(--launcher-screen-edge)"/></radialGradient>
        <pattern id={`vill-lines-${id}`} width="3" height="2" patternUnits="userSpaceOnUse"><rect width="3" height=".7" fill="var(--launcher-screen-lines)" opacity=".2"/></pattern>
      </defs>
      <rect x="1" y="1" width="62" height="46" rx="12" fill="var(--launcher-frame)"/>
      <rect x="5" y="5" width="54" height="38" rx="9" fill={`url(#vill-face-${id})`}/>
      <rect x="5" y="5" width="54" height="38" rx="9" fill={`url(#vill-lines-${id})`}/>
      <g ref={eyes} className="vill-launcher-eyes">
        {happy ? <path d="m18 25 5-5 5 5m8 0 5-5 5 5" fill="none" stroke="var(--launcher-eyes)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/> : <g fill="var(--launcher-eyes)"><rect x="20" y="15" width="6" height="12" rx="3"/><rect x="38" y="15" width="6" height="12" rx="3"/><rect x="29" y="31" width="6" height="2.6" rx="1.3"/></g>}
      </g>
      <rect x="5" y="5" width="54" height="14" rx="9" fill="#fff" opacity=".12"/>
    </svg>
    <span className="vill-launcher-tip">Say hello to WILL</span>
  </button>;
}
