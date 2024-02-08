export type APIResponse<T = void> = {
  data: {
    status_code: number;
    message: string;
    data: T;
  } | null;
};

export type WebsocketAction = "create" | "join";

export type WebsocketData = {
  room_id: string;
  activity: string;
  body: string;
};

export type WebsocketResponse = MessageEvent<string>;

export type InputHistory = {
  currentPos: number;
  value: string[];
}