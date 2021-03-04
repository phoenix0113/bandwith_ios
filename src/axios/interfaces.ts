interface ErrorData {
  error: string;
  success: boolean;
}

export interface IAxiosErrorResponse {
  status: number;
  data: ErrorData;
  config: {
    baseURL: string;
    method: string;
    url: string;
  }
}

export interface IAxiosError {
  response: IAxiosErrorResponse
}
