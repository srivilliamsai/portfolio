import React, { useEffect, useRef } from 'react';

const screen = { left: '19.8%', top: '32.7%', width: '60.4%', height: '51.9%' };
const baseEye = () => ({ x: 0, y: 0, width: 66, height: 124, smile: 0, star:0 });

// Face geometry follows the screen cutout in the supplied reference robot artwork.
export default function VillMascot({ state = 'idle', level = 0, levelRef }) {
  const root = useRef(null), rig = useRef(null), canvas = useRef(null), shadow = useRef(null);
  const current = useRef({ state, level }), repaint = useRef(null);
  current.current = { state, level, levelRef };
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context || !root.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.current.width = 563 * ratio;
    canvas.current.height = 372 * ratio;
    const gaze = { x: 0, y: 0, over: false };
    const eyes = [baseEye(), baseEye()];
    const velocities=eyes.map(eye=>Object.fromEntries(Object.keys(eye).map(key=>[key,0])));
    let previous=state,hop=0,hopVelocity=0,squash=0,glitchUntil=0,smoothedLevel=0;
    let frame = 0, disposed = false, visible = true, last = 0, nextBlink = performance.now() + 1800;
    const pointer = event => {
      if (disposed || !root.current || reduced.matches || event.pointerType === 'touch') return;
      const rect = root.current.getBoundingClientRect();
      gaze.x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (window.innerWidth / 2)));
      gaze.y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (window.innerHeight / 2)));
      gaze.over = event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom;
    };
    const draw = time => {
      frame = 0;
      if (disposed || !rig.current || !shadow.current || !visible || document.hidden) return;
      const animate = !reduced.matches;
      const delta=last?Math.min(.05,Math.max(0,(time-last)/1000)):1/60;
      last = time;
      const { state: mood } = current.current;
      const raw=Math.max(0,Math.min(1,current.current.levelRef?.current??current.current.level));
      smoothedLevel+=(raw-smoothedLevel)*(1-Math.exp(-delta*18));
      const volume=['speaking','excited'].includes(mood)?smoothedLevel:0,sleeping=mood==='sleeping';
      if(previous!==mood){if(animate){glitchUntil=time+110;if(mood==='happy'||mood==='speaking'||mood==='excited')hopVelocity=mood==='excited'?3.2:2.3;}previous=mood;}
      const blinking = animate && time > nextBlink && time < nextBlink + 130;
      if (time > nextBlink + 130) nextBlink = time + 2000 + Math.random() * 3600;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, 563, 372);
      eyes.forEach((eye, index) => {
        const saccade=animate&&!sleeping?Math.sin(time/3100+index*.15)*2:0;
        const target = { ...baseEye(), x: animate&&!sleeping ? gaze.x * 40+saccade : 0, y: animate&&!sleeping ? gaze.y * 24 : 0 };
        if (mood === 'thinking' || mood === 'connecting') Object.assign(target, { x: 36 + (animate ? Math.sin(time / 420) * 26 : 0), y: -26, height: 65 });
        else if(mood==='excited')Object.assign(target,{star:1});
        else if (mood === 'speaking') Object.assign(target, { width: 58 - volume * 6, height: 104 + volume * 26, y: target.y - volume * 8 });
        else if (mood === 'happy' || gaze.over) Object.assign(target, { smile: 1, height: 96, width: 68, y: -6 });
        else if (mood === 'listening') Object.assign(target, { width: 64, height: 128, y: target.y - 4 });
        else if(sleeping)Object.assign(target,{width:62,height:8,y:22+(animate?Math.sin(time/1000)*3:0)});
        if (blinking) target.height = 8;
        if(!animate)Object.assign(eye,target);
        else for(let remaining=delta;remaining>0;){const dt=Math.min(remaining,1/120);for(const key of Object.keys(eye)){velocities[index][key]+=((target[key]-eye[key])*250-velocities[index][key]*21)*dt;eye[key]+=velocities[index][key]*dt;}remaining-=dt;}
        const x = (index ? 365 : 198) + eye.x, y = 168 + eye.y;
        context.fillStyle = '#073b36';
        if(eye.star>.5){context.beginPath();const rotation=animate?Math.sin(time/300)*.3*(index?-1:1):0;for(let point=0;point<10;point++){const angle=-Math.PI/2+rotation+point*Math.PI/5,radius=point%2?21:46;context.lineTo(x+Math.cos(angle)*radius,y+Math.sin(angle)*radius);}context.closePath();context.fill();return;}
        context.save();
        context.beginPath();
        context.roundRect(x - eye.width / 2, y - eye.height / 2, Math.max(6,eye.width), Math.max(6, eye.height), Math.max(0,Math.min(eye.width, eye.height) / 2));
        context.clip();
        context.fillRect(x - eye.width, y - eye.height, eye.width * 2, eye.height * 2);
        if (eye.smile > .01) {
          context.globalCompositeOperation = 'destination-out';
          context.beginPath();
          context.ellipse(x, y + eye.height * (1.2 - eye.smile * .38), eye.width * .95, eye.height * .6, 0, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        if (eye.height > 40 && eye.smile < .4) {
          context.fillStyle = 'rgba(210,255,248,.6)';
          context.beginPath();
          context.ellipse(x + eye.width * .18, y - eye.height * .22, eye.width * .12, eye.height * .09, 0, 0, Math.PI * 2);
          context.fill();
        }
      });
      if (mood === 'thinking' || mood === 'connecting') {
        for (let i = 0; i < 3; i++) {
          context.globalAlpha = animate ? .35 + .65 * Math.max(0, Math.sin(time / 180 - i * .9)) : .7;
          context.fillStyle = '#073b36';
          context.beginPath(); context.arc(255 + i * 26, 315, 7, 0, Math.PI * 2); context.fill();
        }
        context.globalAlpha = 1;
      }
      if(sleeping){context.fillStyle='rgba(4,40,36,.28)';context.fillRect(0,0,563,372);context.font='26px monospace';context.fillStyle='#073b36';for(let i=0;i<3;i++){const phase=(time/2400+i/3)%1;context.globalAlpha=animate?Math.sin(phase*Math.PI)*.55:.3;context.fillText('z',440+phase*40,130-phase*90);}context.globalAlpha=1;}
      if(volume>.02){context.fillStyle=`rgba(225,255,250,${volume*.14})`;context.fillRect(0,0,563,372);}
      if(animate&&time<glitchUntil){context.fillStyle='rgba(180,255,230,.18)';for(let i=0;i<3;i++)context.fillRect((time*13+i*71)%480,(time*7+i*97)%372,35+i*40,2);}
      if(animate){hopVelocity-=14*delta;hop+=hopVelocity*delta;if(hop<0){if(hopVelocity<-1)squash=Math.min(.10,-hopVelocity*.025);hop=0;hopVelocity=0;}squash*=Math.exp(-delta*16);}else{hop=0;hopVelocity=0;squash=0;}
      const bob = animate ? Math.sin(time / (sleeping?1000:670)) * (sleeping?2:4)-hop*36 : 0;
      const tilt = animate ? Math.sin(time / 1100) * .7 + gaze.x * 3 : 0;
      rig.current.style.transform = `translate3d(${animate&&!sleeping ? gaze.x * 6 : 0}px,${bob}px,0) rotate(${sleeping?0:tilt}deg) scale(${1+squash},${1-squash})`;
      shadow.current.style.transform = `scale(${1-Math.min(.3,hop*.35)})`;
      shadow.current.style.opacity=String(1-Math.min(.45,hop*.5));
      root.current.style.setProperty('--vill-speech-glow',String(volume));
      if (animate) frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      last=0;
      if (!document.hidden && visible) frame = requestAnimationFrame(draw);
    };
    repaint.current = resume;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    observer.observe(root.current);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.addEventListener('visibilitychange', resume);
    reduced.addEventListener('change', resume);
    resume();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('visibilitychange', resume);
      reduced.removeEventListener('change', resume);
      repaint.current = null;
    };
  }, []);
  useEffect(() => { repaint.current?.(); }, [state, level]);
  return <div ref={root} className={`vill-mascot is-${state}`} aria-hidden="true">
    <div ref={shadow} className="vill-mascot-shadow"/>
    <div ref={rig} className="vill-mascot-rig">
      <img src="/static/media/assistant/vill-robot-body.webp" width="1020" height="780" alt="" draggable="false" decoding="async"/>
      <canvas ref={canvas} className="vill-mascot-eyes" style={screen}/>
      <span className="vill-mascot-scan" style={screen}/><i className="vill-mascot-bead"/>
    </div>
  </div>;
}
