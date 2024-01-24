import API from "..";

type User = {
  user_id: string;
};

export default class UserServices {
  private basePath: string = "/users";
  private api: API = new API();

  async register() {
    const targetPath = this.basePath;
    const res = await this.api.GET<User>(targetPath);
    return res.data;
  }
}
