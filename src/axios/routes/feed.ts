import { stringify } from "query-string";
import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import {
  GetAllRecordsQuery, PublishRecordingRequest, BasicResponse, GetAllRecordsResponse, GetRecordResponse, GetVerifyCodeResponse,
  ReportRequest, GetFilterRecordsQuery,
} from "../../shared/interfaces";
import { API } from "../../shared/routes";

export const getRecordingsList = async (
  query: GetAllRecordsQuery,
): Promise<GetAllRecordsResponse> => {
  const stringified = stringify(query);

  try {
    const response = await instance.post<GetAllRecordsResponse>(`${API.RECORD_AVAILABLE}?${stringified}`);
    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const publishRecording = async (
  request: PublishRecordingRequest,
): Promise<boolean> => {
  try {
    const response = await instance.post<BasicResponse>(API.RECORD_PUBLISH, request);

    console.log("> Publish response: ", response.data);

    return response.data.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const getRecordingById = async (id: string): Promise<GetRecordResponse> => {
  try {
    const response = await instance.get<GetRecordResponse>(`${API.RECORD}/${id}`);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const sendRecordingReport = async (request: ReportRequest): Promise<GetVerifyCodeResponse> => {
  try {
    const response = await instance.post<GetVerifyCodeResponse>(API.REPORT, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
}

export const getRecordingsByUserID = async (id: string): Promise<GetAllRecordsResponse> => {
  try {
    const response = await instance.post<GetAllRecordsResponse>(`${API.RECORD_FILTER}/${id}`);
    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};
