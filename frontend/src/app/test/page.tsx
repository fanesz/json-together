"use client";

import useDebounce from "@/hooks/useDebounce";
import useUndoRedo from "@/hooks/useUndoRedo";
import useJsonFormat from "@/hooks/useJsonFormat";

const Page = () => {
  const [text, mouseFocus, handleSetText, handleInput, textareaRef, setFocus] = useJsonFormat();
  const debouncedText = useDebounce(text, 1000);
  const handleUndoRedo = useUndoRedo({
    text: text,
    debouncedText: debouncedText,
    setText: handleSetText,
    mouseFocus: mouseFocus,
    setFocus: setFocus,
  });

  const generateLineNumbers = () => {
    return Array.from(
      { length: text.split("\n").length },
      (_, index) => index + 1,
    );
  };

  return (
    <div>
      <div className="flex">
        <div className="w-6 text-end pe-1 text-md">
          {generateLineNumbers().map((lineNumber) => (
            <div key={lineNumber}>{lineNumber}</div>
          ))}
        </div>
        <div className="w-full h-screen">
          <textarea
            className="w-full text-md ps-1 h-full"
            spellCheck="false"
            value={text}
            ref={textareaRef}
            onChange={handleInput}
            onKeyDown={handleUndoRedo}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
