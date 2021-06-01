import { stringify } from "query-string";
import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import { GetAllCommentsQuery, GetAllCommentsResponse, GetAllRecordCommentsQuery } from "../../shared/interfaces";
import { API } from "../../shared/routes";

export const getCallCommentsList = async (
  query: GetAllCommentsQuery,
): Promise<GetAllCommentsResponse> => {
  const stringified = stringify(query);

  try {
    const response = await instance.get<GetAllCommentsResponse>(`${API.COMMENTS}?${stringified}`);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const getFeedCommentsList = async (
  query: GetAllRecordCommentsQuery,
): Promise<GetAllCommentsResponse> => {
  const stringified = stringify(query);

  try {
    const response = await instance.get<GetAllCommentsResponse>(`${API.RECORDING_COMMENTS}?${stringified}`);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const getComments = (
  id: string, limit: number, offset: number, isRecording: boolean,
): Promise<GetAllCommentsResponse> => {
  if (isRecording) {
    return getFeedCommentsList({
      recordId: id,
      limit,
      offset,
    });
  }
  return getCallCommentsList({
    callId: id,
    limit,
    offset,
  });
};
