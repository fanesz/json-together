import CreateRoomButton from "@/components/home/CreateRoomButton";
import Username from "@/components/_shared/Username";
import JoinRoomButton from "@/components/home/JoinRoomButton";

export default function Home() {
  return (
    <main>
      <Username />
      <CreateRoomButton />
      <JoinRoomButton />
    </main>
  );
}
