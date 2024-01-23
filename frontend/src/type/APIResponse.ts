export type APIResponse<T> = {
  config: object;
  data: {
    status_code: number;
    message: string;
    data: T;
  };
  headers: object;
  request: object;
  status: number;
  statusText: string;
};
