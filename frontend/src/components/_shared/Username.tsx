"use client";

import UserServices from "@/api/services/user";
import { getLocalStorage, setLocalStorage } from "@/utils/LocalStorage";
import { useEffect, useState } from "react";

const user = new UserServices();

const Username = () => {
  const [username, setUsername] = useState("");

  const registerUser = async () => {
    const res = await user.register();
    if (res) {
      setLocalStorage("user_id", res.data.user_id);
    } else {
      console.log("Error registering user");
    }
  };

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
    <div>
      name:
      <input
        className="text-black"
        onChange={handleSetUsername}
        value={username}
      />
    </div>
  );
};

export default Username;
