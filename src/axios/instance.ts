import axios from "axios";
import { SERVER_BASE_URL } from "../utils/constants";

export const instance = axios.create({ baseURL: SERVER_BASE_URL });

export const setBearerToken = (token: string): void => {
  console.log(`> Bearer Token has been set to: ${token.slice(0, 10)}...`);
  instance.defaults.headers.common = { Authorization: `bearer ${token}` };
};

export const clearBearerToken = (): void => {
  instance.defaults.headers.common = null;
};
