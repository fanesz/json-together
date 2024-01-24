"use client";

import RoomServices from "@/api/services/room";
import WebsocketServices from "@/api/services/websocket";
import { WebsocketAction } from "@/type";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const websocket = new WebsocketServices();
const room = new RoomServices();

const Page = ({
  params,
}: {
  params: {
    action: WebsocketAction;
    id: string;
  };
}) => {
  const router = useRouter();

  useEffect(() => {
    if (params.action !== "create") {
      router.replace("/");
    }
    const createWSRoom = async () => {
      const WSRoom = await room.get(params.id);
      if (WSRoom?.status_code === 200) {
        const roomCode = WSRoom.data.room.temp_room_id;
        router.prefetch(`/room/${roomCode}`);
        const res = await websocket.create(roomCode);
        if (res?.status_code === 200) {
          router.replace(`/room/${roomCode}`);
        } else {
          router.replace("/");
        }
      } else {
        router.replace("/");
      }
    };
    createWSRoom();
  }, [params, router]);
};

export default Page;
