import { IAxiosErrorResponse } from "./interfaces";

export const createUrlNotFoundError = (
  response :IAxiosErrorResponse,
): string => `[${response.config.method}] ${response.config.baseURL}${response.config.url} not found`;

export const createUnexpectedError = (
  response: IAxiosErrorResponse,
): string => `Unexpected error from the server: ${response.data?.error || response.data}`;

export const createUnauthorizedError = (
  response: IAxiosErrorResponse,
): string => `You have to provide token to make ${response.config.method} request to ${response.config.baseURL}${response.config.url}`;

export const createForbiddenError = (
  response: IAxiosErrorResponse,
): string => `You have no rights to access ${response.config.baseURL}${response.config.url}`;

export const getError = (response: IAxiosErrorResponse): string => {
  if (!response?.status) {
    return "Unexpected error";
  }
  switch (response.status) {
    case 401:
      return createUnauthorizedError(response);
    case 403:
      return createForbiddenError(response);
    case 404:
      return createUrlNotFoundError(response);
    case 400:
    case 409:
    case 457:
      return response.data.error || (response.data as unknown) as string;
    default:
      return createUnexpectedError(response);
  }
};
