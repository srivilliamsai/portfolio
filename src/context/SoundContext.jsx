import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { createSoundEngine } from '../services/interfaceSounds';

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
  const playSound = useCallback((section, kind) => {
    const played = engine.current.play(section, kind);
    if (!played && kind !== 'message' && !engine.current.isReady() && navigator.userActivation?.isActive) {
      const requestedAt = performance.now();
      void engine.current.unlock().then((ready) => {
        if (ready && performance.now() - requestedAt < 250) {
          engine.current.play(section, kind);
        }
      });
    }
    return played;
  }, []);
  const setSectionMuted = useCallback((section,value) => engine.current.setSectionMuted(section,value), []);
  useEffect(() => {
    engine.current.setEnabled(true);
    const unlock = () => { void engine.current.unlock(); };
    unlock();
    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('keydown', unlock, true);
    return () => {
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('keydown', unlock, true);
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
