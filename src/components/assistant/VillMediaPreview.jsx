import React, { useCallback, useLayoutEffect, useRef } from 'react';
import {spotifyEmbedUrl} from '../../services/assistantMusic.js';

export default function VillMediaPreview({ media, companions = [], onDismiss }) {
  const card = useRef(null), animation = useRef(null), animated = useRef(false);
  const animateFromGallery = useCallback(() => {
    const target = card.current;
    if (!target || animated.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const source = [...document.querySelectorAll('[data-will-media]')].find(element => element.dataset.willMedia === media.id);
    const origin = source?.getBoundingClientRect(), destination = target.getBoundingClientRect();
    if (!origin?.width || !origin.height || !destination.width || !destination.height || !target.animate) return;
    animated.current = true;
    animation.current = target.animate([
      { transform: `translate(${origin.left + origin.width / 2 - destination.left - destination.width / 2}px, ${origin.top + origin.height / 2 - destination.top - destination.height / 2}px) scale(${origin.width / destination.width})`, opacity: .5 },
      { transform: 'none', opacity: 1 }
    ], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  }, [media.id]);
  useLayoutEffect(() => {
    animated.current = false;
    animateFromGallery();
    return () => animation.current?.cancel();
  }, [animateFromGallery]);
  const embed=media.kind==='song'?spotifyEmbedUrl(media.spotifyUrl):null;
  if(embed)return <figure className="vill-spot is-song" aria-label={`${media.title} player`}><iframe title={`${media.title} on Spotify`} src={embed} width="100%" height="152" allow="encrypted-media; fullscreen; picture-in-picture" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/></figure>;
  return <figure className={`vill-spot ${companions.length?'has-pair':''}`} aria-label={companions.length?'Villiam’s two portraits':media.title}><div className="vill-spot-images">
    <button ref={card} className="vill-spot-card" type="button" onClick={onDismiss} aria-label="Put image back" title="Click to put back">
      <img src={media.src} alt={media.title} width={media.width} height={media.height} onLoad={animateFromGallery} draggable="false"/>
      <span className="vill-spot-scan" aria-hidden="true"/>
    </button>
    {companions.map(item=><button className="vill-spot-card" type="button" onClick={onDismiss} aria-label="Put portraits back" key={item.id}><img src={item.src} alt={item.title} width={item.width} height={item.height} draggable="false"/><span className="vill-spot-scan" aria-hidden="true"/></button>)}</div>
  </figure>;
}
