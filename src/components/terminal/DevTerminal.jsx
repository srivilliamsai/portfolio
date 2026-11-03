import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { getTerminalReply, getTerminalCompletions, resolveTerminalCommand, terminalWelcome } from '../../services/terminalCommands';
import { terminalHistoryReducer, initialHistoryState, TERMINAL_INPUT_LIMIT, appendTerminalEntry, boundTerminalInput } from '../../services/terminalHistory';
import { terminalInputAction, terminalShortcuts } from '../../services/terminalKeyboard';

import { isSafeLink } from '../../services/linkSafety';

function renderOutput(text) {
  return text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g).map((part, index) => {
    if (/^https?:\/\//.test(part) && isSafeLink(part)) return <a key={index} className="terminal-output-link" href={part} target="_blank" rel="noreferrer">{part}</a>;
    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) return <a key={index} className="terminal-output-link" href={`mailto:${part}`}>{part}</a>;
    return part;
  });
}

function TerminalPrompt() {
  return (
    <span className="terminal-prompt" aria-hidden="true">
      <span className="terminal-user">srivilliamsai@dev</span>
      <span className="terminal-separator">:</span>
      <span className="terminal-path">~</span>
      <span className="terminal-dollar">$</span>
    </span>
  );
}

export default function DevTerminal() {
  const { isTerminalOpen, closeTerminal, returnFocusRef } = useTerminal();
  const [history, setHistory] = useState([{ command: '', output: terminalWelcome }]);
  const [recall, dispatchRecall] = useReducer(terminalHistoryReducer, initialHistoryState);
  const { input } = recall;
  const [isMaximized, setIsMaximized] = useState(false);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const logsRef = useRef(null);
  const conversationRef = useRef(null);

  useEffect(() => {
    if (!isTerminalOpen) return;
    const previousFocus = returnFocusRef.current || document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const handleKey = (event) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.key === 'Escape') { event.preventDefault(); closeTerminal(); }
      if (event.key === 'Tab') {
        const controls = [...modalRef.current.querySelectorAll('button, a[href], input, summary')].filter((control) => !control.disabled && control.getClientRects().length);
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      // The mobile navigation trigger is hidden after its menu closes.
      if (previousFocus?.getClientRects().length) previousFocus.focus();
      else document.querySelector('.portfolio-menu-toggle')?.focus();
    };
  }, [isTerminalOpen, closeTerminal, returnFocusRef]);

  useEffect(() => { if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight; }, [history, isTerminalOpen, feedback]);

  const execute = (value = input) => {
    const command = boundTerminalInput(value).trim();
    if (!command) return;
    setFeedback('');
    dispatchRecall({ type: 'execute', command });
    const resolved = resolveTerminalCommand(command);
    const reply = getTerminalReply(command, conversationRef.current);
    conversationRef.current = reply.context;
    if (resolved.command === 'clear') setHistory(resolved.corrected ? [{ command, output: reply.output }] : []);
    else setHistory((previous) => appendTerminalEntry(previous, { command, output: reply.output }));
    inputRef.current?.focus();
  };

  const handleInputKey = (event) => {
    const hasSelection = event.currentTarget.selectionStart !== event.currentTarget.selectionEnd || Boolean(window.getSelection()?.toString());
    const action = terminalInputAction(event, { hasSelection });
    if (!action) return;
    if (action === 'complete') {
      const matches = getTerminalCompletions(input);
      if (!matches.length || (matches.length === 1 && matches[0] === input)) return;
      event.preventDefault();
      if (matches.length === 1) {
        dispatchRecall({ type: 'type', value: matches[0] });
        setFeedback(`Completed: ${matches[0]}.`);
      } else setFeedback(`Matches: ${matches.join(', ')}. Type more letters.`);
      return;
    }
    event.preventDefault();
    setFeedback('');
    if (action === 'execute') execute();
    else if (action === 'previous' || action === 'next') dispatchRecall({ type: action });
    else if (action === 'clear-output') { conversationRef.current = null; setHistory([]); setFeedback('Output cleared.'); }
    else {
      dispatchRecall({ type: 'type', value: '' });
      setFeedback(action === 'cancel-input' ? 'Input cancelled.' : 'Input cleared.');
    }
  };

  if (!isTerminalOpen) return null;

  return (
    <div className="dev-terminal-backdrop" onClick={closeTerminal}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="terminal-title" className={`dev-terminal-modal ${isMaximized ? 'maximized' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="dev-terminal-header">
          <div className="dev-terminal-lights">
            <button type="button" onClick={closeTerminal} className="dev-terminal-light-btn red" aria-label="Close terminal" title="Close terminal (Esc / ⌘K / Ctrl+K)">
              <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
            </button>
            <button type="button" onClick={closeTerminal} className="dev-terminal-light-btn yellow" aria-label="Minimize terminal" title="Minimize terminal">
              <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round"><line x1="1.5" y1="5" x2="8.5" y2="5" /></svg>
            </button>
            <button type="button" onClick={() => setIsMaximized((value) => !value)} className="dev-terminal-light-btn green" aria-label={isMaximized ? 'Restore terminal size' : 'Maximize terminal'} title={isMaximized ? 'Restore size' : 'Full screen (+)'}>
              <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="1.5" x2="5" y2="8.5" /><line x1="1.5" y1="5" x2="8.5" y2="5" /></svg>
            </button>
          </div>
          <div id="terminal-title" className="dev-terminal-title">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
            <span>srivilliamsai-dev-shell — zsh</span>
          </div>
          <div className="terminal-header-spacer" aria-hidden="true" />
        </div>
        <div className="dev-terminal-quick-bar" aria-label="Suggested terminal commands">
          <span className="terminal-quick-label">Try typing:</span>
          {['help', 'skills', 'projects', 'exp', 'certs', 'arch', 'contact', 'sudo hire', 'clear'].map((command) => <button key={command} type="button" className={`dev-terminal-quick-btn${command === 'sudo hire' ? ' sudo' : ''}`} onClick={() => execute(command)}>{command}</button>)}
        </div>
        <div ref={logsRef} className="dev-terminal-logs" onClick={(event) => { if (!event.target.closest('a, input, button') && !window.getSelection()?.toString()) inputRef.current?.focus(); }}>
          <div className="terminal-log-history" role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions">
            {history.map((entry, index) => (
              <div className="terminal-entry" key={index}>
                {entry.command && <p className="terminal-command"><TerminalPrompt /><span className="terminal-command-text">{entry.command}</span></p>}
                <pre>{renderOutput(entry.output)}</pre>
              </div>
            ))}
          </div>
          <p className="terminal-feedback" role="status">{feedback}</p>
          <label className="terminal-input-line"><TerminalPrompt /><span className="sr-only">Terminal command</span><input ref={inputRef} type="text" maxLength={TERMINAL_INPUT_LIMIT} className="dev-terminal-input" value={input} onChange={(event) => { dispatchRecall({ type: 'type', value: event.target.value }); setFeedback(''); }} onKeyDown={handleInputKey} placeholder="Type command here (try 'help')..." spellCheck={false} autoComplete="off" autoCapitalize="none" enterKeyHint="send" /></label>
        </div>
        <footer className="terminal-shortcut-bar" aria-label="Terminal keyboard shortcuts">
          <p><kbd>Enter</kbd> run <span aria-hidden="true">·</span> <kbd>↑↓</kbd> history <span aria-hidden="true">·</span> <kbd>Tab</kbd> complete</p>
          <details className="terminal-shortcut-details">
            <summary>Keyboard shortcuts</summary>
            <div className="terminal-shortcut-panel">
              <table>
                <caption>Mac &amp; Windows shortcuts</caption>
                <thead><tr><th scope="col">Action</th><th scope="col">Mac</th><th scope="col">Windows</th></tr></thead>
                <tbody>{terminalShortcuts.map((item) => <tr key={item.action}><th scope="row">{item.action}</th><td>{item.mac}</td><td>{item.windows}</td></tr>)}</tbody>
              </table>
              <p>Tab moves focus when input is empty or complete. Ctrl+C copies selected text; otherwise it cancels input. Use Ctrl+G if your browser reserves Ctrl+C.</p>
            </div>
          </details>
        </footer>
      </div>
    </div>
  );
}
