import {displayOwnerName,spokenOwnerName} from './assistantIdentity.js';
import {createUtteranceCaptions} from './assistantCaptions.js';
import {createSpeechAudioPlayer,prepareSpeechAudio} from './assistantSpeechAudio.js';

// Prefer the owner-selected Aman (Indian English), then retain one voice for this tour.
export function selectMaleVoice(voices = []) {
  const english = voices.filter(voice => /^en(?:[-_]|$)/i.test(voice.lang) && !/female/i.test(voice.name));
  const preferences = [/\bAman\b/i, /\bDaniel\b/i, /\bRyan\b/i, /\bOliver\b/i, /\bArthur\b/i, /Google UK English Male/i, /\bGuy\b/i, /\bAaron\b/i, /\bAlex\b/i, /\bDavid\b/i, /\bGeorge\b/i, /\bMale\b/i];
  const quality = voice => /premium|neural|natural/i.test(`${voice.name} ${voice.voiceURI || ''}`) ? 2 : /enhanced/i.test(`${voice.name} ${voice.voiceURI || ''}`) ? 1 : 0;
  const known = english.map(voice => ({voice, rank:preferences.findIndex(pattern => pattern.test(voice.name))})).filter(item => item.rank >= 0);
  const preferred = known.filter(({rank,voice}) => rank === 0 && /^en[-_]IN$/i.test(voice.lang));
  const candidates = preferred.length ? preferred : known.filter(({rank}) => rank > 0);
  candidates.sort((a,b) => quality(b.voice)-quality(a.voice) || a.rank-b.rank || `${a.voice.name}|${a.voice.lang}|${a.voice.voiceURI || ''}`.localeCompare(`${b.voice.name}|${b.voice.lang}|${b.voice.voiceURI || ''}`));
  if (candidates.length) return candidates[0].voice;
  return null;
}

export function createBrowserSpeech({ environment = globalThis, onState = () => {}, onInterim = () => {}, onFinal = () => {}, onError = () => {}, onCaption = () => {}, onLevel = () => {}, useServerTts = () => false, voiceWaitMs = 1500, recognitionSilenceMs = 700 } = {}) {
  const synth = environment.speechSynthesis;
  const Recognition = environment.SpeechRecognition || environment.webkitSpeechRecognition;
  let recognition = null, utterance = null, finishSpeech = null, disposed = false, generation = 0, captions = null;
  let pinnedVoice = selectMaleVoice(synth?.getVoices()), voiceReady = null, cancelVoiceWait = null;
  let recognitionTimer=null;
  const setRecognitionTimer=environment.setTimeout?.bind(environment)||setTimeout,clearRecognitionTimer=environment.clearTimeout?.bind(environment)||clearTimeout;
  let levelFrame=0,serverUnavailable=false;
  const audioPlayer=createSpeechAudioPlayer({environment,onState,onCaption,onLevel});
  const quiet=()=>{environment.cancelAnimationFrame?.(levelFrame);levelFrame=0;onLevel(0);};
  const animateLevel=()=>{
    quiet();const began=environment.performance?.now?.()||0;
    const tick=time=>{onLevel(.18+.48*Math.abs(Math.sin((time-began)/115))* (.7+.3*Math.sin((time-began)/237)**2));levelFrame=environment.requestAnimationFrame?.(tick)||0;};
    tick(began);
  };

  function prepareVoice() {
    if (!pinnedVoice) pinnedVoice = selectMaleVoice(synth?.getVoices());
    if (pinnedVoice || !synth) return Promise.resolve(pinnedVoice);
    if (voiceReady) return voiceReady;
    voiceReady = new Promise(resolve => {
      let timeout;
      const finish = voice => {
        clearTimeout(timeout);
        synth.removeEventListener?.('voiceschanged', changed);
        cancelVoiceWait = null;
        if (!disposed && voice) pinnedVoice = voice;
        resolve(pinnedVoice);
      };
      const changed = () => { const voice = selectMaleVoice(synth.getVoices()); if (voice) finish(voice); };
      cancelVoiceWait = () => finish(null);
      synth.addEventListener?.('voiceschanged', changed);
      timeout = setTimeout(() => finish(null), voiceWaitMs);
      changed();
    });
    return voiceReady;
  }
  // Start discovering installed voices while the visitor is reading the welcome screen.
  void prepareVoice();

  function stopListening() {
    clearRecognitionTimer(recognitionTimer);recognitionTimer=null;
    const current = recognition;
    recognition = null;
    if (current) { current.onresult = current.onerror = current.onend = null; try { current.abort(); } catch {} }
  }
  function stopSpeaking() {
    generation++;
    quiet();audioPlayer.stop();
    const current = utterance;
    if (current) { current.onstart = current.onend = current.onerror = current.onboundary = current.onpause = current.onresume = null; synth?.cancel(); }
    captions?.cancel(); captions = null; utterance = null;
    const finish = finishSpeech;
    finishSpeech = null;
    finish?.();
    if (current && !disposed) onState('idle');
  }
  return {
    supported: Boolean(Recognition),
    unlock(){try{void audioPlayer.unlock()?.catch(()=>{});}catch{}},
    async prepare(text,options={}){
      if(!useServerTts()||serverUnavailable)return null;
      const bytes=await prepareSpeechAudio(text,{...options,fetcher:environment.fetch?.bind(environment)});
      if(!bytes&&!options.signal?.aborted)serverUnavailable=true;
      return bytes;
    },
    listen() {
      if (disposed) return false;
      stopSpeaking(); stopListening();
      if (!Recognition) { onError('Voice input is unavailable in this browser. You can type instead.'); return false; }
      const current = new Recognition(); recognition = current;
      current.lang = 'en-IN'; current.continuous = false; current.interimResults = true;
      let final = false,interim='';
      const deliver=text=>{if(final||disposed||recognition!==current||!text.trim())return;final=true;stopListening();onFinal(text.trim());};
      current.onstart = () => { if (!disposed) onState('listening'); };
      current.onresult = event => {
        if(disposed||recognition!==current||final)return;
        let partial = '';
        for (let index = event.resultIndex; index < event.results.length; index++) {
          if (event.results[index].isFinal) {
            const text = event.results[index][0].transcript;
            deliver(text); return;
          }
          partial += event.results[index][0].transcript;
        }
        onInterim(partial);
        interim=partial;clearRecognitionTimer(recognitionTimer);
        if(interim.trim())recognitionTimer=setRecognitionTimer(()=>deliver(interim),recognitionSilenceMs);
      };
      current.onerror = event => {
        if (disposed) return;
        stopListening(); onState('idle');
        if (event.error !== 'aborted') onError(event.error === 'not-allowed' ? 'Microphone access was declined. You can type instead.' : 'I couldn’t hear that clearly. Try again or type your question.');
      };
      current.onend = () => {if(recognition===current){if(!final&&interim.trim()){deliver(interim);return;}recognition=null;clearRecognitionTimer(recognitionTimer);recognitionTimer=null;if(!final&&!disposed)onState('idle');}};
      try { current.start(); return true; } catch { recognition = null; onError('Microphone is busy. Try again or type instead.'); return false; }
    },
    async speak(text,{audio,signal,onStart=()=>{}}={}) {
      stopListening(); stopSpeaking();
      if (disposed||signal?.aborted) return;
      const turn = generation;
      if(audio){
        const bytes=await audio;
        if(disposed||turn!==generation||signal?.aborted)return;
        if(bytes)try{if(await audioPlayer.play(bytes,displayOwnerName(text),{onStart}))return;}catch{audioPlayer.stop();}
        if(disposed||turn!==generation||signal?.aborted)return;
      }
      // Avoid even a microtask delay when the voice is already available.
      const voice = pinnedVoice || await prepareVoice();
      if (disposed || turn !== generation) return;
      if (!synth || !environment.SpeechSynthesisUtterance || !voice) {
        onState('idle'); onError('A male voice is not available on this device. Replies are available as text.'); return;
      }
      return new Promise(resolve => {
        finishSpeech = resolve;
        const displayText=displayOwnerName(text);
        const current = new environment.SpeechSynthesisUtterance(spokenOwnerName(displayText));
        utterance = current;
        current.voice = voice; current.lang = voice.lang;
        current.rate = 0.94; current.pitch = 0.96; current.volume = 0.85;
        const progress=createUtteranceCaptions({text:displayText,rate:current.rate,onCaption:value=>{if(!disposed&&utterance===current)onCaption(value);}});
        captions=progress;
        current.onstart = () => { if (!disposed && utterance === current) {onState('speaking');onStart();progress.start();animateLevel();} };
        current.onboundary = event => {if(!disposed&&utterance===current)progress.boundary(event);};
        current.onpause = () => {progress.pause();quiet();};
        current.onresume = () => {if(!disposed&&utterance===current){progress.resume();animateLevel();}};
        const done = (complete=false) => {
          if (utterance !== current) return;
          quiet();
          if(complete)progress.finish();else progress.cancel();
          captions=null;
          utterance = null; finishSpeech = null;
          if (!disposed) onState('idle');
          resolve();
        };
        current.onend = () => done(true);
        current.onerror = event => {
          if (utterance !== current) return;
          done();
          if (!disposed && !['canceled', 'interrupted'].includes(event.error)) onError('Voice playback is unavailable. You can continue by typing.');
        };
        try { synth.speak(current); } catch { done(); onError('Voice playback is unavailable. You can continue by typing.'); }
      });
    },
    stopListening, stopSpeaking,
    dispose() { disposed = true; stopListening(); stopSpeaking(); audioPlayer.dispose();cancelVoiceWait?.(); }
  };
}
