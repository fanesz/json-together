import { APIResponse } from "@/type";
import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

type Headers = {
  Accept: string;
  "Content-type": string;
};

export default class API {
  headers: Headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
      headers: this.headers as unknown as AxiosHeaders,
    } as AxiosRequestConfig);

    // this.api.interceptors.response.use(
    //   this.handleSuccessResponse,
    //   this.handleErrorResponse
    // );

    // this.api.interceptors.request.use((config) => {
    //   config.validateStatus = status => status < 500;
    //   return config;
    // });
  }

  // handleSuccessResponse<T>(response: AxiosResponse<APIResponse<T>>): AxiosResponse<APIResponse<T>> {
  //   return response;
  // }

  // handleErrorResponse<T>(error: any): Promise<APIResponse<T>> {
  //   if (axios.isAxiosError(error)) {
  //     const response = error.response;
  //     if (response && (response.status === 400 || response.status === 500)) {
  //       return Promise.reject(response.data);
  //     }
  //   }
  //   return Promise.reject(error.response || error);
  // }

  async GET<T>(path: string): Promise<APIResponse<T>> {
    try {
      const res = await this.api.get(path);
      return res;
    } catch (err) {
      return { data: null };
    }
  }

  POST<T>(path: string, data: any): Promise<APIResponse<T>> {
    return this.api.post(path, data);
  }

  PUT<T>(path: string, data: any): Promise<APIResponse<T>> {
    return this.api.put(path, data);
  }

  DELETE<T>(path: string): Promise<APIResponse<T>> {
    return this.api.delete(path);
  }
}
