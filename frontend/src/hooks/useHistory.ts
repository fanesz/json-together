'use client';

import { InputHistory } from "@/type";
import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useState } from "react";
import { useUndoRedo } from "../store/history";

interface Props {
  value: string;
}
const useHistory = (props: Props): any => {
  const { value } = props;
  const { addHistory, undo, redo, present } = useUndoRedo();

  useEffect(() => {
    console.log("saving to history...");
    addHistory(value);
  }, [value]);

  const handleUndoRedo = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const keyPressed = e.key;
    const isCTRLPressed = e.ctrlKey;

    if (isCTRLPressed && keyPressed === 'z') {
      e.preventDefault();
      undo();
    } else if (isCTRLPressed && keyPressed === 'y') {
      e.preventDefault();
      redo();
    }

  }

  return handleUndoRedo;
}

export default useHistory