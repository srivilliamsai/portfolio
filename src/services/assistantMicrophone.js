// Welcome-screen microphone preview. Samples stay local; nothing is recorded or sent.
export function microphoneLevel(samples) {
  if(!samples.length)return 0;
  let sum=0;
  for(const sample of samples)sum+=((sample-128)/128)**2;
  return Math.min(1,Math.sqrt(sum/samples.length)*6);
}
export function microphoneNote(state,level=0) {
  if(state==='ready')return level>.12?'I can hear you':'Say something…';
  return {asking:'Allow the mic to talk',blocked:'Mic blocked · you can type',unavailable:'No microphone found',paused:'Microphone paused',error:'Microphone unavailable · you can type'}[state]||'Allow the mic to talk';
}
export function createMicrophonePreview({environment=globalThis,onState=()=>{},onLevel=()=>{}}={}) {
  const mediaDevices=environment.navigator?.mediaDevices;
  const AudioContext=environment.AudioContext||environment.webkitAudioContext;
  const requestFrame=environment.requestAnimationFrame?.bind(environment)||(fn=>setTimeout(()=>fn(Date.now()),70));
  const cancelFrame=environment.cancelAnimationFrame?.bind(environment)||clearTimeout;
  let state='idle',generation=0,disposed=false,pending=null,stream=null,context=null,source=null,analyser=null,frame=null;
  const publish=value=>{state=value;if(!disposed)onState(value);};
  const stopTracks=value=>{for(const track of value?.getTracks()||[])try{track.stop();}catch{}};
  const release=()=>{
    if(frame!==null)cancelFrame(frame);frame=null;
    try{source?.disconnect();}catch{}try{analyser?.disconnect();}catch{}
    for(const track of stream?.getTracks()||[])track.removeEventListener?.('ended',ended);
    stopTracks(stream);stream=null;source=null;analyser=null;
    const previous=context;context=null;
    try{Promise.resolve(previous?.close()).catch(()=>{});}catch{}
    if(!disposed)onLevel(0);
  };
  function ended(){if(disposed||!stream)return;generation++;pending=null;release();publish('unavailable');}
  function stop(){generation++;pending=null;release();if(!disposed&&['ready','asking'].includes(state))publish('paused');}
  function start(){
    if(disposed)return Promise.resolve(false);
    if(pending)return pending;
    if(stream&&state==='ready')return Promise.resolve(true);
    const token=++generation;release();publish('asking');
    if(!mediaDevices?.getUserMedia||!AudioContext){publish('unavailable');return Promise.resolve(false);}
    const task=(async()=>{
      try{
        const incoming=await mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1}});
        if(disposed||token!==generation){stopTracks(incoming);return false;}
        stream=incoming;context=new AudioContext();analyser=context.createAnalyser();analyser.fftSize=512;
        source=context.createMediaStreamSource(stream);source.connect(analyser);
        for(const track of stream.getTracks())track.addEventListener?.('ended',ended);
        if(context.state==='suspended')try{Promise.resolve(context.resume()).catch(()=>{});}catch{}
        const samples=new Uint8Array(analyser.fftSize);let last=-Infinity;
        const draw=time=>{
          frame=null;
          if(disposed||token!==generation||!analyser)return;
          if(time-last>=70){last=time;analyser.getByteTimeDomainData(samples);onLevel(microphoneLevel(samples));}
          if(!disposed&&token===generation&&analyser)frame=requestFrame(draw);
        };
        publish('ready');
        if(!disposed&&token===generation)frame=requestFrame(draw);
        return !disposed&&token===generation;
      }catch(error){
        if(disposed||token!==generation)return false;
        release();publish(['NotAllowedError','PermissionDeniedError','SecurityError'].includes(error.name)?'blocked':['NotFoundError','DevicesNotFoundError','OverconstrainedError'].includes(error.name)?'unavailable':'error');
        return false;
      }
    })();
    pending=task;void task.finally(()=>{if(pending===task)pending=null;});return task;
  }
  return {start,stop,get state(){return state;},dispose(){disposed=true;stop();}};
}
