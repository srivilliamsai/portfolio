import {createMicrophonePreview} from './assistantMicrophone.js';
// Preview levels are RMS * 6; use the reference threshold and an elapsed hold.
export function createSpeechActivityGate({threshold=.085*6,holdMs=240}={}){
  let began=null;
  return {reset(){began=null;},push(level,time){if(level<threshold){began=null;return false;}began??=time;if(time-began<holdMs)return false;began=null;return true;}};
}
export function createBargeInMonitor({environment=globalThis,onInterrupt=()=>{},onAvailable=()=>{}}={}){
  const gate=createSpeechActivityGate();let armed=false,disposed=false,ready=false;
  const preview=createMicrophonePreview({environment,onState:state=>{ready=state==='ready';if(!disposed)onAvailable(ready);},onLevel:level=>{if(armed&&gate.push(level,environment.performance?.now?.()??Date.now())){armed=false;onInterrupt();}}});
  return {start(){return preview.start();},arm(value){armed=Boolean(value)&&!disposed;gate.reset();},stop(){armed=false;gate.reset();preview.stop();},get available(){return ready;},dispose(){disposed=true;armed=false;preview.dispose();}};
}
