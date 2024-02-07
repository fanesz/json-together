"use client";

import WebsocketServices from "@/api/services/websocket";
import { WebsocketData } from "@/type";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const websocket = new WebsocketServices();

const Page = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const [roomBody, setRoomBody] = useState("");
  const [activityHistory, setActivityHistory] = useState<string[]>([]);
  const [roomID, setRoomID] = useState("");
  const router = useRouter();

  useEffect(() => {
    const initWebsocket = async () => {
      websocket.setRoomID(params.id);
      setRoomID(params.id);
    };
    initWebsocket();
  }, [params, router]);

  useEffect(() => {
    websocket?.connect((msg: WebsocketData) => {
      if (msg.body) {
        setRoomBody(msg.body);
      } else {
        setActivityHistory((prev) => [...prev, msg.activity]);
      }
    });
  }, [params]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    websocket?.send(e.target.value);
  };

  return (
    <div>
      roomID: {roomID}
      <div>
        <textarea
          className="w-full text-black"
          value={roomBody}
          onChange={handleInput}
        />
      </div>
      <div>
        <div>activity:</div>
        {activityHistory.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default Page;
