import { APIResponse } from "@/type";
import API from "..";
import { setParam } from "@/utils";

type UpdateData = {
  user_id: string;
};

type Room = {
  room: {
    room_id: string;
    temp_room_id: string;
    user_id: string;
    User: {
      user_id: string;
      CreatedAt: string;
      UpdatedAt: string;
    };
    data: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
};

type CreateResult = {
  room_id: string;
};

type RefreshCodeResult = {
  temp_room_id: string;
};

export default class RoomServices {
  basePath: string = "/rooms";
  private api: API = new API();

  async create(userID: string) {
    if (!userID) {
      throw new Error("userID is required");
    }
    const targetPath = this.basePath;
    const res: APIResponse<CreateResult> = await this.api.POST(targetPath, {
      user_id: userID,
    });
    console.log(res);

    return res.data;
  }

  async get(roomID: string) {
    const targetPath = this.basePath + setParam([["room_id", roomID]]);
    const res: APIResponse<Room> = await this.api.GET(targetPath);
    return res.data;
  }

  async update(roomID: string, data: UpdateData) {
    const targetPath = this.basePath + setParam([["room_id", roomID]]);
    const res: APIResponse<Room> = await this.api.PUT(targetPath, {
      data: data,
    });
    return res.data;
  }

  async delete(roomID: string) {
    const targetPath = this.basePath + setParam([["room_id", roomID]]);
    const res: APIResponse<null> = await this.api.DELETE(targetPath);
    return res.data;
  }

  async refreshCode(roomID: string) {
    const targetPath =
      this.basePath + "/refresh" + setParam([["room_id", roomID]]);
    const res: APIResponse<RefreshCodeResult> = await this.api.GET(targetPath);
    return res.data;
  }
}
