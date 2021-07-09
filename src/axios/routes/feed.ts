import { stringify } from "query-string";
import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import {
  GetAllRecordsQuery, PublishRecordingRequest, Document, GetAllRecordsResponse, GetRecordResponse, GetVerifyCodeResponse,
  ReportRequest, CheckRecordingNameRequest, GetAllRecordingID
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

export const getAllRecordingsList = async (): Promise<GetAllRecordingID> => {
  try {
    const response = await instance.post<GetAllRecordingID>(API.ALL_RECORD_IDS);
    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
}

export const publishRecording = async (
  request: PublishRecordingRequest,
): Promise<Document> => {
  try {
    const response = await instance.post<Document>(API.RECORD_PUBLISH, request);

    console.log("> Publish response: ", response.data);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const checkRecordingName = async (
  request: CheckRecordingNameRequest,
): Promise<GetVerifyCodeResponse> => {
  try {
    const response = await instance.post<GetVerifyCodeResponse>(API.CHECK_RECORD_NAME, request);

    console.log("> Check Recording Name Response: ", response.data);

    return response.data;
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
