import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import {
  AuthResponse, LoginRequest, AvcoreAuthResponse, CloudCredentials,
  OAuthGoogleRequest, RegistrationRequest, UserProfileRequest, UserProfileResponse,
  SetReadHintRequest, SetReadHintResponse,
} from "../../shared/interfaces";
import { API } from "../../shared/routes";

export const authWithGoogleRequest = async (request: OAuthGoogleRequest): Promise<AuthResponse> => {
  try {
    const response = await instance.post<AuthResponse>(API.OAUTH_GOOGLE, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const loginRequest = async (request: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await instance.post<AuthResponse>(API.LOGIN, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const registerRequest = async (request: RegistrationRequest): Promise<AuthResponse> => {
  try {
    const response = await instance.post<AuthResponse>(API.REGISTRATION, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const userProfileRequest = async (request: UserProfileRequest): Promise<UserProfileResponse> => {
  try {
    const response = await instance.post<UserProfileResponse>(API.USER_PROFILE, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const avcoreCredentialsRequst = async (): Promise<CloudCredentials> => {
  try {
    const response = await instance.get<AvcoreAuthResponse>(API.AVCORE_CREDS);

    return response.data.cloud;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const setReadHintRequest = async (request: SetReadHintRequest): Promise<SetReadHintResponse> => {
  try {
    const response = await instance.post<SetReadHintResponse>(API.USER_HINTS, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};
