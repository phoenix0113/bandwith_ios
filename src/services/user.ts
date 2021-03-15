import { makeObservable, observable, reaction } from "mobx";
import md5 from "md5";
import AsyncStorage from "@react-native-community/async-storage";
import { createContext } from "react";
import { CloudClient } from "avcore/client";
import { Alert } from "react-native";

import { CloudCredentials, UserProfileResponse } from "../shared/interfaces";
import { loginRequest, registerRequest, userProfileRequest, avcoreCredentialsRequest } from "../axios/routes/user";
import { setBearerToken, clearBearerToken } from "../axios/instance";
import { navigateToScreen } from "../navigation/helper";
import { TOKEN_STORAGE_KEY } from "../utils/constants";


class UserService {
  @observable profile: UserProfileResponse = null;

  @observable token: string = null;

  public cloud: CloudCredentials = null;

  @observable avcoreCloudClient: CloudClient = null;

  constructor () {
    makeObservable(this);

    reaction(
      () => this.token,
      () => {
        if (this.token) {
          navigateToScreen("Main");
          this.initializeAvcoreCloudClient();
        } else {
          navigateToScreen("Welcome");
        }
      }
    );
  }

  public init = async () => {
    await this.getTokenFromStorage();
    if (this.token) {
      setBearerToken(this.token);
      this.fetchUserData();
    }
  }

  private fetchUserData = async () => {
    try {
      // empty string in place of firebaseToken is just for compatibility
      this.profile = await userProfileRequest({firebaseToken: ""});
      console.log("> Fetched user profile:", this.profile.name);
    } catch (err) {
      console.error(`>> FetchUserData error: ${err.message}`);
    }
  }

  public login = async (email: string, password: string) => {
    try {
      const { token } = await loginRequest({
        email: email.toLowerCase(),
        password: md5(password),
      });

      console.log(`> Login token ${token}`);

      this.token = token;
      this.saveTokenToStotage(token);
      setBearerToken(token);
      this.fetchUserData();
    } catch (err) {
      console.error(`>> Login error: ${err.message}`);
    }
  }


  public register = async (email: string, password: string, username: string) => {
    try {
      const { token } = await registerRequest({
        email: email.toLowerCase(),
        password: md5(password),
        name: username,
      });

      console.log(`> Registration token ${token}`);

      if (!token) {
        navigateToScreen("Login");
        return;
      }

      this.token = token;
      this.saveTokenToStotage(token);
      setBearerToken(this.token);
    } catch (err) {
      console.error(`>> Register error: ${err.message}`);
    }
  }

  public logout = () => {
    this.token = null;
    this.profile = null;
    this.removeTokenFromStorage();
    clearBearerToken();
  }

  private saveTokenToStotage = async (token: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      console.log(`> Token was saved: ${token.substring(0, 10)}`);
    } catch (err) {
      console.error(`>> saveToken error: ${err.message}`);
    }
  }

  private removeTokenFromStorage = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      console.log("> Token was removed");
    } catch (err) {
      console.error(`>> RemoveToken error: ${err.message}`);
    }
  }

  private getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        this.token = token;
        console.log(`> Token was retrieved ${token.substring(0, 10)}`);
      } else {
        console.log("> No token found");
      }
    } catch (err) {
      console.error(`>> GetToken error: ${err.message}`);
    }
  }

  private initializeAvcoreCloudClient = async () => {
    try {
      if (!this.cloud && !this.avcoreCloudClient) {
        this.cloud = await avcoreCredentialsRequest();

        this.avcoreCloudClient = new CloudClient(this.cloud.url, this.cloud.token);
        console.log("> Avcore CloudClient has been initialized");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Notification", err.message);
    }
  }
}

export const UserServiceInstance = new UserService();

export const UserServiceContext = createContext(UserServiceInstance);
