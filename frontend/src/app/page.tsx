import CreateRoomButton from "@/components/home/CreateRoomButton";
import Button from "@/components/_shared/Button";
import JoinRoomButton from "@/components/home/JoinRoomButton";
import Username from "@/components/home/Username";

export default function Home() {
  return (
    <main className="border border-red-400 w-full max-w-6xl mx-auto flex">
      <div className="mx-auto border border-blue-500 text-center">
        <div className="text-2xl">
          JSON Together
        </div>
        <div>
          A tool for collaborating on JSON files
        </div>

        <div className="flex gap-2 mt-5 border">
          <div className="my-auto border border-purple-400">
            <JoinRoomButton className="mb-2" />
            <Username />
          </div>
          <div className="text-xs my-auto border border-yellow-400">
            OR
          </div>
          <div className="my-auto border border-green-400">
            <CreateRoomButton className="" />
          </div>
        </div>

      </div>
    </main>
  );
}
