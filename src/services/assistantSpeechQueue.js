import {assistantText} from './assistantText.js';

// Consume cumulative SSE text. Keep incomplete punctuation and abbreviations
// buffered; long unpunctuated answers are broken at a bounded word boundary.
export function createSentenceBuffer() {
  let consumed=0;
  return {
    update(value,final=false) {
      const text=String(value||''),sentences=[];
      let rest=text.slice(consumed),boundary;
      while(rest) {
        boundary=0;
        for(const match of rest.matchAll(/[.!?…]+["”’')\]]*(\s+|$)/g)) {
          const end=match.index+match[0].trimEnd().length;
          if(!final&&end===rest.length)break;
          const prefix=rest.slice(0,end);
          if(/\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|e\.g|i\.e|M\.Tech|B\.Tech|Ph\.D|[A-Z])\.$/i.test(prefix))continue;
          boundary=match.index+match[0].length;break;
        }
        if(!boundary&&rest.length>320)boundary=rest.lastIndexOf(' ',300)+1;
        if(!boundary&&final)boundary=rest.length;
        if(!boundary)break;
        const sentence=assistantText(rest.slice(0,boundary)).trim();
        if(sentence)sentences.push(sentence);
        consumed+=boundary;rest=text.slice(consumed);
      }
      return sentences;
    }
  };
}

export function createSpeechQueue({prepare=()=>null,speak,stop=()=>{},onSentence=()=>{},onTiming=()=>{},signal:externalSignal,clock=()=>performance.now()}={}) {
  const controller=new AbortController(),signal=controller.signal;
  const buffer=createSentenceBuffer(),items=[],startedAt=clock(),timings={};
  let full='',ended=false,cancelled=false,running=false,wake=null,settled=false;
  let resolveDone;
  const done=new Promise(resolve=>{resolveDone=resolve;});
  const mark=name=>{if(timings[name]===undefined){timings[name]=Math.round(clock()-startedAt);onTiming({...timings});}};
  const finish=()=>{if(settled)return;settled=true;externalSignal?.removeEventListener('abort',cancel);resolveDone();};
  const notify=()=>{wake?.();wake=null;};
  const prime=()=>{for(const item of items.slice(0,running?1:2))if(!item.prepared)item.prepared=Promise.resolve().then(()=>cancelled?null:prepare(item.text,{signal})).catch(()=>null);};
  function cancel(){if(cancelled)return;cancelled=true;controller.abort();items.length=0;stop();notify();finish();}
  async function drain() {
    if(running||cancelled)return;
    running=true;
    try {
      while(!cancelled) {
        if(!items.length){if(ended)break;await new Promise(resolve=>{wake=resolve;});continue;}
        prime();const item=items.shift();prime();
        await speak(item.text,{audio:item.prepared,signal,onStart:()=>{if(!cancelled){mark('firstAudioMs');onSentence(item.text);}}});
      }
    } catch {cancel();}
    finally {running=false;if(ended||cancelled)finish();}
  }
  const enqueue=sentences=>{for(const text of sentences){mark('firstSentenceMs');items.push({text,prepared:null});}prime();notify();void drain();};
  if(externalSignal?.aborted)cancel();else externalSignal?.addEventListener('abort',cancel,{once:true});
  return {
    update(text){if(ended||cancelled)return;if(text&&!full)mark('firstTokenMs');full=text;enqueue(buffer.update(full));},
    end(text=full){if(ended||cancelled)return;full=text;enqueue(buffer.update(full,true));ended=true;notify();void drain();},
    cancel,done,
    get hasText(){return Boolean(full.trim());},
    get cancelled(){return cancelled;},
    get text(){return full;}
  };
}
