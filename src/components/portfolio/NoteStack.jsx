import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Reveal from '../common/Reveal';

const tilts=[-1.2,2.6,-3.4];

export default function NoteStack({items,getKey,label,itemLabel,nextLabel,previousLabel,renderCard,footer,onMove,showCount=true,className=''}) {
  const [active,setActive]=useState(0);
  const [leaving,setLeaving]=useState(null);
  const [height,setHeight]=useState();
  const stack=useRef(null),timer=useRef(null),locked=useRef(false),swipe=useRef(null);
  const reduceMotion=useReducedMotion();
  const move=(direction=1)=>{
    if(locked.current||items.length<2)return;
    onMove?.();
    if(!reduceMotion){
      locked.current=true;
      setLeaving({index:active,direction});
      timer.current=setTimeout(()=>{setLeaving(null);locked.current=false;},420);
    }
    setActive(value=>(value+direction+items.length)%items.length);
  };
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useLayoutEffect(()=>{
    const card=stack.current?.querySelector('[data-place="0"]');
    if(!card)return;
    const measure=()=>setHeight(card.offsetHeight);
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(card);
    return()=>observer.disconnect();
  },[active]);
  const cancelSwipe=()=>{
    const start=swipe.current;swipe.current=null;
    if(start){delete start.note.dataset.dragging;start.note.style.translate='';start.note.style.rotate='';}
    return start;
  };
  const onArrow=event=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();move(event.key==='ArrowRight'?1:-1);
    }
  };
  // Only mount the visible stack and departing card, keeping large collections light.
  const indices=[...new Set([active,(active+1)%items.length,(active+2)%items.length,...(leaving?[leaving.index]:[])])];
  return <Reveal className={`reference-notes-container ${className}`}>
    {showCount&&<div className="reference-notes-heading"><span aria-live="polite" aria-atomic="true"><span className="sr-only">{itemLabel} </span>{String(active+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span></div>}
    <div className="reference-note-stack" ref={stack} style={{height}} role="region" aria-label={label} aria-roledescription="carousel" aria-live={showCount?undefined:'polite'} tabIndex={0} onKeyDown={onArrow}
      onPointerDown={event=>{
        if(event.pointerType==='mouse'||event.target.closest('a,button,summary,details')||locked.current)return;
        const note=event.target.closest('[data-place="0"]');
        if(note)swipe.current={id:event.pointerId,x:event.clientX,y:event.clientY,time:performance.now(),note};
      }}
      onPointerMove={event=>{
        const start=swipe.current;
        if(!start||start.id!==event.pointerId)return;
        const dx=event.clientX-start.x,dy=event.clientY-start.y;
        if(start.sideways===undefined&&Math.hypot(dx,dy)>8)start.sideways=Math.abs(dx)>Math.abs(dy);
        if(start.sideways){
          event.currentTarget.setPointerCapture(event.pointerId);
          start.note.dataset.dragging='true';
          start.note.style.translate=`${dx}px ${-.04*Math.abs(dx)}px`;
          start.note.style.rotate=`calc(var(--note-lean) + ${.05*dx}deg)`;
        }
      }}
      onPointerUp={event=>{
        const start=cancelSwipe();
        if(!start||start.id!==event.pointerId)return;
        const dx=event.clientX-start.x;
        if(start.sideways&&(Math.abs(dx)>56||Math.abs(dx)/Math.max(1,performance.now()-start.time)>.45))move(dx>0?1:-1);
      }} onPointerCancel={cancelSwipe}>
      {indices.map(index=>{
        const item=items[index],place=(index-active+items.length)%items.length;
        const front=place===0,outgoing=leaving?.index===index;
        return <article key={getKey(item)} className="reference-note" data-place={Math.min(place,3)} data-leaving={outgoing?(leaving.direction>0?'right':'left'):undefined}
          aria-hidden={!front} inert={!front} aria-label={`${item.title}, ${itemLabel.toLowerCase()} ${index+1} of ${items.length}`}
          style={{'--note-lean':`${tilts[outgoing?0:place%3]}deg`,zIndex:outgoing?4:3-Math.min(place,3)}}
          onClick={event=>{if(front&&!event.target.closest('a,button,summary,details'))move();}}>
          {renderCard(item)}
        </article>;
      })}
    </div>
    <div className={`reference-notes-controls${previousLabel?' has-previous':''}`} data-custom-sound onKeyDown={onArrow}>
      {previousLabel&&<button type="button" className="reference-underline" onClick={()=>move(-1)} disabled={items.length<2}>← {previousLabel}</button>}
      <button type="button" className="reference-underline" onClick={()=>move()} disabled={items.length<2}>{nextLabel} →</button>
    </div>
    {footer}
  </Reveal>;
}
