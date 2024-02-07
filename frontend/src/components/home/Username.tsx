"use client";

import { registerUser } from "@/utils";
import { getLocalStorage, setLocalStorage } from "@/utils/LocalStorage";
import { useEffect, useState } from "react";

const Username = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(getLocalStorage("username") || "Guest");
    if (!getLocalStorage("user_id")) {
      registerUser();
    }
  }, []);

  const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalStorage("username", e.target.value);
    setUsername(e.target.value);
  };

  return (
    <div className="flex gap-2">
      <div>Join as</div>
      <input
        className="text-black"
        onChange={handleSetUsername}
        value={username}
      />
    </div>
  );
};

export default Username;
