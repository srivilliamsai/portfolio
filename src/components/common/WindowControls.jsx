import React from 'react';

export default function WindowControls({ title, maximized, onClose, onMinimize, onMaximize }) {
  return <div className="window-controls" onPointerDown={event => event.stopPropagation()}>
    <button type="button" onClick={onClose} className="window-control-button red" aria-label={`Close ${title}`} title={`Close ${title}`}>
      <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"><path d="m2 2 6 6m0-6L2 8" /></svg>
    </button>
    <button type="button" onClick={onMinimize} className="window-control-button yellow" aria-label={`Minimize ${title}`} title={`Minimize ${title}`}>
      <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"><path d="M1.5 5h7" /></svg>
    </button>
    <button type="button" onClick={onMaximize} className="window-control-button green" aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}${maximized ? ' size' : ''}`} title={maximized ? 'Restore size' : 'Maximize'}>
      <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"><path d="M5 1.5v7M1.5 5h7" /></svg>
    </button>
  </div>;
}
