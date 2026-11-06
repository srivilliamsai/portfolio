import React, { useEffect, useRef } from 'react';
import { signatureStrokes } from '../../data/signature';
import { createSignatureTimeline, paperFoldFrame, signatureFrame } from '../../services/referenceMotion';

export function shouldShowIntro() {
  return typeof window !== 'undefined' && window.location.pathname === '/' && !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export default function PortfolioIntro({ onComplete }) {
  const shell = useRef(null);
  const page = useRef(null);
  const fold = useRef(null);
  const signature = useRef(null);
  useEffect(() => {
    let frame;
    const strokes = [...signature.current.querySelectorAll('path')];
    const timeline = createSignatureTimeline(strokes.map((stroke) => stroke.getTotalLength()));
    const startedAt = document.timeline.currentTime ?? performance.now();
    const animations = strokes.map((stroke, index) => {
      const { duration, delay } = timeline.strokes[index];
      const animation = stroke.animate([{ strokeDashoffset: 1, visibility: 'visible' }, { strokeDashoffset: 0, visibility: 'visible' }], {
        duration, delay, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards',
      });
      animation.startTime = startedAt;
      return animation;
    });
    const finish = () => onComplete();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { if (media.matches) finish(); };
    const draw = (time) => {
      const state = signatureFrame(timeline, time - startedAt);
      if (shell.current && shell.current.dataset.phase !== state.phase) shell.current.dataset.phase = state.phase;
      if (state.phase === 'complete') { finish(); return; }
      if (state.phase === 'folding' && page.current && fold.current) {
        const paper = paperFoldFrame(state.foldProgress, window.innerWidth, window.innerHeight);
        page.current.style.clipPath = paper.page;
        fold.current.style.clipPath = paper.fold;
        fold.current.style.background = paper.shade;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    const fallback = window.setTimeout(finish, 6500);
    const escape = (event) => { if (event.key === 'Escape') finish(); };
    document.addEventListener('keydown', escape);
    media.addEventListener('change', change);
    return () => {
      animations.forEach((animation) => animation.cancel()); cancelAnimationFrame(frame); clearTimeout(fallback);
      document.removeEventListener('keydown', escape); media.removeEventListener('change', change);
    };
  }, [onComplete]);
  return <div ref={shell} className="reference-intro reference-palette" aria-label="Welcome to Sri Villiam Sai’s portfolio">
    <div className="reference-intro-page" ref={page}>
      <div className="reference-intro-identity">
        <svg ref={signature} className="reference-intro-signature" viewBox="0 0 1120 260" role="img" aria-label="Sri Villiam Sai">
          {signatureStrokes.map((stroke, index) => <path key={index} d={stroke} pathLength="1" visibility="hidden" />)}
        </svg>
      </div>
    </div>
    <div className="reference-intro-fold-shadow" aria-hidden="true"><div className="reference-intro-fold" ref={fold} /></div>
  </div>;
}
