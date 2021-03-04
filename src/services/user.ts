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
    try {
      // empty string in place of firebaseToken is just for compatibility
      this.profile = await userProfileRequest({firebaseToken: ""});
      console.log("> fetched user profile:", this.profile);
    } catch (err) {
      console.error(`>> fetchUserData error: ${err.message}`);
    }
  }

  login = async (email: string, password: string) => {
    try {
        const { token } = await loginRequest({
          email: email.toLowerCase(),
          password: md5(password),
        });

        console.log(`> login token ${token}`);

        this.saveToken(token);
        setBearerToken(this.token);
        this.fetchUserData();
    } catch (err) {
      console.error(`>> login error: ${err.message}`);
    }
  }


  register = async (email: string, password: string, username: string) => {
    try {
      const { token } = await registerRequest({
        email: email.toLowerCase(),
        password: md5(password),
        name: username,
      });

      console.log(`> registration token ${token}`);

      this.saveToken(token);
      setBearerToken(this.token);
    } catch (err) {
      console.error(`>> register error: ${err.message}`);
    }
  }

  logout = () => {
    this.token = null;
    this.profile = null;
    this.removeToken();
    clearBearerToken();
  }

  saveToken = async (token: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      console.log(`> Token was saved: ${token.substring(0, 10)}`);
    } catch (err) {
      console.error(`>> saveToken error: ${err.message}`);
    }
  }

  removeToken = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      console.log("> Token was removed");
    } catch (err) {
      console.error(`>> removeToken error: ${err.message}`);
    }
  }

  getToken = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      console.log(`> Token was retrieved ${token.substring(0, 10)}`);
      this.token = token;
    } catch (err) {
      console.error(`>> getToken error: ${err.message}`);
    }
  }
}

export const UserServiceInstance = new UserService();

export const UserServiceContext = createContext(UserServiceInstance);
