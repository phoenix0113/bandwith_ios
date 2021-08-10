import { stringify } from "query-string";
import { instance, shareinstance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import {
  GetAllRecordsQuery, PublishRecordingRequest, Document, GetAllRecordsResponse, GetRecordResponse, GetVerifyCodeResponse,
  ReportRequest, GetAllRecordingID, DeleteCallRecordingRequest, UpdateUserProfileRequest, UpdateRecordingResponse,
  CreateBlockRecordingRequest, BasicResponse,
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

export const deleteCallRecording = async (request: DeleteCallRecordingRequest): Promise<GetVerifyCodeResponse> => {
  try {
    const response = await instance.post<GetVerifyCodeResponse>(API.DELETE, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
}

export const updateUserProfile = async (request: UpdateUserProfileRequest): Promise<GetVerifyCodeResponse> => {
  try {
    const response = await instance.post<GetVerifyCodeResponse>(API.PROFILE_UPDATE, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
}

export const getSharedRecordingById = async (id: string): Promise<GetRecordResponse> => {
  try {
    const response = await shareinstance.get<GetRecordResponse>(`${API.SHARED}/${id}`);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const updateFeatured = async (request: CreateBlockRecordingRequest): Promise<BasicResponse> => {
  try {
    const response = await instance.post<BasicResponse>(API.UPDATE_FEATURED, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const checkFeatured = async (callrecordingID: string): Promise<UpdateRecordingResponse> => {
  try {
    const response = await instance.post<UpdateRecordingResponse>(`${API.CHECK_FEATURED}/${callrecordingID}`);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const getFeaturedStatus = async (request: CreateBlockRecordingRequest): Promise<BasicResponse> => {
  try {
    const response = await instance.post<BasicResponse>(API.GET_FEATURED, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const loadAvailableRecordings = async (
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
