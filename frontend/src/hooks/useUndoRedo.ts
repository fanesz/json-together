/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import { useHistory } from "../store/history";

type PrevAction =
  | "UNDO"
  | "REDO"
  | "ADD_BOUNCED"
  | "ADD_REALTIME"
  | "INIT"
  | "IDLE";

interface Props {
  text: string;
  debouncedText: string;
  setText: (text: string) => void;
  mouseFocus: number;
  setFocus: (pos: number) => void;
}
const useUndoRedo = (props: Props): any => {
  const { text, debouncedText, setText, mouseFocus, setFocus } = props;
  const { addHistory, undo, redo } = useHistory();
  const [prevAction, setPrevAction] = useState<PrevAction>("INIT");
  const currentText = useHistory((state) => state.present);

  useEffect(() => {
    if (prevAction === "UNDO" || prevAction === "REDO") {
      setText(currentText.text);
      setFocus(currentText.mousePosition);
      setTimeout(() => setPrevAction("IDLE"));
    }
  }, [currentText, setText]);

  useEffect(() => {
    if (prevAction === "ADD_REALTIME") {
      setPrevAction("ADD_BOUNCED");
      addHistory({ text: debouncedText, mousePosition: mouseFocus });
    }
  }, [debouncedText, addHistory]);

  useEffect(() => {
    if (prevAction !== "UNDO" && prevAction !== "REDO") {
      setPrevAction("ADD_REALTIME");
    }
  }, [text, setPrevAction]);

  const handleUndoRedo = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const keyPressed = e.key;
    const isCTRLPressed = e.ctrlKey;

    if (isCTRLPressed && keyPressed === "z") {
      e.preventDefault();
      setPrevAction("UNDO");
      undo({ text: text, mousePosition: mouseFocus });
    } else if (isCTRLPressed && keyPressed === "y") {
      e.preventDefault();
      setPrevAction("REDO");
      if (currentText.text !== text) {
        addHistory({ text: text, mousePosition: mouseFocus });
      } else {
        redo();
      }
    }
  };

  return handleUndoRedo;
};

export default useUndoRedo;
