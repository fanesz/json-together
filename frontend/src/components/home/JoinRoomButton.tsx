"use client";

import { useRouter } from "next/navigation";
import Button from "../_shared/Button";
import { useState } from "react";

interface props {
  className?: string;
}
const JoinRoomButton = (props: props) => {
  const { className } = props;
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = async () => {
    router.push("/room/" + roomCode);
  };

  const handleSetRoomCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  return (
    <div className={`${className}`}>
      <input
        className="text-black"
        type="text"
        placeholder="Enter a Room Code"
        value={roomCode}
        onChange={handleSetRoomCode}
      />
      <Button onClick={handleJoinRoom}>Join</Button>
    </div>
  );
};

export default JoinRoomButton;
