import {makeObservable, observable} from "mobx";
import md5 from "md5";
import AsyncStorage from "@react-native-community/async-storage";

import { UserProfileResponse } from "../shared/interfaces";

import {loginRequest, registerRequest, userProfileRequest} from "../axios/routes/user";
import {setBearerToken, clearBearerToken} from "../axios/instance";
import { createContext } from "react";

const TOKEN_STORAGE_KEY = "TOKEN";

class UserService {
  @observable profile: UserProfileResponse = null;

  @observable token: string = null;

  constructor () {
    makeObservable(this);
  }

  init = async () => {
    await this.getToken();
    if (this.token) {
      setBearerToken(this.token);
      this.fetchUserData();
    }
  }

  fetchUserData = async () => {
    // empty string in place of firebaseToken is just for compatibility
    this.profile = await userProfileRequest({firebaseToken: ""});
    console.log("> fetched user profile:", this.profile);
  }

  login = async (email: string, password: string) => {
    try {
        const { token } = await loginRequest({
          email: email.toLowerCase(),
          password: md5(password),
        });

        this.saveToken(token);
        setBearerToken(this.token);
        this.fetchUserData();
    } catch (err) {
      console.error(err.message);
    }
  }


  register = async (email: string, password: string, username: string) => {
    try {
      const { token } = await registerRequest({
        email: email.toLowerCase(),
        password: md5(password),
        name: username,
      });

      this.saveToken(token);
      setBearerToken(this.token);
    } catch (err) {
      console.error(err.message);
    }
  }

  logout = () => {
    this.removeToken();
    clearBearerToken();
  }

  saveToken = async (token: string) => {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    console.log(`> Token was saved: ${token.substring(0, 10)}`);
  }

  removeToken = async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log("> Token was removed");
  }

  getToken = async () => {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    console.log(`> Token was retrieved ${token.substring(0, 10)}`);
    this.token = token;
  }
}

export const UserServiceInstance = new UserService();

export const UserServiceContext = createContext(UserServiceInstance);
