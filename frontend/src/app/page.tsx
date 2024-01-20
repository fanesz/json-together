'use client';

import { connect, sendMsg } from '@/api';
import { ChangeEvent, useEffect, useState } from 'react';


export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  useEffect(() => {
    // connect((msg: any) => {
    //   console.log('Received Message:', JSON.parse(msg.data));
    //   setChatHistory((prev) => [...prev, JSON.parse(msg.data).body]);
    // });
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const handleSend = () => {
    sendMsg(input);
  };

  return (
    <main>

      <input value={input} onChange={handleInput} />
      <button onClick={handleSend}>send</button>

      <div>chat:
        {chatHistory?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>


    </main>
  );
}
