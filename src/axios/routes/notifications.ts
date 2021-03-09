import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import { BasicResponse, CheckNotificationsRequest, DeleteNotificationRequest, GetNotificationListResponse, Notification } from "../../shared/interfaces";
import { API } from "../../shared/routes";

export const getNotificationListRequest = async (): Promise<Array<Notification>> => {
  try {
    const response = await instance.get<GetNotificationListResponse>(API.NOTIFICATIONS);

    return response.data.notifications.reverse();
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const removeNotificationRequest = async (
  request: DeleteNotificationRequest,
): Promise<boolean> => {
  try {
    const response = await instance.delete<BasicResponse>(`${API.NOTIFICATIONS}/${request.notification_id}`);

    return !!response.data?.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const checkNotificationsRequest = async (
  request: CheckNotificationsRequest,
): Promise<boolean> => {
  try {
    const response = await instance.post<BasicResponse>(`${API.CHECK_NOTIFICATIONS}`, request);

    return !!response.data?.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};
