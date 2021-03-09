import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import { CreateContactRequest, RemoveContactRequest, GetContactListResponse, ContactItem, BasicResponse } from "../../shared/interfaces";
import { API } from "../../shared/routes";

export const getContactListRequest = async (): Promise<Array<ContactItem>> => {
  try {
    const response = await instance.get<GetContactListResponse>(API.USER_CONTACTS);

    return response.data.contacts;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const addUserToContactListRequest = async (request: CreateContactRequest): Promise<boolean> => {
  try {
    const response = await instance.post<BasicResponse>(API.USER_CONTACTS, request);

    return !!response.data.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const removeUserFromContactListRequest = async (
  request: RemoveContactRequest,
): Promise<boolean> => {
  try {
    const response = await instance.delete<BasicResponse>(`${API.USER_CONTACTS}/${request.contactPerson}`);

    return !!response.data.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};
