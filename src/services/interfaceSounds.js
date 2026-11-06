import {playWillEffect} from './willSounds.js';

// Safari may suspend/interupt audio when returning to a tab. Retry the current
// deliberate control after resume; do not depend on UserActivation support.
export function playControlSound(engine,section,kind,now=()=>performance.now()){
  const played=engine.play(section,kind);
  if(!played&&kind!=='message'&&!engine.isReady()){
    const requestedAt=now();
    void engine.unlock().then(ready=>{if(ready&&now()-requestedAt<1000)engine.play(section,kind);});
  }
  return played;
}

// Audio is scoped to deliberate controls in WILL, contact, cards, and the rotary 404.
const sectionSounds = new Map([
  ['contact', new Set(['message', 'shuffle', 'send'])],
  ['open-source', new Set(['shuffle'])],
  ['credentials', new Set(['shuffle'])],
  ['404', new Set(['click', 'shuffle'])],
  ['will', new Set(['open', 'close', 'click', 'select', 'send', 'listen', 'think', 'transcript'])],
]);
export function createSoundEngine({ contextFactory, loadMessage = async () => null, now = () => performance.now() }) {
  let enabled = false;
  let context, messageBuffer, messageLoad;
  const lastPlayed = new Map();
  const active = new Map(), mutedSections = new Set();
  function connect(source, gain, nodes = [], section = null) {
    source.connect(nodes[0] || gain);
    nodes.forEach((node, index) => node.connect(nodes[index + 1] || gain));
    gain.connect(context.destination);
    const cleanup = () => {
      active.delete(source);
      source.disconnect(); gain.disconnect(); nodes.forEach((node) => node.disconnect());
    };
    source.onended = cleanup;
    active.set(source,section);
  }
  function stopActive(section = null) {
    for (const [source,owner] of active) {
      if(section!==null&&owner!==section)continue;
      try { source.stop(); } catch { /* The source may already have ended. */ }
      active.delete(source);
    }
  }
  function ensureContext() {
    if (!context || context.state === 'closed') context = contextFactory();
    return context;
  }
  async function prepareMessage(current) {
    messageLoad ??= Promise.resolve().then(loadMessage)
      .then((bytes) => bytes ? current.decodeAudioData(bytes.slice(0)) : null)
      .then((buffer) => { if (context === current) messageBuffer = buffer; })
      .catch(() => {});
    await messageLoad;
  }
  async function unlock() {
    if (!enabled) return false;
    try {
      const current = ensureContext();
      if (!current) return false;
      if (current.state !== 'running') await current.resume();
      if (!enabled || context !== current || current.state !== 'running') return false;
      // UI clicks must not wait for the contact recording to download or decode.
      void prepareMessage(current);
      return enabled && context === current && current.state === 'running';
    } catch { return false; }
  }
  function tone(frequency, start, duration, level) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(level, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    connect(oscillator, gain);
    oscillator.start(start); oscillator.stop(start + duration + 0.01);
  }
  function message(start) {
    if (messageBuffer) {
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = messageBuffer;
      gain.gain.setValueAtTime(0.2, start);
      connect(source, gain); source.start(start);
      return;
    }
    // Match the reference's rising pop while the local recording is loading.
    const source = context.createOscillator();
    const gain = context.createGain();
    source.type = 'sine';
    source.frequency.setValueAtTime(340, start);
    source.frequency.linearRampToValueAtTime(365, start + 0.16);
    source.frequency.exponentialRampToValueAtTime(455, start + 0.27);
    gain.gain.setValueAtTime(0.0001, start);
    for (const [time, level] of [[0.06, 0.008], [0.14, 0.035], [0.22, 0.16], [0.28, 0.113], [0.32, 0.064], [0.36, 0.023], [0.4, 0.004], [0.46, 0.0001]]) {
      gain.gain.exponentialRampToValueAtTime(level, start + time);
    }
    connect(source, gain); source.start(start); source.stop(start + 0.48);
  }
  function paper(start) {
    const duration = 0.75;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index++) samples[index] = 2 * Math.random() - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer; filter.type = 'bandpass'; filter.Q.value = 1.1;
    filter.frequency.setValueAtTime(380, start);
    filter.frequency.exponentialRampToValueAtTime(2400, start + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(900, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    connect(source, gain, [filter]); source.start(start); source.stop(start + duration);
  }
  return {
    isReady: () => enabled && context?.state === 'running',
    setEnabled(value) { enabled = Boolean(value); if (!enabled) stopActive(); },
    setSectionMuted(section,value) { if(!sectionSounds.has(section))return; if(value){mutedSections.add(section);stopActive(section);}else mutedSections.delete(section); },
    unlock,
    play(section, kind) {
      if (!enabled || mutedSections.has(section) || !sectionSounds.get(section)?.has(kind)) return false;
      const time = now();
      const key = `${section}:${kind}`;
      const cooldown = kind === 'message' ? 200 : kind === 'send' ? 300 : 65;
      if (time - (lastPlayed.get(key) ?? -Infinity) < cooldown) return false;
      try {
        // Timed contact messages stay silent until a visitor gesture unlocks audio.
        if (!context && (kind === 'message' || kind === 'send')) return false;
        const current = ensureContext();
        if (!current || current.state !== 'running') return false;
        lastPlayed.set(key, time);
        const start = current.currentTime;
        if (section === 'will') playWillEffect(kind,{context:current,connect:(source,gain,nodes)=>connect(source,gain,nodes,'will')});
        else if (kind === 'shuffle') { tone(420, start, 0.08, 0.022); tone(620, start + 0.045, 0.1, 0.016); }
        else if (kind === 'message') message(start);
        else if (kind === 'send') paper(start);
        else tone(720, start, 0.055, 0.025);
        return true;
      } catch { return false; }
    },
    dispose() {
      enabled = false; stopActive();
      if (context && context.state !== 'closed') Promise.resolve(context.close()).catch(() => {});
      context = undefined; messageBuffer = undefined; messageLoad = undefined; lastPlayed.clear(); mutedSections.clear();
    },
  };
}
