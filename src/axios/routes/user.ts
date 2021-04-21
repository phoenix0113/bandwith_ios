import { instance } from "../instance";
import { IAxiosError } from "../interfaces";
import { getError } from "../utils";

import {
  AuthResponse, LoginRequest, AvcoreAuthResponse, CloudCredentials,
  OAuthGoogleRequest, RegistrationRequest, UserProfileRequest, UserProfileResponse,
  SetReadHintRequest, SetReadHintResponse, SendSMSRequest, BasicResponse, VerifyCodeRequest,
  UpdatePhoneRequest,
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

export const avcoreCredentialsRequest = async (): Promise<CloudCredentials> => {
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

interface SendSMSResponse {
  success: boolean;
  error?: string;
}

export const sendSMSRequest = async (request: SendSMSRequest): Promise<SendSMSResponse> => {
  try {
    const response = await instance.post<BasicResponse>(API.SEND_SMS, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    if (response.status === 409) {
      return {
        success: false,
        error: "This phone is alrady in use",
      };
    }
    throw new Error(getError(response));
  }
};

export const verifyCodeRequest = async (request: VerifyCodeRequest): Promise<boolean> => {
  try {
    const response = await instance.post<BasicResponse>(API.VERIFY_CODE, request);

    return !!response.data?.success;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};

export const updatePhoneRequest = async (request: UpdatePhoneRequest): Promise<UserProfileResponse> => {
  try {
    const response = await instance.post<UserProfileResponse>(API.UPDATE_PHONE, request);

    return response.data;
  } catch (err) {
    const { response } = err as IAxiosError;
    throw new Error(getError(response));
  }
};
