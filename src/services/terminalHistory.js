export const TERMINAL_INPUT_LIMIT = 400;
export const TERMINAL_HISTORY_LIMIT = 100;
export const boundTerminalInput = (value) => String(value ?? '').slice(0, TERMINAL_INPUT_LIMIT);
export const appendTerminalEntry = (entries, entry) => [...entries.slice(-(TERMINAL_HISTORY_LIMIT - 1)), entry];

export const initialHistoryState = { commands: [], index: -1, draft: '', input: '' };

export function terminalHistoryReducer(state, action) {
  switch (action.type) {
    case 'type':
      return { ...state, input: boundTerminalInput(action.value), draft: boundTerminalInput(action.value), index: -1 };
    case 'execute': {
      const command = boundTerminalInput(action.command).trim();
      if (!command) return state;
      return { commands: [...state.commands.slice(-(TERMINAL_HISTORY_LIMIT - 1)), command], index: -1, draft: '', input: '' };
    }
    case 'previous': {
      if (!state.commands.length) return state;
      const index = state.index === -1 ? state.commands.length - 1 : Math.max(0, state.index - 1);
      return { ...state, index, draft: state.index === -1 ? state.input : state.draft, input: state.commands[index] };
    }
    case 'next': {
      if (state.index === -1) return state;
      const index = state.index + 1;
      return index >= state.commands.length
        ? { ...state, index: -1, input: state.draft }
        : { ...state, index, input: state.commands[index] };
    }
    default:
      return state;
  }
}
