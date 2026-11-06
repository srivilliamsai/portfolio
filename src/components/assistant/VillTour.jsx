import React,{memo,useCallback,useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {workGallery as workThumbs,personalGallery as personalThumbs,preloadGalleryImage} from '../../services/assistantGallery.js';
import {useSound} from '../../context/SoundContext';
import {connectLive} from '../../services/assistantLive.js';
import {getMedia,localReply,welcome} from '../../services/assistantKnowledge.js';
import {appendMessages,INPUT_LIMIT,streamChat} from '../../services/assistantSession.js';
import {createBrowserSpeech} from '../../services/assistantSpeech.js';
import {createSpeechQueue} from '../../services/assistantSpeechQueue.js';
import {createMediaSelection,sentenceMedia} from '../../services/assistantSpotlight.js';
import {isFarewell} from '../../services/assistantRequests.js';
import {createBargeInMonitor} from '../../services/assistantBargeIn.js';
import {assistantApiPath} from '../../services/assistantApi.js';
import {isSafeLink} from '../../services/linkSafety.js';
import {lockDocumentScroll} from '../../services/documentScrollLock.js';
import {createTourExit} from '../../services/assistantExit.js';
import {assistantText} from '../../services/assistantText.js';
import {mergeAssistantContext} from '../../services/assistantContext.js';
import {captionWords,tourPresentation} from '../../services/assistantPresentation.js';
import VillMascot from './VillMascot';
import VillMicrophone from './VillMicrophone';
import VillIcon from './VillIcon';
import VillMediaPreview from './VillMediaPreview';
import WindowControls from '../common/WindowControls';

const variation = seed => { const n = Math.sin(seed * 999.7) * 10000; return n - Math.floor(n); };
function greeting() { const hour = new Date().getHours(); return hour < 5 ? 'Hello, night owl' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'; }
const Clusters=memo(function Clusters({selected,onPick}) {
  return <div className="vill-clusters">{[workThumbs,personalThumbs].map((list,side) => <div className={`vill-cluster ${side?'is-personal':'is-work'}`} role="group" aria-label={side?'WILL personal gallery':'WILL project gallery'} key={side}>{list.map((media,index) => {
    const seed = side + 1, angle = index * 2.399963, radius = Math.sqrt((index + .6) / list.length);
    const width = side ? (media.width>media.height ? 106 : 68 + Math.round(variation(index + 3) * 20)) : 40 + Math.round(variation(index * 7 + seed * 13) * 34);
    const ratio = media.kind==='song'?1:side ? Math.max(.65,Math.min(1.4,media.height/media.width)) : variation(index * 11 + seed) > .35 ? 1.28 : .78;
    return <button type="button" key={media.id} data-will-media={media.id} className={`vill-thumb ${media.kind==='song'?'is-song':''} ${selected===media.id?'is-selected':''}`} style={{'--x':`${50 + Math.cos(angle) * radius * 36 * (.9 + variation(index + seed * 50) * .2)}%`,'--y':`${50 + Math.sin(angle) * radius * 43 * (.9 + variation(index * 3 + seed) * .2)}%`,'--thumb-width':`${width}px`,'--thumb-height':`${Math.round(width * ratio)}px`,'--delay':`${-variation(index * 5 + seed) * 6}s`}} onClick={() => onPick(media.id)} onPointerEnter={()=>media.src&&void preloadGalleryImage(media.src)} onFocus={()=>media.src&&void preloadGalleryImage(media.src)} title={media.title} aria-label={`Show ${media.title}`}><img src={media.thumbnail||media.src} alt="" loading="eager" decoding="async" fetchPriority={side?'high':'auto'} draggable="false"/></button>;
  })}</div>)}</div>;
});

function Caption({text,isUser,turn,live}) {
  const words=captionWords(text);
  return <div className="vill-capwin" aria-live={live?'polite':'off'}><p className={`vill-caption ${isUser?'is-you':''}`}>{words.map(({word,index})=><span className="vill-word" key={`${turn}:${index}:${word}`}>{word}{' '}</span>)}</p></div>;
}

function ThinkingLabel(){
  const [step,setStep]=useState(0);
  useEffect(()=>{const timer=setInterval(()=>setStep(value=>value+1),700);return()=>clearInterval(timer);},[]);
  return <>{['Thinking','Recalling','Pondering','Remembering'][Math.floor(step/2)%4]}… <span aria-hidden="true">{['✢','✳','✶','✻'][step%4]}</span></>;
}

export default function VillTour({onClose}){
  const [hello] = useState(greeting);
  const {playSound,setMuted:setEffectsMuted}=useSound('will');
  const capabilityRequest=useRef(null),voiceBackend=useRef(null),voiceSequence=useRef(0);
  const [closing,setClosing]=useState(false),[shortcuts,setShortcuts]=useState(false);
  const exit=useRef(null),closeCallback=useRef(onClose);
  closeCallback.current=onClose;
  const [active,setActive]=useState(false),[state,setState]=useState('idle'),[mode,setMode]=useState('type');
  const [messages,setMessages]=useState([]),[draft,setDraft]=useState(''),[partial,setPartial]=useState(''),[heard,setHeard]=useState('');
  const [selectedId,setSelectedId]=useState(null),[transcript,setTranscript]=useState(false),[large,setLarge]=useState(false);
  const [mic,setMic]=useState(false),[muted,setMuted]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const [capabilities,setCapabilities]=useState({voice:false,chat:false});
  const [canInterrupt,setCanInterrupt]=useState(false);
  const bargeIn=useRef(null),interruptSpeech=useRef(null),liveExcited=useRef(false);
  const voiceStarting=useRef(false);
  const [previewState,setPreviewState]=useState('asking');
  const root=useRef(null),input=useRef(null),logs=useRef(null),speech=useRef(null),live=useRef(null),request=useRef(null),liveRequest=useRef(null),mounted=useRef(true),messagesRef=useRef([]),context=useRef({topicId:null,mediaId:null}),micRef=useRef(false),muteRef=useRef(false),askRef=useRef(null),busyRef=useRef(false),timer=useRef(null),originFocus=useRef(null),selectedRef=useRef(null);
  const level=useRef(0),queue=useRef(null),captionPrefix=useRef(''),capabilitiesRef=useRef(capabilities),recoverVoice=useRef(null);
  const mediaSelection=useRef(null),liveMediaTurn=useRef(0),liveTurnOpen=useRef(false);
  if(!mediaSelection.current)mediaSelection.current=createMediaSelection({onChange:id=>{selectedRef.current=id;setSelectedId(id);context.current.mediaId=id;}});
  capabilitiesRef.current=capabilities;
  const selected=getMedia(selectedId);
  const portraitPair=(context.current.mediaQueue||[]).map(getMedia).filter(media=>media?.group==='personal'&&media.entityId==='about');
  const companions=selected?.entityId==='about'&&portraitPair.length===2?portraitPair.filter(media=>media.id!==selected.id):[];
  messagesRef.current=messages;micRef.current=mic;muteRef.current=muted;busyRef.current=busy;selectedRef.current=selectedId;
  const pick=useCallback(id=>{const media=getMedia(id);if(!media)return;if(selectedRef.current!==id)playSound('select');mediaSelection.current.choose(id);if(!context.current.mediaQueue?.includes(id))delete context.current.mediaQueue;context.current.mediaId=id;live.current?.setMedia(id);},[playSound]);
  const applyMedia=useCallback((reply,turn)=>{
    const selection=mediaSelection.current;
    if(!selection.isCurrent(turn))return;
    const pinned=selection.isLocked(turn),mediaQueue=context.current.mediaQueue;
    selection.apply(reply,turn);
    context.current=mergeAssistantContext(context.current,{...reply,mediaId:selection.selectedId,clearMedia:false,...(pinned?{mediaQueue:mediaQueue||null}:{})});
    return selection.selectedId;
  },[]);
  const spotlight=useCallback((sentence,reply,turn)=>{
    const id=sentenceMedia(sentence,selectedRef.current,reply);
    if(id)applyMedia({...reply,mediaId:id},turn);
  },[applyMedia]);
  const finish=useCallback(()=>{voiceSequence.current++;voiceStarting.current=false;mediaSelection.current.invalidate();liveTurnOpen.current=false;request.current?.abort();queue.current?.cancel();queue.current=null;bargeIn.current?.stop();liveRequest.current?.abort();live.current?.close();live.current=null;speech.current?.stopListening();speech.current?.stopSpeaking();level.current=0;clearTimeout(timer.current);},[]);
  useEffect(()=>{
    const transition=createTourExit({stop:finish,begin:()=>setClosing(true),complete:()=>closeCallback.current(),reducedMotion:()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches});
    exit.current=transition;
    return()=>{transition.dispose();if(exit.current===transition)exit.current=null;};
  },[finish]);
  useEffect(()=>{setEffectsMuted(muted);return()=>setEffectsMuted(false);},[muted,setEffectsMuted]);
  useEffect(()=>{
    if(!active||closing)return;
    if(state==='listening'){playSound('listen');return;}
    if(state==='thinking'){const pending=setTimeout(()=>playSound('think'),120);return()=>clearTimeout(pending);}
  },[state,active,closing,playSound]);
  const requestClose=useCallback(()=>{playSound('close');exit.current?.start();},[playSound]);
  const stopVoice=useCallback(()=>{finish();micRef.current=false;setMic(false);setBusy(false);setState('idle');},[finish]);
  const ask=useCallback(async(value,{spoken=false}={})=>{
    const question=String(value).trim().slice(0,INPUT_LIMIT);if(!question||!mounted.current)return;
    if(question.toLowerCase()==='/help'){setShortcuts(value=>!value);return;}
    if(question.toLowerCase()==='/clear'){finish();mediaSelection.current.reset();setMic(false);micRef.current=false;setMode('type');setState('idle');setBusy(false);setPartial('');setHeard('');setMessages([]);context.current={topicId:null,mediaId:null};return;}
    playSound('send');setError('');setHeard('');setPartial('');setBusy(true);setState('thinking');
    const mediaTurn=mediaSelection.current.beginTurn();
    if(live.current){liveMediaTurn.current=mediaTurn;liveTurnOpen.current=true;setMessages(prev=>appendMessages(prev,{role:'user',content:question}));live.current.sendText(question);return;}
    request.current?.abort();const controller=new AbortController();request.current=controller;
    speech.current?.stopListening();speech.current?.stopSpeaking();setState('thinking');
    const prior=messagesRef.current;setMessages(prev=>appendMessages(prev,{role:'user',content:question}));
    let reply=localReply(question,context.current);
    let spokenText='',metadataShown=false;captionPrefix.current='';
    const playback=spoken&&!muteRef.current?createSpeechQueue({
      signal:controller.signal,
      prepare:(text,options)=>speech.current?.prepare(text,options),
      speak:(text,options)=>muteRef.current?undefined:speech.current?.speak(text,options),
      stop:()=>speech.current?.stopSpeaking(),
      onSentence:text=>{if(controller.signal.aborted||!mounted.current)return;captionPrefix.current=spokenText;spokenText+=text+' ';if(/!/.test(text))setState('excited');if(!metadataShown){applyMedia(reply,mediaTurn);metadataShown=true;}spotlight(text,reply,mediaTurn);},
      onTiming:detail=>root.current?.dispatchEvent(new CustomEvent('will:timing',{detail}))
    }):null;
    queue.current=playback;
    try{
      if(capabilities.chat)reply=await streamChat(question,context.current,prior,{signal:controller.signal,onDelta:text=>{if(!mounted.current||controller.signal.aborted)return;if(playback&&!playback.cancelled)playback.update(text);else setPartial(text);}});
    }catch(err){
      if(controller.signal.aborted||!mounted.current)return;
      if(playback?.hasText){reply={text:playback.text};setError('The connection paused. You can ask me to continue.');}
      else setError('Connection interrupted. Answering from the portfolio.');
    }
    if(!mounted.current||controller.signal.aborted)return;
    applyMedia(reply,mediaTurn);
    setMessages(prev=>appendMessages(prev,{role:'assistant',content:reply.text,links:reply.links,mediaId:reply.mediaId,mediaQueue:reply.mediaQueue}));
    if(playback){playback.end(reply.text);await playback.done;}
    else setPartial(spoken&&muteRef.current?assistantText(reply.text):'');
    if(!mounted.current||controller.signal.aborted)return;
    queue.current=null;request.current=null;setBusy(false);setState('idle');
    if(reply.endConversation){stopVoice();setMode('type');setPartial('');return;}
    if(spoken)setPartial('');
    if(spoken&&micRef.current)speech.current?.listen();
  },[capabilities.chat,applyMedia,spotlight,finish,stopVoice,playSound]);
  askRef.current=ask;
  useEffect(()=>{
    mounted.current=true;originFocus.current=document.activeElement;
    const unlockScroll=lockDocumentScroll(window);
    bargeIn.current=createBargeInMonitor({onInterrupt:()=>{if(mounted.current&&micRef.current)interruptSpeech.current?.();},onAvailable:value=>{if(mounted.current)setCanInterrupt(value);}});
    speech.current=createBrowserSpeech({useServerTts:()=>capabilitiesRef.current.tts,onLevel:value=>{level.current=value;},onState:value=>{bargeIn.current?.arm(value==='speaking'&&micRef.current);if(mounted.current)setState(value==='idle'&&queue.current&&busyRef.current?'thinking':value);},onInterim:text=>{if(mounted.current)setHeard(text);},onFinal:text=>askRef.current?.(text,{spoken:true}),onCaption:text=>{if(mounted.current&&(text||!queue.current))setPartial(text?captionPrefix.current+text:'');},onError:message=>{if(!mounted.current)return;bargeIn.current?.stop();queue.current?.cancel();queue.current=null;micRef.current=false;setMic(false);setState('idle');setError(message);setMode('type');setTranscript(true);}});
    const controller=new AbortController();const statusTimeout=setTimeout(()=>controller.abort(),4000);capabilityRequest.current=fetch(assistantApiPath('/status'),{signal:controller.signal}).then(r=>r.ok?r.json():null).then(result=>{const status=result||{voice:false,chat:false};if(mounted.current){capabilitiesRef.current=status;setCapabilities(status);}return status;}).catch(()=>({voice:false,chat:false})).finally(()=>clearTimeout(statusTimeout));
    const frame=requestAnimationFrame(()=>root.current?.querySelector('.vill-close')?.focus({preventScroll:true}));
    return()=>{mounted.current=false;controller.abort();clearTimeout(statusTimeout);cancelAnimationFrame(frame);finish();bargeIn.current?.dispose();speech.current?.dispose();unlockScroll();requestAnimationFrame(()=>{const original=originFocus.current;const visible=element=>element?.isConnected&&element.getClientRects().length&&!element.closest('[inert]');const target=visible(original)&&original.matches('button,a,input')?original:[...document.querySelectorAll('.vill-launcher, .portfolio-menu-toggle')].find(visible);target?.focus({preventScroll:true});});};
  },[finish]);
  useEffect(()=>{if(logs.current)logs.current.scrollTop=logs.current.scrollHeight;},[messages,partial,heard,transcript]);
  useEffect(()=>{const frame=requestAnimationFrame(()=>{if(transcript)input.current?.focus({preventScroll:true});else if(active)root.current?.querySelector('.vill-composer input')?.focus({preventScroll:true});});return()=>cancelAnimationFrame(frame);},[transcript,active]);
  useEffect(()=>{const hide=()=>{if(document.hidden){stopVoice();setBusy(false);setPartial('');request.current?.abort();}};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);},[stopVoice]);
  useEffect(()=>{if(!active||closing||busy||draft.trim()||!['idle','listening'].includes(state))return;const idle=setTimeout(()=>{stopVoice();setState('sleeping');},60000);return()=>clearTimeout(idle);},[active,closing,busy,draft,state,stopVoice]);
  const browserVoice=async(sequence,{greet=false,notice=''}={})=>{
    if(!mounted.current||sequence!==voiceSequence.current)return;
    voiceBackend.current='browser';live.current=null;level.current=0;captionPrefix.current='';
    setError(notice);setMode('voice');setTranscript(false);setMic(true);micRef.current=true;setBusy(false);
    void bargeIn.current?.start();
    if(greet){setMessages([{role:'assistant',content:welcome}]);await speech.current?.speak(welcome,{audio:speech.current?.prepare(welcome)});}
    if(!mounted.current||sequence!==voiceSequence.current)return;
    setPartial('');if(micRef.current)speech.current?.listen();
  };
  recoverVoice.current=()=>{const sequence=++voiceSequence.current;voiceStarting.current=false;void browserVoice(sequence,{notice:'Live voice disconnected. Continuing with browser voice.'});};
  const startVoice=async()=>{
    if(voiceStarting.current||!active&&previewState!=='ready')return;
    if(live.current){setActive(true);setMode('voice');setTranscript(false);if(!micRef.current){try{await live.current.setMic(true);setMic(true);micRef.current=true;}catch{setError('Microphone unavailable. You can type instead.');}}return;}
    voiceStarting.current=true;const sequence=++voiceSequence.current;
    speech.current?.unlock();
    try {
    setActive(true);setMode('voice');setTranscript(false);setError('');setMuted(false);muteRef.current=false;setMic(true);micRef.current=true;
    setState('connecting');const ready=await capabilityRequest.current;if(!mounted.current||sequence!==voiceSequence.current)return;
    voiceBackend.current??=ready?.voice?'live':'browser';
    if(voiceBackend.current==='browser'){await browserVoice(sequence,{greet:!messagesRef.current.length});return;}
    setState('connecting');liveRequest.current?.abort();const controller=new AbortController();liveRequest.current=controller;
    try{
      let connected=false;
      const connection=await connectLive({messages:messagesRef.current,context:context.current,selectedMediaId:context.current.mediaId,signal:controller.signal,onState:value=>{if(mounted.current)setState(value==='speaking'&&liveExcited.current?'excited':value);},onUser:text=>{if(mounted.current){if(!liveTurnOpen.current){liveMediaTurn.current=mediaSelection.current.beginTurn();liveTurnOpen.current=true;}liveExcited.current=false;setHeard(text);}},onText:text=>{if(mounted.current){liveExcited.current=/!/.test(text);setPartial(text);if(liveExcited.current)setState('excited');}},onLevel:value=>{level.current=value;},onMedia:(id,reply)=>{if(!mounted.current)return;return applyMedia(reply||{mediaId:id},liveMediaTurn.current);},onInterrupt:()=>{mediaSelection.current.invalidate();liveTurnOpen.current=false;},onTurn:turn=>{if(!mounted.current)return;liveTurnOpen.current=false;setMessages(prev=>appendMessages(prev,...(turn.user?[{role:'user',content:turn.user}]:[]),{role:'assistant',content:turn.assistant,mediaId:selectedRef.current}));setHeard('');setPartial('');setBusy(false);if(isFarewell(turn.user)){stopVoice();setMode('type');}},onError:()=>{if(mounted.current&&connected){clearTimeout(timer.current);live.current=null;queueMicrotask(()=>{if(mounted.current&&sequence===voiceSequence.current)recoverVoice.current?.();});}}});
      if(controller.signal.aborted||!mounted.current||sequence!==voiceSequence.current){connection.close();return;}connected=true;live.current=connection;timer.current=setTimeout(()=>{stopVoice();setState('sleeping');},5*60000);
    }catch(err){if(controller.signal.aborted||!mounted.current)return;if(err.name==='NotAllowedError'){stopVoice();setError('Microphone access was declined. You can type instead.');setMode('type');setTranscript(true);}else await browserVoice(sequence,{greet:!messagesRef.current.length,notice:'Live voice is unavailable. Continuing with browser voice.'});}
    } finally {if(sequence===voiceSequence.current)voiceStarting.current=false;}
  };
  const typeInstead=()=>{stopVoice();setMode('type');setActive(true);setTranscript(false);};
  const toggleMic=async()=>{if(!mic){if(live.current){setMic(true);micRef.current=true;try{await live.current.setMic(true);}catch{setMic(false);micRef.current=false;setError('Microphone unavailable. You can type instead.');}}else await startVoice();}else{setMic(false);micRef.current=false;bargeIn.current?.stop();if(live.current)await live.current.setMic(false);else speech.current?.stopListening();setState('idle');}};
  const toggleMute=()=>{const value=!muted;setMuted(value);muteRef.current=value;setEffectsMuted(value);live.current?.setMuted(value);if(value){queue.current?.cancel();speech.current?.stopSpeaking();if(selected?.kind==='song'){mediaSelection.current.choose(null);context.current.mediaId=null;live.current?.setMedia(null);}}};
  const skipSpeech=()=>{
    bargeIn.current?.arm(false);if(!live.current){voiceSequence.current++;voiceStarting.current=false;}
    mediaSelection.current.invalidate();liveTurnOpen.current=false;request.current?.abort();queue.current?.cancel();queue.current=null;
    speech.current?.stopSpeaking();live.current?.stopTalking();setBusy(false);setPartial('');
    if(!live.current&&micRef.current)speech.current?.listen();else setState(micRef.current?'listening':'idle');
  };
  interruptSpeech.current=skipSpeech;
  const submit=e=>{e.preventDefault();const value=draft;if(!value.trim())return;setDraft('');setActive(true);void ask(value,{spoken:mode==='voice'});};
  const onKey=e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(state==='speaking'||state==='excited'||queue.current&&busy)skipSpeech();else if(transcript)setTranscript(false);else if(selectedId){dismissImage();}else requestClose();}
    if(e.key==='Tab'){const controls=[...root.current.querySelectorAll('button,a[href],input,[tabindex="0"]')].filter(el=>!el.disabled&&!el.closest('[inert]')&&el.getClientRects().length);if(!controls.length)return;const first=controls[0],last=controls.at(-1);if(e.shiftKey&&(document.activeElement===first||!controls.includes(document.activeElement))){e.preventDefault();last.focus({preventScroll:true});}else if(!e.shiftKey&&(document.activeElement===last||!controls.includes(document.activeElement))){e.preventDefault();first.focus({preventScroll:true});}}
  };
  const presentation=tourPresentation({state,partial,heard,lastMessage:messages.at(-1),mic,welcome,mode,live:Boolean(live.current),canInterrupt});
  const turn=messages.filter(message=>message.role==='user').length;
  const dismissImage=()=>{mediaSelection.current.choose(null);context.current.mediaId=null;delete context.current.mediaQueue;live.current?.setMedia(null);};
  const controlSound=event=>{const control=event.target.closest?.('button,a');if(!control||control.hasAttribute('data-will-exit')||control.getAttribute('type')==='submit')return;playSound(control.getAttribute('aria-label')==='Open transcript'?'transcript':'click');};
  return <div className={`vill-tour ${active?'is-active':'is-intro'} ${selected?'has-media':''} ${closing?'is-closing':''}`} inert={closing||undefined} onAnimationEnd={event=>{if(event.target===event.currentTarget&&event.animationName==='vill-fade-out')exit.current?.finish();}} role="dialog" aria-modal="true" aria-label="Talk to WILL" ref={root} onKeyDownCapture={onKey} onClickCapture={controlSound}>
    <div className="vill-power-line" aria-hidden="true"/>
    <button type="button" className="vill-close" data-will-exit="" onClick={requestClose} aria-label="Close WILL" title="Close WILL"><VillIcon name="close"/></button>
    <div className="vill-main" inert={transcript||closing||undefined}>
      <div className="vill-ambient"/><div className="vill-scanlines"/>
      <Clusters selected={selectedId} onPick={pick}/>
      <button type="button" className="vill-back" data-will-exit="" onClick={requestClose}><VillIcon name="back"/> Portfolio</button>
      <main className={`vill-stage ${active?'is-active':''} ${active&&mode==='type'?'is-typing':''} ${selected?'has-media':''}`}>
        {selected&&<VillMediaPreview media={selected} companions={companions} key={selected.id} onDismiss={dismissImage}/>}
        {active&&<p className={`vill-status is-${state}`} role="status"><span className="vill-status-bars" aria-hidden="true"><i/><i/><i/></span><b>{state==='thinking'?<ThinkingLabel/>:presentation.primary}</b>{presentation.secondary&&<span>· {presentation.secondary}</span>}</p>}
        {active&&<Caption {...presentation} turn={`${turn}:${presentation.isUser?'you':'will'}`} live={mode==='type'}/>}
        <button type="button" className="vill-face-button" disabled={!active&&previewState!=='ready'} aria-label={['speaking','excited'].includes(state)?'Stop speaking':state==='sleeping'?'Wake WILL':'Talk to WILL'} onClick={()=>{if(['speaking','excited'].includes(state))skipSpeech();else void startVoice();}}><VillMascot state={active?state:'happy'} levelRef={level}/></button>
        {!active?<><h1>{hello}<span>.</span></h1><p className="vill-introduction">WILL is Villiam’s little computer. Talk to it like you would to a person: ask about his work, the products he’s building, or the fun stuff.</p><VillMicrophone enabled={!closing} onState={setPreviewState}/><div className="vill-intro-actions"><button type="button" className="vill-primary" disabled={previewState!=='ready'} onClick={()=>void startVoice()}><VillIcon name="voice"/> Start talking</button><button type="button" className="vill-secondary" onClick={typeInstead}><VillIcon name="type"/> Type instead</button></div></>:null}
      </main>
      {error&&<div className="vill-notice" role="status">{error}<button type="button" aria-label="Dismiss notice" onClick={()=>setError('')}>×</button></div>}
      {active&&<div className="vill-bottom">
        {mode==='type'&&<form className="vill-composer" onSubmit={submit}><span aria-hidden="true">&gt;</span><input aria-label="Ask WILL" value={draft} onChange={event=>setDraft(event.target.value)} maxLength={INPUT_LIMIT} placeholder="Ask WILL about Villiam…" autoComplete="off" spellCheck={false} autoCapitalize="none" enterKeyHint="send"/><button type="submit" aria-label="Send question" disabled={state==='connecting'}><VillIcon name="up"/></button></form>}
        <div className="vill-controls" aria-label="WILL controls">
          <div className="vill-mode">
            <button type="button" aria-label="Voice mode" data-tip="Voice" aria-pressed={mode==='voice'} onClick={()=>void startVoice()}><VillIcon name="voice"/></button>
            <button type="button" aria-label="Type mode" data-tip="Type" aria-pressed={mode==='type'} onClick={typeInstead}><VillIcon name="type"/></button>
          </div>
          <button type="button" data-tip={mic?'Mic on':'Mic off'} aria-label={mic?'Turn microphone off':'Turn microphone on'} aria-pressed={mic} onClick={()=>void toggleMic()} className={mic?'':'is-off'}><VillIcon name="mic"/></button>
          <button type="button" data-tip={muted?'Unmute':'Mute'} aria-label={muted?'Unmute WILL':'Mute WILL'} aria-pressed={!muted} onClick={toggleMute} className={muted?'is-off':''}><VillIcon name="sound"/></button>
          <button type="button" data-tip="Transcript" aria-label="Open transcript" aria-pressed={transcript} onClick={()=>setTranscript(true)}><VillIcon name="transcript"/></button>
          <button className="vill-end" data-will-exit="" type="button" onClick={requestClose}>End</button>
        </div>
      </div>}
    </div>
    {transcript&&<div className="vill-transcript-layer" onClick={event=>{if(event.target===event.currentTarget)setTranscript(false);}}>
      <section className={`vill-transcript ${large?'is-large':''}`} aria-label="WILL transcript">
        <header>
          <WindowControls title="WILL chat" maximized={large} onClose={()=>setTranscript(false)} onMinimize={()=>setTranscript(false)} onMaximize={()=>setLarge(value=>!value)}/>
          <span className="vill-transcript-title">will — transcript — 80×24</span>
        </header>
        <div className="vill-transcript-body" ref={logs}>
          <div className="vill-transcript-welcome"><p><span aria-hidden="true">✻</span> Welcome to <b>WILL</b>!</p><p>/help for help, esc to close</p><p>cwd: ~/srivilliamsai/portfolio</p></div>
          <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
            {!messages.length&&!partial&&<article className="vill-message is-assistant"><span className="vill-message-mark" aria-hidden="true">●</span><div><p>{welcome}</p></div></article>}
            {messages.map((message,index)=><article key={index} className={`vill-message is-${message.role}`}>
              <span className="vill-message-mark" aria-hidden="true">{message.role==='user'?'>':'●'}</span>
              <div><p>{message.role==='user'?message.content:assistantText(message.content)}</p>
                {message.links?.length>0&&<div className="vill-answer-links">{message.links.filter(link=>isSafeLink(link.href)).map(link=>link.href.startsWith('/')?<Link key={link.href} to={link.href} onClick={onClose}>{link.label}<VillIcon name="arrow" width="13" height="13"/></Link>:<a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<VillIcon name="arrow" width="13" height="13"/></a>)}</div>}
                {message.mediaId&&getMedia(message.mediaId)&&<button className="vill-message-media" type="button" aria-label={`View ${getMedia(message.mediaId).title}`} onClick={()=>{context.current=mergeAssistantContext(context.current,{mediaId:message.mediaId,mediaQueue:message.mediaQueue||null});pick(message.mediaId);setTranscript(false);}}><img src={getMedia(message.mediaId).thumbnail||getMedia(message.mediaId).src} alt=""/>{message.mediaQueue?.filter(id=>id!==message.mediaId&&getMedia(id)?.entityId==='about').map(id=><img key={id} src={getMedia(id).thumbnail||getMedia(id).src} alt=""/>)}<span><small>View image ↗</small></span></button>}
              </div>
            </article>)}
            {heard&&voiceBackend.current==='live'&&<article className="vill-message is-user"><span className="vill-message-mark" aria-hidden="true">&gt;</span><p>{heard}</p></article>}
            {partial&&(mode==='type'||voiceBackend.current==='live')&&<article className="vill-message is-assistant"><span className="vill-message-mark" aria-hidden="true">●</span><p>{assistantText(partial)}</p></article>}
            {busy&&!partial&&<p className="vill-thinking" role="status">✳ WILL is thinking<span>…</span></p>}
          </div>
        </div>
        {error&&<p className="vill-transcript-error" role="status">{error}</p>}
        <form className="vill-transcript-prompt" onSubmit={submit}><span aria-hidden="true">&gt;</span><input ref={input} aria-label="Ask WILL in transcript" value={draft} onChange={event=>setDraft(event.target.value)} maxLength={INPUT_LIMIT} placeholder={'Try "what is Villiam building?"'} autoComplete="off" spellCheck={false} autoCapitalize="none" enterKeyHint="send"/><button type="submit" aria-label="Send question" disabled={!draft.trim()}><VillIcon name="up"/></button></form>
        {shortcuts&&<div className="vill-transcript-keys"><span><b>Enter</b> send</span><span><b>Esc</b> close</span><span><b>/clear</b> clear conversation</span><span><b>/help</b> hide shortcuts</span></div>}
        <footer><button type="button" onClick={()=>setShortcuts(value=>!value)} aria-expanded={shortcuts}>? for shortcuts</button><span>{mode==='voice'&&mic?(capabilities.voice?'real-time voice':'voice')+' · '+(muted?'muted':'on'):'voice · off'}</span></footer>
      </section>
    </div>}
  </div>;
}
