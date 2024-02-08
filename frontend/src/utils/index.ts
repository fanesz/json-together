import UserServices from "@/api/services/user";
import { setLocalStorage } from "./LocalStorage";

export const setParam = (paramList: string[][]) => {
  let params = "";
  for (let i = 0; i < paramList.length; i++) {
    if (paramList[i][1] === "") continue;
    params += `${i === 0 ? "?" : "&"}${paramList[i][0]}=${paramList[i][1]}`;
  }
  return params;
};

const user = new UserServices();
export const registerUser = async () => {
  const res = await user.register();
  if (res) {
    setLocalStorage("user_id", res.data.user_id);
  } else {
    console.log("Error registering user");
  }
};