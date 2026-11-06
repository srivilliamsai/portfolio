import {assistantApiPath} from './assistantApi.js';

export async function prepareSpeechAudio(text,{signal,fetcher=fetch,timeoutMs=1500}={}) {
  const controller=new AbortController(),cancel=()=>controller.abort();
  if(signal?.aborted)return null;
  signal?.addEventListener('abort',cancel,{once:true});
  const timeout=setTimeout(cancel,timeoutMs);
  try {
    const response=await fetcher(assistantApiPath('/tts'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text}),signal:controller.signal});
    if(!response.ok||!/^audio\/wav\b/i.test(response.headers.get('content-type')||''))return null;
    const bytes=await response.arrayBuffer();
    return bytes.byteLength&&bytes.byteLength<=10*1024*1024?bytes:null;
  } catch {return null;}
  finally {clearTimeout(timeout);signal?.removeEventListener('abort',cancel);}
}

export function createSpeechAudioPlayer({environment=globalThis,onLevel=()=>{},onCaption=()=>{},onState=()=>{}}={}) {
  let context=null,source=null,frame=0,generation=0,finish=null;
  const unlock=()=>{
    const Audio=environment.AudioContext||environment.webkitAudioContext;
    if(!Audio)return;
    context??=new Audio();
    return context.resume();
  };
  const stop=()=>{
    generation++;environment.cancelAnimationFrame?.(frame);frame=0;
    if(source){source.onended=null;try{source.stop();}catch{}source.disconnect();source=null;}
    onLevel(0);finish?.();finish=null;
  };
  return {
    unlock,
    stop,
    async play(bytes,text,{onStart=()=>{}}={}) {
      stop();const turn=generation;
      await unlock();if(!context)return false;
      const audio=await context.decodeAudioData(bytes.slice(0));
      if(turn!==generation)return true;
      const node=context.createBufferSource(),analyser=context.createAnalyser();
      analyser.fftSize=256;node.buffer=audio;node.connect(analyser);analyser.connect(context.destination);source=node;
      const values=new Uint8Array(analyser.fftSize),words=[...text.matchAll(/\S+/g)];
      const weights=words.map(word=>.15+word[0].length*.035),total=weights.reduce((sum,n)=>sum+n,0);
      let elapsedWeight=0,visible=0;
      const at=weights.map(weight=>{const start=elapsedWeight;elapsedWeight+=weight;return start/total*audio.duration;});
      return new Promise(resolve=>{
        const complete=()=>{if(source!==node)return;environment.cancelAnimationFrame?.(frame);node.disconnect();analyser.disconnect();source=null;finish=null;onLevel(0);onCaption(text);onState('idle');resolve(true);};
        finish=()=>{analyser.disconnect();resolve(true);};node.onended=complete;
        const started=context.currentTime;
        const animate=()=>{
          if(source!==node)return;
          analyser.getByteTimeDomainData(values);
          onLevel(Math.min(1,Math.sqrt(values.reduce((sum,v)=>sum+((v-128)/128)**2,0)/values.length)*4));
          const before=visible;while(visible<words.length&&at[visible]<=context.currentTime-started)visible++;
          if(visible!==before)onCaption(text.slice(0,words[visible-1].index+words[visible-1][0].length));
          frame=environment.requestAnimationFrame?.(animate)||0;
        };
        node.start();onState('speaking');onStart();animate();
      });
    },
    dispose(){stop();void context?.close().catch(()=>{});context=null;}
  };
}
