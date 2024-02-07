"use client";

import { useRouter } from "next/navigation";
import Button from "../_shared/Button";
import RoomServices from "@/api/services/room";
import { getLocalStorage } from "@/utils/LocalStorage";

interface props {
  className?: string;
}
const CreateRoomButton = (props: props) => {
  const { className } = props;
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
    <div className={`${className}`}>
      <Button onClick={handleCreateRoom}>Create</Button>
    </div>
  );
};

export default CreateRoomButton;
