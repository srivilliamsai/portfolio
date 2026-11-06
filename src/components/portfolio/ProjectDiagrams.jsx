import React,{useEffect,useId,useRef,useState} from 'react';
import {projectDiagrams} from '../../data/projectDiagrams.js';
import {projectOperations} from '../../data/projectOperations.js';
import {isoBox,isoPoint,operationSlots,svgPoints} from '../../services/projectDiagramGeometry.js';

function labelLines(text) {
  const lines=[''];
  for(const word of text.split(' ')){
    if(lines[lines.length-1]&&(lines[lines.length-1]+' '+word).length>20)lines.push(word);
    else lines[lines.length-1]+=(lines[lines.length-1]?' ':'')+word;
  }
  return lines;
}

// Both animated diagrams stop off screen, in background tabs and for reduced motion.
function useDiagramPlayback(count,{resumeAfter=0}={}) {
  const resume=useRef(null);
  useEffect(()=>()=>clearTimeout(resume.current),[]);
  const root=useRef(null);
  const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(false),[hidden,setHidden]=useState(false);
  useEffect(()=>{
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion=()=>setReduced(motion.matches),updateVisibility=()=>setHidden(document.hidden);
    updateMotion();updateVisibility();motion.addEventListener('change',updateMotion);document.addEventListener('visibilitychange',updateVisibility);
    const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.12});observer.observe(root.current);
    return()=>{observer.disconnect();motion.removeEventListener('change',updateMotion);document.removeEventListener('visibilitychange',updateVisibility);};
  },[]);
  const playing=!paused&&!reduced&&visible&&!hidden;
  useEffect(()=>{
    if(!playing)return;
    const timer=setInterval(()=>setActive(value=>(value+1)%count),3200);
    return()=>clearInterval(timer);
  },[playing,count]);
  return {root,active,paused,reduced,playing,toggle:()=>{clearTimeout(resume.current);setPaused(value=>!value);},select:index=>{
    clearTimeout(resume.current);setActive(index);setPaused(true);
    if(resumeAfter)resume.current=setTimeout(()=>setPaused(false),resumeAfter);
  }};
}
function PlaybackButton({playback,label}) {
  const {paused,reduced,toggle}=playback;
  return <button type="button" className="case-flow-play" aria-label={reduced?`${label}: automatic motion off`:`${paused?'Play':'Pause'} ${label}`} onClick={toggle} disabled={reduced}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{paused?<path d="m8 5 11 7-11 7Z"/>:<path d="M8 5v14M16 5v14"/>}</svg>
    {reduced?'Manual steps':paused?'Play':'Pause'}
  </button>;
}

export function ProjectUserFlow({id}) {
  const diagram=projectDiagrams[id],marker=useId().replaceAll(':','');
  const [zoom,setZoom]=useState(100),[selected,setSelected]=useState(null);
  const pick=node=>setSelected(current=>current===node.id?null:node.id);
  const chosen=diagram.nodes.find(node=>node.id===selected);
  return <figure className="case-interactive-flow" aria-label={`${id} interactive user flow`}>
    <header><p>User flow</p><div className="case-diagram-zoom" aria-label="Diagram zoom"><button type="button" aria-label="Zoom out user flow" disabled={zoom===60} onClick={()=>setZoom(value=>Math.max(60,value-20))}>−</button><button type="button" className="case-flow-reset" aria-label="Reset user flow zoom" onClick={()=>setZoom(100)}><output aria-live="polite">{zoom}%</output></button><button type="button" aria-label="Zoom in user flow" disabled={zoom===240} onClick={()=>setZoom(value=>Math.min(240,value+20))}>+</button></div></header>
    <h3>{diagram.title}</h3>
    <div className="case-flow-viewport" tabIndex={0} role="region" aria-label="User flow diagram. Zoom in to explore the steps."><div className="case-flow-scaled" style={{width:`${zoom}%`}}><svg viewBox="0 0 1000 370" aria-label="Select a step to read its role" className={selected?'has-selection':''}>
      <defs><marker id={`arrow-${marker}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="currentColor"/></marker></defs>
      <g className="case-flow-edges">{diagram.edges.map((edge,index)=><g key={index} className={selected&&edge.from!==selected&&edge.to!==selected?'is-muted':''}><path d={edge.path} fill="none" markerEnd={`url(#arrow-${marker})`} strokeDasharray={edge.dashed?'5 5':undefined}/>{edge.label&&<text x={edge.labelX} y={edge.labelY} textAnchor="middle">{edge.label}</text>}</g>)}</g>
      {diagram.nodes.map(node=>{
        const {x,y,width,height}=node,lines=labelLines(node.title);
        return <g key={node.id} role="button" tabIndex={0} aria-label={node.title} aria-pressed={selected===node.id} className={`case-flow-node is-${node.type} ${selected===node.id?'is-selected':selected?'is-muted':''}`} onClick={()=>pick(node)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pick(node);}}}>
          {node.type==='decision'?<polygon points={`${x},${y+height/2} ${x+width/2},${y} ${x+width},${y+height/2} ${x+width/2},${y+height}`}/>:<rect x={x} y={y} width={width} height={height} rx={node.type==='start'||node.type==='end'?25:7}/>}
          {node.type==='store'&&<path d={`M${x} ${y+10} Q${x+width/2} ${y+27} ${x+width} ${y+10}`}/>}
          <text x={x+width/2} y={y+height/2-(lines.length-1)*8+4} textAnchor="middle">{lines.map((line,index)=><tspan key={index} x={x+width/2} dy={index?16:0}>{line}</tspan>)}</text>
        </g>;
      })}
    </svg></div></div>
    <figcaption aria-live="polite">{chosen?<><strong>{chosen.title}{/[.!?]$/.test(chosen.title)?'':'.'}</strong> {chosen.detail}</>:'Tap any step to isolate it and read what it does. Zoom in for a closer look.'}</figcaption>
  </figure>;
}

function Connector({live}) {
  return <span className={`case-system-connector ${live?'is-live':''}`} aria-hidden="true"><svg viewBox="0 0 40 24"><path d="M2 12h33m-7-6 7 6-7 6"/><circle cx="9" cy="12" r="2.5"/></svg></span>;
}
export function ProjectSystemFlow({id}) {
  const flow=projectDiagrams[id].walkthrough,playback=useDiagramPlayback(flow.steps.length),{active,paused,playing,root,select}=playback;
  return <figure className={`case-system-flow ${playing?'is-playing':''}`} ref={root} aria-label={`${id} animated product walkthrough`}>
    <header><p>System flow</p><PlaybackButton playback={playback} label="product walkthrough"/></header>
    <h3>{flow.heading}</h3>
    <div className="case-system-viewport"><div className="case-system-canvas">
      <div className={`case-system-client ${id==='dinedesk'||id==='invoice-picker'?'is-desktop':'is-mobile'}`}><p>{flow.client}</p><div className="case-system-device"><img src={flow.image.src} alt={flow.image.alt} loading="lazy" decoding="async"/></div><span className="case-system-reply" data-ready={active===flow.steps.length-1}>{active===flow.steps.length-1?'Result ready':'Request context'}</span></div>
      <Connector live={active<flow.steps.length-1}/>
      <div className="case-system-core"><p>{flow.title}</p><ol>{flow.steps.map((step,index)=><li key={step.title}><button type="button" className={active===index?'is-active':active>index?'is-complete':''} aria-pressed={active===index} onClick={()=>select(index)}><span className="case-system-step-dot" aria-hidden="true"/><strong>{step.title}</strong><small>{step.tag}</small></button></li>)}</ol></div>
      <Connector live={active===flow.steps.length-1}/>
      <div className="case-system-outputs">{flow.outputs.map((output,index)=><div key={output.title} className={active===flow.steps.length-1?'is-ready':''}><span className="case-output-symbol" aria-hidden="true">{index?'▤':'▦'}</span><strong>{output.title}</strong><p>{output.detail}</p></div>)}</div>
    </div></div>
    <figcaption aria-live={paused?'polite':'off'}><strong>{String(active+1).padStart(2,'0')} / {flow.steps[active].title}.</strong> {flow.steps[active].detail}</figcaption>
  </figure>;
}

const iconPaths={
  pin:'M12 22S4 15 4 9a8 8 0 0 1 16 0c0 6-8 13-8 13Zm0-17a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  grid:'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
  route:'M3 5h9v7h9M8 1l4 4-4 4M17 8l4 4-4 4M3 12v9h9',
  shield:'m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Zm-5 9 4 4 6-7',
  data:'M3 6c0-5 18-5 18 0s-18 5-18 0Zm0 0v12c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0',
  check:'m3 12 6 6L22 5',
  document:'M5 2h10l5 5v15H5Zm9 0v6h6M8 12h9M8 16h9',
  calculator:'M4 2h16v20H4Zm3 3h10v5H7Zm0 9h3m4 0h3M7 18h3m4 0h3',
  chart:'M3 2v20h19M7 17V9m6 8V5m6 12v-5',
  cloud:'M7 19a5 5 0 0 1-1-10A7 7 0 0 1 20 9a5 5 0 0 1-1 10Z',
  image:'M2 3h20v18H2Zm0 14 6-6 5 5 3-3 6 6M14 8h3',
};
function IsoBlock({box,className=''}) {
  const faces=isoBox(box);
  return <g className={className}><polygon className="operation-face-left" points={svgPoints(faces.left)}/><polygon className="operation-face-right" points={svgPoints(faces.right)}/><polygon className="operation-face-top" points={svgPoints(faces.top)}/></g>;
}
export function ProjectOperations({id}) {
  const operation=projectOperations[id],playback=useDiagramPlayback(operation.steps.length,{resumeAfter:8000}),{root,active,paused,playing,select}=playback;
  const step=operation.steps[active];
  return <figure className={`case-operations ${playing?'is-playing':''}`} ref={root} aria-label={operation.title}>
    <div className="case-operations-card">
      <header><p>{operation.title}</p><span className="case-operation-playback"><PlaybackButton playback={playback} label="operations model"/></span></header>
      <p className="case-operation-current"><span>{String(active+1).padStart(2,'0')} / 06</span>{step.title}</p>
      <svg className="case-operation-model" viewBox="0 0 460 330" role="group" aria-label={operation.title}>
        <IsoBlock box={{x:0,y:0,width:260,depth:190,height:9,z:-9}} className="operation-board"/>
        <g className="operation-circuits">{[36,96,156].map(y=><polyline key={`y${y}`} points={svgPoints([isoPoint(8,y),isoPoint(250,y)])}/>)}{[14,94,174,246].map(x=><polyline key={`x${x}`} points={svgPoints([isoPoint(x,8),isoPoint(x,182)])}/>)}</g>
        {operation.steps.map((item,index)=>{
          const box=operationSlots[index],icon=isoPoint(box.x+12,box.y+9,box.height+1),label=isoPoint(box.x+box.width/2,box.y+box.depth+13),selected=index===active;
          return <g key={item.id} className={`case-operation-stage ${selected?'is-active':''}`} role="button" tabIndex={0} aria-label={`Show step ${index+1}: ${item.title}`} aria-pressed={selected} onClick={()=>select(index)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(index);}}}>
            <polygon className="operation-hit" points={svgPoints([isoPoint(box.x-5,box.y-5,box.height+6),isoPoint(box.x+box.width+5,box.y-5,box.height+6),isoPoint(box.x+box.width+5,box.y+box.depth+5,-2),isoPoint(box.x-5,box.y+box.depth+5,-2)])}/>
            <IsoBlock box={box} className="operation-block"/>
            <g className="operation-icon" transform={`matrix(.82 .43 -.82 .43 ${icon[0]} ${icon[1]})`}><path d={iconPaths[item.icon]}/></g>
            <text className="operation-label" x={label[0]} y={label[1]} textAnchor="middle">{item.label}</text>
            {selected&&<circle className="operation-indicator" cx={label[0]} cy={label[1]+9} r="2"/>}
          </g>;
        })}
      </svg>
    </div>
    <figcaption aria-live={paused?'polite':'off'}><strong>{step.title}.</strong> {step.detail}<span>Tap a part to explore. The model advances automatically.</span></figcaption>
  </figure>;
}
