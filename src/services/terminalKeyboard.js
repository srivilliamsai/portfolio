export const terminalShortcuts = [
  { action: 'Open / close terminal', mac: '⌘K', windows: 'Ctrl+K' },
  { action: 'Run command', mac: 'Enter', windows: 'Enter' },
  { action: 'Previous / next command', mac: '↑ / ↓', windows: '↑ / ↓' },
  { action: 'Complete command', mac: 'Tab', windows: 'Tab' },
  { action: 'Clear output', mac: '⌘L or Ctrl+L', windows: 'Ctrl+L' },
  { action: 'Clear input', mac: 'Ctrl+U', windows: 'Ctrl+U' },
  { action: 'Cancel input', mac: 'Ctrl+C or Ctrl+G', windows: 'Ctrl+C or Ctrl+G' },
  { action: 'Close terminal', mac: 'Esc', windows: 'Esc' },
  { action: 'Move keyboard focus', mac: 'Tab / Shift+Tab', windows: 'Tab / Shift+Tab' },
  { action: 'Copy / paste / select all', mac: '⌘C / ⌘V / ⌘A', windows: 'Ctrl+C / Ctrl+V / Ctrl+A' },
];

function isComposing(event) {
  return event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229;
}

export function isTerminalToggle(event) {
  return !event.defaultPrevented && !isComposing(event) && !event.repeat && !event.altKey && !event.shiftKey
    && Boolean(event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
}

export function terminalInputAction(event, { hasSelection = false } = {}) {
  if (isComposing(event) || event.altKey) return null;
  const key = event.key.toLowerCase();
  if (!event.shiftKey && (event.metaKey || event.ctrlKey) && key === 'l') return 'clear-output';
  if (!event.shiftKey && event.ctrlKey && !event.metaKey) {
    if (key === 'u') return 'clear-input';
    if (key === 'g') return 'cancel-input';
    if (key === 'c' && !hasSelection) return 'cancel-input';
  }
  if (event.metaKey || event.ctrlKey || event.shiftKey) return null;
  if (event.key === 'Enter' && !event.repeat) return 'execute';
  if (event.key === 'ArrowUp') return 'previous';
  if (event.key === 'ArrowDown') return 'next';
  if (event.key === 'Tab') return 'complete';
  return null;
}
