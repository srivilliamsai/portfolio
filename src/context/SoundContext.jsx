import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { createSoundEngine, playControlSound } from '../services/interfaceSounds';

const SoundContext = createContext({ playSound() { return false; } });
export function SoundProvider({ children }) {
  const engine = useRef(null);
  if (!engine.current) engine.current = createSoundEngine({
    contextFactory: () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      return AudioContext ? new AudioContext() : null;
    },
    loadMessage: async () => {
      const response = await fetch('/static/media/message-popin.mp3');
      return response.ok ? response.arrayBuffer() : null;
    },
  });
  const playSound = useCallback((section, kind) => playControlSound(engine.current,section,kind), []);
  const setSectionMuted = useCallback((section,value) => engine.current.setSectionMuted(section,value), []);
  useEffect(() => {
    engine.current.setEnabled(true);
    const unlock = () => { void engine.current.unlock(); };
    const restore = () => { if(document.visibilityState!=='hidden')unlock(); };
    unlock();
    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('keydown', unlock, true);
    document.addEventListener('visibilitychange', restore);
    window.addEventListener('pageshow', restore);
    return () => {
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('keydown', unlock, true);
      document.removeEventListener('visibilitychange', restore);
      window.removeEventListener('pageshow', restore);
      engine.current.dispose();
    };
  }, []);
  return <SoundContext.Provider value={{ playSound, setSectionMuted }}>{children}</SoundContext.Provider>;
}
export function useSound(section) {
  const sound = useContext(SoundContext);
  const playSound = useCallback((kind) => sound.playSound(section, kind), [sound.playSound, section]);
  const setMuted = useCallback(value => sound.setSectionMuted?.(section,value), [sound.setSectionMuted,section]);
  return { playSound, setMuted };
}
