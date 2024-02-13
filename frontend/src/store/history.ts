// undo/redo reference: https://redux.js.org/usage/implementing-undo-history
import { create } from "zustand";

type HistoryItem = string;

type State = {
  past: HistoryItem[],
  present: HistoryItem,
  future: HistoryItem[],
}

type Action = {
  addHistory: (value: HistoryItem) => void,
  undo: () => void,
  redo: () => void,
}

export const useUndoRedo = create<State & Action>((set) => ({
  past: [],
  present: '' as HistoryItem,
  future: [],
  addHistory: (value: HistoryItem) => set((state: State) => {
    const newState = state;
    if (state.present) {
      newState.past = [...state.past, state.present];
    }
    newState.present = value;
    newState.future = [];
    console.log(newState);
    return newState;
  }),
  undo: () => set((state: State) => {
    console.log("Undoing...");
    const newState = state;
    if (state.past.length === 0 && !state.present) {
      return newState;
    }
    if (state.past.length === 0 && state.present) {
      newState.past = ['' as HistoryItem];
    }
    newState.future = [state.present, ...state.future]
    newState.present = state.past[state.past.length - 1]
    newState.past = state.past.slice(0, state.past.length - 1)
    console.log(newState);
    return newState;
  }),
  redo: () => set((state: State) => {
    console.log("Redoing...");
    const newState = state;
    if (state.future.length === 0) {
      return newState;
    }
    newState.past = [...state.past, state.present];
    newState.present = state.future[0];
    newState.future = state.future.slice(1, state.future.length);
    console.log(newState);
    return newState
  })
}));
