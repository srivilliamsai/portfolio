import React,{useEffect,useState} from 'react';
import {createMicrophonePreview,microphoneNote} from '../../services/assistantMicrophone.js';

export default function VillMicrophone({enabled=true,onState}) {
  const [state,setState]=useState('asking'),[level,setLevel]=useState(0);
  useEffect(()=>{
    if(!enabled)return;
    let cancelled=false;
    const preview=createMicrophonePreview({onState:value=>{setState(value);onState?.(value);},onLevel:setLevel});
    // StrictMode’s discarded effect must not trigger a second permission request.
    void Promise.resolve().then(()=>{if(!cancelled&&!document.hidden)void preview.start();});
    const visibility=()=>{if(document.hidden)preview.stop();else if(!['blocked','unavailable','error'].includes(preview.state))void preview.start();};
    document.addEventListener('visibilitychange',visibility);
    return()=>{cancelled=true;document.removeEventListener('visibilitychange',visibility);preview.dispose();};
  },[enabled,onState]);
  const ready=state==='ready';
  return <div className={`vill-mic-ready is-${state}`} data-mic-state={state} role="group" aria-label="Microphone check">
    <span>Microphone</span>
    <span className="vill-mic-meter" aria-hidden="true">{Array.from({length:6},(_,index)=>{
      const activity=ready?Math.max(0,Math.min(1,level*7-index)):0;
      return <i className={activity>0?'is-on':''} style={{height:`${5+activity*9}px`}} key={index}/>;
    })}</span>
    <span aria-hidden="true">{microphoneNote(state,level)}</span>
    <span className="sr-only" role="status">{ready?'Microphone ready':microphoneNote(state)}</span>
  </div>;
}
