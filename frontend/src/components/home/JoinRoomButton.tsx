"use client";

import { useRouter } from "next/navigation";
import Button from "../_shared/Button";
import { useState } from "react";

const JoinRoomButton = () => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = async () => {
    router.push("/room/" + roomCode);
  };

  const handleSetRoomCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  return (
    <div>
      <input
        className="text-black"
        value={roomCode}
        onChange={handleSetRoomCode}
      />
      <Button onClick={handleJoinRoom}>Join Room</Button>
    </div>
  );
};

export default JoinRoomButton;
