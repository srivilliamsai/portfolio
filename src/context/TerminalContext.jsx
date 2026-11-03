import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { isTerminalToggle } from '../services/terminalKeyboard';

const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const returnFocusRef = useRef(null);

  const openTerminal = useCallback(() => {
    returnFocusRef.current = document.activeElement;
    setIsTerminalOpen(true);
  }, []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const toggleTerminal = useCallback(() => {
    if (isTerminalOpen) closeTerminal();
    else openTerminal();
  }, [isTerminalOpen, openTerminal, closeTerminal]);

  // Global keyboard shortcut: Command+K (Mac) or Ctrl+K (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTerminalToggle(event)) {
        event.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal]);

  const value = useMemo(() => ({ isTerminalOpen, openTerminal, closeTerminal, toggleTerminal, returnFocusRef }),
    [isTerminalOpen, openTerminal, closeTerminal, toggleTerminal]);

  return (
    <TerminalContext.Provider
      value={value}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
