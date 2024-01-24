"use client";

import { useRouter } from "next/navigation";
import Button from "../_shared/Button";
import RoomServices from "@/api/services/room";
import { getLocalStorage } from "@/utils/LocalStorage";

const CreateRoomButton = () => {
  const router = useRouter();
  const room = new RoomServices();

  const handleCreateRoom = async () => {
    const res = await room.create(getLocalStorage("user_id") || "");
    if (res?.status_code === 200) {
      router.push("/room/" + res.data.room_id + "/create", undefined);
    } else {
      console.log("Error creating room");
    }
  };

  return (
    <div>
      <Button onClick={handleCreateRoom}>Create Room</Button>
    </div>
  );
};

export default CreateRoomButton;
