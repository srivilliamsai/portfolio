import {decodeFragment} from '../utils/scroll.js';

// One owner for history positions and fragment navigation. Pending lazy-page work
// is cancelled on a new navigation or a visitor scroll, never replayed later.
export function createScrollRestoration(environment) {
  const positions=new Map();
  const previousMode=environment.history.scrollRestoration;
  environment.history.scrollRestoration='manual';
  let currentKey=null,cancelPending=()=>{};
  const remember=()=>{if(currentKey!==null)positions.set(currentKey,Math.max(0,environment.scrollY));};
  environment.addEventListener('scroll',remember,{passive:true});
  environment.addEventListener('pagehide',remember);
  environment.addEventListener('click',remember,true);
  environment.addEventListener('popstate',remember);
  return {
    navigate({key,hash='',navigationType='PUSH'}) {
      // React has already committed the next page here. Its shorter height can
      // clamp scrollY, so never overwrite an existing departure snapshot now.
      if(currentKey!==null&&!positions.has(currentKey))remember();
      cancelPending();currentKey=key;
      while(positions.size>100)positions.delete(positions.keys().next().value);
      let frame,observer,timer,cancelled=false;
      const stop=()=>{cancelled=true;environment.cancelAnimationFrame(frame);observer?.disconnect();environment.clearTimeout(timer);for(const name of ['wheel','touchstart','pointerdown','keydown'])environment.removeEventListener(name,interact);};
      const interact=event=>{if(event.type!=='keydown'||['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))stop();};
      cancelPending=stop;
      for(const name of ['wheel','touchstart','pointerdown','keydown'])environment.addEventListener(name,interact,{passive:true});
      const apply=()=>{
        if(cancelled)return true;
        const main=environment.document.getElementById('main-content');
        if(!main||main.querySelector('[data-route-pending]'))return false;
        const saved=navigationType==='POP'?positions.get(key):undefined;
        const id=decodeFragment(hash),target=id&&environment.document.getElementById(id);
        if(saved!==undefined)environment.scrollTo({top:saved,behavior:'instant'});
        else if(id){
          if(!target)return false;
          target.scrollIntoView({behavior:navigationType==='POP'||environment.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
          if(id==='main-content')target.focus({preventScroll:true});
        }else environment.scrollTo({top:0,behavior:'instant'});
        stop();return true;
      };
      frame=environment.requestAnimationFrame(()=>{
        if(apply())return;
        observer=new environment.MutationObserver(()=>apply());
        observer.observe(environment.document.documentElement,{childList:true,subtree:true});
        timer=environment.setTimeout(stop,5000);
      });
    },
    dispose(){cancelPending();environment.removeEventListener('scroll',remember);environment.removeEventListener('pagehide',remember);environment.removeEventListener('click',remember,true);environment.removeEventListener('popstate',remember);environment.history.scrollRestoration=previousMode;}
  };
}
