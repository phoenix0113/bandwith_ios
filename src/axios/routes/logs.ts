import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import { BasicResponse, LogOnServerRequest, SendLogsRequest } from "../../shared/interfaces";
import { API } from "../../shared/routes";

export const sendLogsRequest = async (request: SendLogsRequest): Promise<boolean> => {
  try {
    const response = await instance.post<BasicResponse>(API.SEND_LOGS, request);

    return response.data.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const logOnServerRequest = async (request: LogOnServerRequest): Promise<boolean> => {
  try {
    const response = await instance.post<BasicResponse>(API.LOG_ON_SERVER, request);

    return response.data.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};
