import {
  APIResponse,
  WebsocketData,
  WebsocketResponse,
} from "@/type";
import API from "..";
import { setParam } from "@/utils";

export default class WebsocketServices {
  private isBrowser: boolean;
  private socket: WebSocket | null;
  private baseURL: string;
  private roomID: string | undefined;
  private basePath: string = "/ws";
  private api: API = new API();

  constructor() {
    this.isBrowser = typeof window !== "undefined";
    this.socket = null;
    this.baseURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL + "/api/ws" || "";
  }

  async create(roomCode: string) {
    const targetPath =
      this.basePath + "/create" + setParam([["room_code", roomCode]]);
    const res: APIResponse = await this.api.GET(targetPath);
    return res.data;
  }

  setRoomID(roomID: string) {
    this.roomID = roomID;
  }

  connect(callback: (msg: WebsocketData) => void) {
    try {
      if (this.isBrowser) {
        this.socket = new WebSocket(
          `${this.baseURL}/join?room_code=${this.roomID}`,
        );

        this.socket.onopen = () => {
          console.log("Successfully Connected");
        };

        this.socket.onmessage = (msg: WebsocketResponse) => {
          callback(JSON.parse(msg.data));
        };

        this.socket.onclose = (event) => {
          console.log("Socket Closed Connection: ", event);
        };

        this.socket.onerror = (error) => {
          console.error("Socket Error: ", error);
        };
      }
    } catch (error) {
      console.error("Error creating WebSocket:", error);
    }
  }

  send(msg: string) {
    console.log("sending msg: ", msg);
    if (this.socket) {
      this.socket.send(msg);
    }
  }
}
