'use client';

import useDebounce from "@/hooks/useDebounce";
import useHistory from "@/hooks/useHistory";
import useJsonFormat from "@/hooks/useJsonFormat";
import { InputHistory } from "@/type";
import { useEffect, useState } from "react";

const Page = () => {
  const [text, handleInput, textareaRef] = useJsonFormat();
  // const [history, setHistory] = useState<InputHistory>({
  //   currentPos: 0,
  //   value: [""], 
  // });

  const debouncedValue = useDebounce(text, 1000);
  const handleUndoRedo = useHistory({ value: debouncedValue });

  const generateLineNumbers = () => {
    return Array.from({ length: text.split("\n").length }, (_, index) => index + 1);
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
