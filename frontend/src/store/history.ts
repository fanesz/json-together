// undo/redo reference: https://redux.js.org/usage/implementing-undo-history
import { create } from "zustand";

type HistoryItem = {
  text: string;
  mousePosition: number;
};

const INIT_HISTORY_ITEM: HistoryItem = {
  text: "",
  mousePosition: 0,
};

type State = {
  past: HistoryItem[];
  present: HistoryItem;
  future: HistoryItem[];
};

type Action = {
  addHistory: (value: HistoryItem) => void;
  undo: (value: HistoryItem) => void;
  redo: () => void;
};

export const useHistory = create<State & Action>((set) => ({
  past: [],
  present: INIT_HISTORY_ITEM,
  future: [],
  addHistory: (value: HistoryItem) =>
    set((state: State) => {
      const newState = state;

      if (
        value.text === "" &&
        state.present.text === "" &&
        state.past.length === 0
      ) {
        return newState;
      }

      if (
        value.text === state.present.text &&
        value.mousePosition === state.present.mousePosition
      ) {
        return newState;
      }

      if (state.present) {
        newState.past = [...state.past, state.present];
      }
      newState.present = value;
      newState.future = [];
      return newState;
    }),
  undo: (value: HistoryItem) =>
    set((state: State) => {
      const newState = state;
      if (state.past.length === 0 && !state.present) {
        return newState;
      }
      if (state.past.length === 0 && state.present) {
        newState.past = [INIT_HISTORY_ITEM];
      }
      if (
        value.text !== state.present.text ||
        value.mousePosition !== state.present.mousePosition
      ) {
        newState.future = [value, ...state.future];
      } else {
        newState.future = [state.present, ...state.future];
      }
      newState.present = state.past[state.past.length - 1];
      newState.past = state.past.slice(0, state.past.length - 1);
      console.log(newState);
      return newState;
    }),
  redo: () =>
    set((state: State) => {
      const newState = state;
      if (state.future.length === 0) {
        return newState;
      }
      newState.past = [...state.past, state.present];
      newState.present = state.future[0];
      newState.future = state.future.slice(1, state.future.length);
      console.log(newState);
      return newState;
    }),
}));
