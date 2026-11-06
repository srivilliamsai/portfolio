// The live tour follows the reference: queue words against the playback clock.
const wordSeconds=word=>Math.min(.42,.13+word.length*.035);

export function createAudioCaptions({clock,onCaption=()=>{}}) {
  let text='',words=[],visible=0,nextAt=0,anchor=null,last='';
  const publish=()=>{const value=text.slice(0,words[visible-1]?.end||0).replace(/\s+/g,' ').trim();if(value!==last){last=value;onCaption(value);}};
  function schedule(at) {
    if(anchor===null)return;
    const matches=[...text.matchAll(/\S+/g)];
    for(let index=0;index<matches.length;index++){
      const match=matches[index],end=match.index+match[0].length;
      if(words[index]){words[index].end=end;if(index===words.length-1)nextAt=words[index].at+wordSeconds(match[0]);}
      else {const start=Math.max(nextAt,at,clock());words.push({at:start,end});nextAt=start+wordSeconds(match[0]);}
    }
  }
  return {
    start(at){anchor=at;schedule(at);},
    append(chunk){text+=chunk;schedule(Math.max(anchor??0,clock()));},
    tick(){while(visible<words.length&&words[visible].at<=clock()+.04)visible++;publish();},
    finish(){if(text.trim()!==last)onCaption(text.replace(/\s+/g,' ').trim());text='';words=[];visible=0;nextAt=0;anchor=null;last='';},
    reset(){text='';words=[];visible=0;nextAt=0;anchor=null;last='';onCaption('');}
  };
}

const nativeWordSeconds=word=>Math.max(.30,Math.min(.65,.20+word.replace(/[^a-z0-9]/gi,'').length*.035))+(/[.!?…]$/.test(word)?.32:/[,;:]$/.test(word)?.15:0);

// Native word-boundary events provide exact progress. Timed progress is a fallback
// for voices that omit those events, and only starts after audible playback starts.
export function createUtteranceCaptions({text,onCaption=()=>{},rate=.94,setTimer=setTimeout,clearTimer=clearTimeout}) {
  const words=[...text.matchAll(/\S+/g)].map(match=>({start:match.index,end:match.index+match[0].length,word:match[0]}));
  let count=0,timer=null,active=false,paused=false,hasBoundaries=false;
  const clear=()=>{clearTimer(timer);timer=null;};
  const publish=next=>{if(next>count){count=Math.min(next,words.length);onCaption(text.slice(0,words[count-1]?.end||0));}};
  const schedule=delay=>{clear();if(!active||paused||count>=words.length)return;timer=setTimer(()=>{if(!active||paused)return;publish(count+1);schedule(nativeWordSeconds(words[count-1].word)*1000/rate);},delay);};
  return {
    start(){active=true;paused=false;hasBoundaries=false;onCaption('');publish(1);if(words.length)schedule(nativeWordSeconds(words[0].word)*1000/rate);},
    boundary(event){
      if(!active||paused||event.name&&event.name!=='word'||!Number.isInteger(event.charIndex)||event.charIndex<0||event.charIndex>=text.length)return;
      const index=words.findIndex(word=>word.end>event.charIndex);
      if(index<0)return;
      // Some voices emit only an initial index-zero event. Keep their fallback
      // until an event actually advances the word position.
      if(index>0){hasBoundaries=true;clear();}
      publish(index+1);
      // Once real boundaries arrive they are authoritative, including long pauses.
      // A guessed watchdog must not race ahead of a slow or paused voice.
    },
    pause(){paused=true;clear();},
    resume(){if(!active)return;paused=false;if(!hasBoundaries)schedule(1200);},
    finish(){clear();active=false;onCaption(text);},
    cancel(){clear();active=false;onCaption('');}
  };
}
