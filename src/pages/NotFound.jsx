import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import SEO from '../components/common/SEO';
import RollingArrow from '../components/common/RollingArrow';
import { useSound } from '../context/SoundContext';
import { DIAL_DIGITS, ERROR_DIGITS, modulo, nextDialTurn, easeInOutCubic } from '../services/referenceMotion';
const horizontal = (y) => `10,${y} 16,${y-6} 48,${y-6} 54,${y} 48,${y+6} 16,${y+6}`;
const vertical = (x,top,bottom) => `${x},${top} ${x+6},${top+6} ${x+6},${bottom-6} ${x},${bottom} ${x-6},${bottom-6} ${x-6},${top+6}`;
const segments = { top:horizontal(8), upperRight:vertical(56,10,52), lowerRight:vertical(56,56,98), bottom:horizontal(100), lowerLeft:vertical(8,56,98), upperLeft:vertical(8,10,52), middle:horizontal(54) };
const litSegments = {0:['top','upperRight','lowerRight','bottom','lowerLeft','upperLeft'],4:['upperLeft','middle','upperRight','lowerRight']};
function DisplayDigit({ digit, on }) {
  return <svg viewBox="0 0 64 108" data-on={on || undefined} aria-hidden="true">{Object.entries(segments).map(([name,points])=><polygon key={name} points={points} data-lit={litSegments[digit].includes(name) || undefined} />)}</svg>;
}
export default function NotFound() {
  const wheel = useRef(null);
  const angle = useRef(0);
  const sound = useSound('404');
  const playSound = useRef(sound.playSound); playSound.current=sound.playSound;
  const [complete,setComplete]=useState(0);
  const [selected,setSelected]=useState(0);
  const [replay,setReplay]=useState(0);
  const reduceMotion=useReducedMotion();
  useEffect(()=>{
    let timer, frame;
    if(reduceMotion){setComplete(3);setSelected(3);angle.current=252;if(wheel.current)wheel.current.style.setProperty('--dial-angle','252deg');return;}
    const turn=(index)=>{
      if(index===ERROR_DIGITS.length)return;
      const segment=nextDialTurn(angle.current,ERROR_DIGITS[index]);
      let start,previous=selected;
      const animate=(time)=>{
        start??=time;
        const progress=Math.min(1,(time-start)/segment.duration);
        angle.current=segment.from+(segment.to-segment.from)*easeInOutCubic(progress);
        if(wheel.current)wheel.current.style.setProperty('--dial-angle',`${angle.current}deg`);
        const current=modulo(Math.round(-angle.current/36),10);
        if(current!==previous){previous=current;setSelected(current);playSound.current('click');}
        if(progress<1)frame=requestAnimationFrame(animate);
        else{setComplete(index+1);timer=setTimeout(()=>turn(index+1),260);}
      };
      frame=requestAnimationFrame(animate);
    };
    setComplete(0);timer=setTimeout(()=>turn(0),replay?150:650);
    return()=>{clearTimeout(timer);cancelAnimationFrame(frame);};
  },[replay,reduceMotion]);
  return <>
    <SEO title="Page not found | Sri Villiam Sai" description="This page isn’t in service. Return to the homepage or explore my work." noIndex />
    <section className="reference-not-found reference-palette" aria-labelledby="not-found-heading">
      <div className="reference-error-container">
        <div className="reference-error-copy"><h1 id="not-found-heading">Wrong number</h1><p>This page isn’t in service. It may have moved, or the link may have a typo.</p></div>
        <div className="reference-error-dial">
          <button type="button" className="reference-error-print" aria-label="404. Dial again" data-custom-sound onClick={()=>{playSound.current('shuffle');setReplay(value=>value+1);}}><span className="reference-error-display">{ERROR_DIGITS.map((digit,index)=><DisplayDigit key={index} digit={digit} on={index<complete} />)}</span></button>
          <div className="reference-dial-stage" aria-hidden="true">
            <div className="reference-dial-body"><div className="reference-dial-wheel" ref={wheel} style={{'--dial-angle':'0deg'}}>
              <img src="/static/media/dial/brass-wheel.webp" className="reference-dial-layer" alt="" draggable="false" />
              {DIAL_DIGITS.map((digit,index)=><div key={digit} className="reference-dial-hole" data-selected={index===selected || undefined} style={{'--dial-index':index}}><div className="reference-dial-hole-face"><div className="reference-dial-hole-window">{digit}</div><img src="/static/media/dial/brass-lip.webp" className="reference-dial-layer" alt="" draggable="false" /></div></div>)}
            </div><img src="/static/media/dial/brass-top.webp" className="reference-dial-layer" alt="" draggable="false" /></div>
            <div className="reference-dial-fade" />
          </div>
          <div className="reference-error-cta"><Link to="/" className="reference-button">Back to the homepage <RollingArrow /></Link><nav className="reference-error-links" aria-label="Other pages"><Link to="/#projects" className="reference-underline">See my work</Link><Link to="/blog" className="reference-underline">Read the blog</Link></nav></div>
        </div>
      </div>
    </section>
  </>;
}
