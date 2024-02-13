'use client';

import { useRef, useState } from "react";

type ElelementDiff = {
  index: number;
  line: number;
  value: string;
  prev: string;
  next: string;
}

type SetTextAction = "ADD" | "DELETE" | "SKIP"

function append(array: string[], index: number, value: string): string[] {
  return array.slice(0, index).concat(value).concat(array.slice(index));
}

function totalTabInSentences(str: string): number {
  let tabCount = 0;
  for (let char of str.split('')) {
    if (char === '\t') {
      tabCount++;
    } else {
      break;
    }
  }
  return tabCount;
}

function getElementDiff(oldText: string[], newText: string[], currentFocus: number): ElelementDiff {
  const oldTextArr = [...oldText];
  const newTextArr = [...newText];
  const result = { index: -1, line: 0, value: '', prev: '', next: '' };

  if (oldTextArr.length - newTextArr.length === 1) {
    result.index = currentFocus;
    result.value = oldText[currentFocus];
    result.line = (oldText.slice(0, currentFocus).join('').match(/\n/g) || []).length;
    result.next = newTextArr[currentFocus] || '';

  } else if (currentFocus) {
    result.index = currentFocus - 1;
    result.value = newTextArr[currentFocus - 1]
    result.line = (newTextArr.slice(0, currentFocus).join('').match(/\n/g) || []).length;

  } else {
    for (let i = 0; i < newTextArr.length; i++) {
      if (newTextArr[i] !== oldTextArr[i]) {
        result.index = i;
        result.value = newTextArr[i];
        break;
      }
      if (newTextArr[i] === '\n') {
        result.line += 1;
      }
    }
  }

  if (result.index > 0) {
    result.prev = newTextArr[result.index - 1];
  }

  if (result.index < newTextArr.length - 1 && result.next === '') {
    result.next = oldTextArr[result.index] || '';
  }

  result.line = result.index == -1 ? -1 : result.line;

  return result;
}

const useJsonFormat = (): [string, any, any] => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const setFocus = (pos: number) => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos, pos);
      }
    }, 0);
  };


  const handleSetText = (text: string, focusToSet: number, action: SetTextAction) => {
    if (action === 'ADD' || action === 'DELETE') {
      setText(text);
    }
    focusToSet !== -1 && setFocus(focusToSet);
    // text !== null && setHistory(prev => [...prev, text]);
  };

  const handleInput = (e: any) => {
    let inputText = e.target.value;
    let newText = inputText.split('');
    let newTextPerLine = inputText.split('\n');
    let oldText = text.split('');
    let oldTextPerLine = text.split('\n');
    let currentFocus = textareaRef?.current?.selectionStart || 0;

    const elementDiff = getElementDiff(oldText, newText, currentFocus);

    // detect added one element
    if (elementDiff.index !== -1 && (newText.length - oldText.length === 1)) {
      const pairedChar = {
        '{': '}',
        '[': ']',
        '"': '"',
        "'": "'"
      };

      // passing the char if the input value == the next char
      if (Object.values(pairedChar).indexOf(elementDiff.value) !== -1 && elementDiff.next === elementDiff.value) {
        console.log("[passing the char if the input value == the next char]");
        handleSetText('', elementDiff.index + 1, "SKIP");
        return;
      }

      // auto close paired char
      const charToAppend = pairedChar[elementDiff.value as keyof typeof pairedChar];
      if (charToAppend !== undefined) {
        console.log("[auto close paired char]");
        handleSetText(
          append(newText, elementDiff.index + 1, charToAppend).join(''),
          elementDiff.index + 1,
          "ADD"
        );
        return;
      }

      // auto tab system for new line
      if (elementDiff.value === '\n') {
        console.log("[auto tab system for new line]");
        // if the previous line is an object or array
        if (
          (
            newTextPerLine[elementDiff.line - 1].includes('{') &&
            newTextPerLine[elementDiff.line - 1].indexOf('}') < newTextPerLine[elementDiff.line - 1].indexOf('{')
          ) || (
            newTextPerLine[elementDiff.line - 1].includes('[') &&
            newTextPerLine[elementDiff.line - 1].indexOf(']') < newTextPerLine[elementDiff.line - 1].indexOf('[')
          )
        ) {
          const totalTabInLine = totalTabInSentences(newTextPerLine[elementDiff.line - 1]);
          handleSetText(
            append(
              newText,
              elementDiff.index + 1,
              '\t'.repeat(totalTabInLine == 0 ? 1 : totalTabInLine + 1) + '\n' + '\t'.repeat(totalTabInLine)
            ).join(''),
            elementDiff.index + totalTabInLine + 2,
            "ADD"
          );
          return;
        }

        // if the previous line contains tab
        if (
          elementDiff.line > 0 &&
          newTextPerLine[elementDiff.line - 1].includes('\t')
        ) {
          const totalTabInLine = totalTabInSentences(oldTextPerLine[elementDiff.line - 1]);
          handleSetText(
            append(newText, elementDiff.index + 1, '\t'.repeat(totalTabInLine)).join(''),
            elementDiff.index + totalTabInLine + 1,
            "ADD"
          );
          return;
        }
      }

    }

    // detect added multiple elements
    if (newText.length - oldText.length > 1) {
      console.log('[added multiple elements]');
      handleSetText(newText.join(''), -1, "ADD");
      return;
    }

    // detect deleted one element
    if (elementDiff.index !== -1 && (oldText.length - newText.length === 1)) {
      console.log('[deleted]');

      const autoDelChar = {
        '{': '}',
        '[': ']',
        '"': '"',
        "'": "'"
      };

      const charToDel = autoDelChar[elementDiff.value as keyof typeof autoDelChar];

      if (
        charToDel &&
        elementDiff.next === charToDel
      ) {
        handleSetText(
          newText.slice(0, elementDiff.index).concat(newText.slice(elementDiff.index + 1)).join(''),
          elementDiff.index,
          'DELETE'
        )
        return;
      }
    }

    // detect deleted multiple elements
    if (oldText.length - newText.length > 1) {
      console.log('[deleted multiple elements]');
      handleSetText(newText.join(''), -1, 'DELETE');
      return;
    }

    // normal input
    handleSetText(inputText, -1, 'ADD');

    // setText(prev => (prev = newText.join('')));
    // focusToSet !== -1 && setFocus(focusToSet);
    // console.log('setting focus to:', focusToSet);
    // const prevScrollTop = textareaRef.current.scrollTop;
    // setTimeout(() => {
    //   console.log(textareaRef.current.scrollTop);
    //   textareaRef.current.scrollTop = prevScrollTop
    // }, 1);
  };




  return [text, handleInput, textareaRef]
}

export default useJsonFormat;