import {displayOwnerName,ownerNameInstruction} from './assistantIdentity.js';
import { getMediaContext, searchKnowledge, localReply } from './assistantKnowledge.js';
import { assistantApiPath } from './assistantApi.js';
import { transcriptForProvider } from './assistantSession.js';
import {mergeAssistantContext} from './assistantContext.js';
import {createAudioCaptions} from './assistantCaptions.js';

const base64=buffer=>{const bytes=new Uint8Array(buffer);let text='';for(let i=0;i<bytes.length;i++)text+=String.fromCharCode(bytes[i]);return btoa(text);};
export function resolveLiveTool(name,args={}, {question='',context={},onMedia=()=>{}}={}) {
  const query=question.trim()||String(args.query||'');
  const reply=()=>localReply(query,context);
  const present=answer=>{
    const actual=onMedia(answer.clearMedia?null:answer.mediaId,answer);
    return mergeAssistantContext(context,actual===undefined?answer:{...answer,mediaId:actual,clearMedia:false});
  };
  if(name==='search_portfolio'){
    const answer=reply();
    return {result:{answer,records:searchKnowledge(query)},context:answer.clearMedia||answer.mediaId?present(answer):mergeAssistantContext(context,answer)};
  }
  if(name==='get_media')return {result:getMediaContext(args.id)||{error:'Not found'},context};
  if(name==='show_media'){
    const media=getMediaContext(args.id),answer=reply(),expected=getMediaContext(answer.mediaId);
    if(!media||!expected||answer.clearMedia||media.entityId!==expected.entityId)return {result:{error:'This image does not match the visitor’s current request.'},context};
    return {result:media,context:present({...answer,mediaId:media.id})};
  }
  if(name==='hide_media'){
    const answer=reply();
    if(!answer.dismissMedia)return {result:{hidden:false,reason:'Keep the selected media until the visitor dismisses it or changes topic.'},context};
    const next=present(answer);return {result:{hidden:!next.mediaId},context:next};
  }
  return {result:{error:'Unknown tool'},context};
}
async function liveClient(credentials){const {GoogleGenAI}=await import('@google/genai');return new GoogleGenAI({apiKey:credentials.token,httpOptions:{apiVersion:'v1beta'}});}
export async function connectLive({messages=[],selectedMediaId=null,context:initialContext={},signal,onState,onUser,onText,onTurn,onMedia,onError,onInterrupt=()=>{},onLevel=()=>{},createClient=liveClient}) {
  let closed=false,session=null,micStream=null,micContext=null,worklet=null,micNode=null,sink=null,output=null,analyser=null,gain=null,frame=0,sequence=0,user='',answer='',muted=false;
  let conversation=mergeAssistantContext(initialContext,{mediaId:selectedMediaId});
  let responseStarted=false,routedQuestion='',turnContext=null,hasOutputTranscript=false;
  const presentQuestion=()=>{
    if(!user.trim()||user===routedQuestion)return;
    turnContext??=conversation;
    const reply=localReply(user,turnContext),actual=onMedia(reply.clearMedia?null:reply.mediaId,reply);
    conversation=mergeAssistantContext(turnContext,actual===undefined?reply:{...reply,mediaId:actual,clearMedia:false});
    routedQuestion=user;
  };
  const resetTurn=()=>{responseStarted=false;routedQuestion='';turnContext=null;hasOutputTranscript=false;};
  const sources=new Set();let cursor=0,turnEnded=false,suppressAudio=false;
  const captions=createAudioCaptions({clock:()=>output?.currentTime||0,onCaption:value=>onText(displayOwnerName(value))});
  const stopAudio=()=>{for(const source of sources){source.onended=null;try{source.stop();}catch{}}sources.clear();cursor=0;captions.reset();onLevel(0);};
  const stopMic=()=>{if(worklet)worklet.port.onmessage=null;worklet?.disconnect();micNode?.disconnect();sink?.disconnect();micStream?.getTracks().forEach(t=>t.stop());micStream=null;void micContext?.close().catch(()=>{});micContext=null;};
  const close=()=>{if(closed)return;closed=true;sequence++;stopMic();stopAudio();session?.close();cancelAnimationFrame(frame);void output?.close().catch(()=>{});signal?.removeEventListener('abort',close);};
  signal?.addEventListener('abort',close,{once:true});
  const finish=()=>{if(!closed&&turnEnded&&!sources.size){captions.finish();if(user||answer)onTurn({user,assistant:displayOwnerName(answer)});user='';answer='';turnEnded=false;resetTurn();onState(micStream?'listening':'idle');}};
  async function startMic(){if(closed)return;stopMic();const generation=++sequence;const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1}});if(closed||generation!==sequence){stream.getTracks().forEach(t=>t.stop());return;}micStream=stream;micContext=new AudioContext();await micContext.audioWorklet.addModule('/static/worklets/vill-mic.js');if(closed||generation!==sequence)return;worklet=new AudioWorkletNode(micContext,'vill-mic');micNode=micContext.createMediaStreamSource(stream);sink=micContext.createGain();sink.gain.value=0;micNode.connect(worklet);worklet.connect(sink);sink.connect(micContext.destination);worklet.port.onmessage=e=>{if(!closed)session.sendRealtimeInput({audio:{data:base64(e.data),mimeType:'audio/pcm;rate=16000'}});};onState('listening');}
  try {
    onState('connecting');
    // Unlock playback from the voice gesture before waiting for the session token.
    output=new AudioContext({sampleRate:24000});await output.resume();
    const response=await fetch(assistantApiPath('/live-session'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:transcriptForProvider(messages)}),signal});
    if(!response.ok)throw new Error('Live voice is unavailable. You can type or use browser voice.');
    const credentials=await response.json();
    const ai=await createClient(credentials);
    if(closed||signal?.aborted)throw new DOMException('Cancelled','AbortError');
    gain=output.createGain();analyser=output.createAnalyser();gain.connect(analyser);analyser.connect(output.destination);analyser.fftSize=256;
    const bytes=new Uint8Array(analyser.fftSize);const animate=()=>{if(closed)return;captions.tick();analyser.getByteTimeDomainData(bytes);onLevel(Math.min(1,Math.sqrt(bytes.reduce((sum,v)=>sum+((v-128)/128)**2,0)/bytes.length)*4));frame=requestAnimationFrame(animate);};animate();
    session=await ai.live.connect({model:credentials.model,config:{responseModalities:['AUDIO'],inputAudioTranscription:{},outputAudioTranscription:{},speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:credentials.voice}}}},callbacks:{
      onmessage:message=>{
        if(closed)return;
        if(message.toolCall){const functionResponses=message.toolCall.functionCalls.map(call=>{const resolved=resolveLiveTool(call.name,call.args,{question:user,context:conversation,onMedia});conversation=resolved.context;return {id:call.id,name:call.name,response:{result:resolved.result}};});session.sendToolResponse({functionResponses});}
        const content=message.serverContent;if(!content)return;
        if(content.interrupted){stopAudio();suppressAudio=false;user='';answer='';turnEnded=false;resetTurn();onInterrupt();onText('');onState('listening');}
        if(content.inputTranscription?.text){suppressAudio=false;user+=content.inputTranscription.text;onUser(user);if(responseStarted)presentQuestion();}
        const parts=content.modelTurn?.parts||[];
        if(!suppressAudio&&(parts.length||content.outputTranscription?.text)){
          responseStarted=true;presentQuestion();
        }
        for(const part of content.modelTurn?.parts||[]){if(suppressAudio||!part.inlineData?.mimeType?.startsWith('audio/'))continue;const raw=atob(part.inlineData.data),array=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)array[i]=raw.charCodeAt(i);const pcm=new Int16Array(array.buffer),buffer=output.createBuffer(1,pcm.length,24000),channel=buffer.getChannelData(0);for(let i=0;i<pcm.length;i++)channel[i]=pcm[i]/32768;const source=output.createBufferSource();source.buffer=buffer;source.connect(gain);cursor=Math.max(cursor,output.currentTime+.02);sources.add(source);source.start(cursor);captions.start(cursor);cursor+=buffer.duration;onState('speaking');source.onended=()=>{sources.delete(source);finish();};}
        if(content.outputTranscription?.text&&!suppressAudio){hasOutputTranscript=true;answer+=content.outputTranscription.text;captions.append(content.outputTranscription.text);if(!sources.size)onText(displayOwnerName(answer));}
        else if(!hasOutputTranscript&&!suppressAudio){
          const text=parts.filter(part=>!part.thought&&typeof part.text==='string').map(part=>part.text).join('');
          if(text){answer+=text;captions.append(text);if(!sources.size)onText(displayOwnerName(answer));}
        }
        if(content.generationComplete&&!sources.size&&!content.outputTranscription?.text)onState('thinking');
        if(content.turnComplete){turnEnded=true;finish();}
      },
      onerror:()=>{if(!closed)onError('Voice connection interrupted. You can continue by typing.');close();},
      onclose:()=>{if(!closed){onState('idle');onError('Voice session ended. Start voice again to reconnect.');}close();}
    }});
    if(closed||signal?.aborted){session.close();throw new DOMException('Cancelled','AbortError');}
    session.sendClientContent({turns:[{role:'user',parts:[{text:'Session pronunciation guide, not a request for an answer: '+ownerNameInstruction}]}],turnComplete:false});
    if(selectedMediaId){const media=getMediaContext(selectedMediaId);if(media)session.sendClientContent({turns:[{role:'user',parts:[{text:'Selected gallery context, not a request to speak: '+JSON.stringify(media)}]}],turnComplete:false});}
    await startMic();
    if(!messages.length)session.sendClientContent({turns:[{role:'user',parts:[{text:'A visitor has chosen to start the voice tour. Greet them as Will, pronounced as one word and never as individual letters, in one short sentence and ask what they would like to know about Villiam.'}]}],turnComplete:true});
    return {
      sendText(text){stopAudio();resetTurn();suppressAudio=false;user=text;answer='';turnEnded=false;onUser(text);onText('');onState('thinking');session.sendClientContent({turns:[{role:'user',parts:[{text}]}],turnComplete:true});},
      setMedia(id){const media=getMediaContext(id);conversation=mergeAssistantContext(conversation,{mediaId:id});session.sendClientContent({turns:[{role:'user',parts:[{text:'Selected gallery context, not a request to speak: '+JSON.stringify(media||{selected:false})}]}],turnComplete:false});},
      setMic:async enabled=>{if(enabled)await startMic();else{sequence++;stopMic();onState('idle');}},
      setMuted(value){muted=value;if(gain)gain.gain.value=muted?0:1;},
      stopTalking(){suppressAudio=true;stopAudio();onState(micStream?'listening':'idle');},close
    };
  }catch(error){close();throw error;}
}
