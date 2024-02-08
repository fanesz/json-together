'use client';

import { InputHistory } from "@/type";
import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useState } from "react";

interface Props {
  history: InputHistory;
  setHistory: Dispatch<SetStateAction<InputHistory>>;
  value: string;
}
const useHistory = (props: Props): any => {
  const { history, setHistory, value } = props;

  useEffect(() => {
    console.log("saving to history...");

    // saving / checking logic

    // example of how to save to history
    // setHistory({
    //   currentPos: history.currentPos + 1,
    //   value: [...history.value, value],
    // })

  }, [value]);

  const handleUndoRedo = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const keyPressed = e.key;
    const isCTRLPressed = e.ctrlKey;

    if (isCTRLPressed && keyPressed === 'z') {
      e.preventDefault();
      // undo
    } else if (isCTRLPressed && keyPressed === 'y') {
      e.preventDefault();
      // redo
    }

  }

  return handleUndoRedo;
}

export default useHistory