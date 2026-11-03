export const initialHistoryState = { commands: [], index: -1, draft: '', input: '' };

export function terminalHistoryReducer(state, action) {
  switch (action.type) {
    case 'type':
      return { ...state, input: action.value, draft: action.value, index: -1 };
    case 'execute': {
      const command = action.command.trim();
      if (!command) return state;
      return { commands: [...state.commands, command], index: -1, draft: '', input: '' };
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
