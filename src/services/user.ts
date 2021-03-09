import { makeObservable, observable, reaction } from "mobx";
import md5 from "md5";
import AsyncStorage from "@react-native-community/async-storage";
import { createContext } from "react";
import { mediaDevices, MediaStream } from "react-native-webrtc";
import { CloudClient } from "avcore/client";
import { Alert } from "react-native";

import { CloudCredentials, UserProfileResponse } from "../shared/interfaces";

import { loginRequest, registerRequest, userProfileRequest, avcoreCredentialsRequest } from "../axios/routes/user";
import { setBearerToken, clearBearerToken } from "../axios/instance";

import { navigateToScreen } from "../navigation/helper";
import { API_OPERATION } from "avcore";

const TOKEN_STORAGE_KEY = "TOKEN";

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
      console.log("> fetched user profile:", this.profile.name);
    } catch (err) {
      console.error(`>> fetchUserData error: ${err.message}`);
    }
  }

  public login = async (email: string, password: string) => {
    try {
        const { token } = await loginRequest({
          email: email.toLowerCase(),
          password: md5(password),
        });

        console.log(`> login token ${token}`);

        this.token = token;
        this.saveTokenToStotage(token);
        setBearerToken(token);
        this.fetchUserData();
    } catch (err) {
      console.error(`>> login error: ${err.message}`);
    }
  }


  public register = async (email: string, password: string, username: string) => {
    try {
      const { token } = await registerRequest({
        email: email.toLowerCase(),
        password: md5(password),
        name: username,
      });

      console.log(`> registration token ${token}`);

      this.token = token;
      this.saveTokenToStotage(token);
      setBearerToken(this.token);
    } catch (err) {
      console.error(`>> register error: ${err.message}`);
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
      console.error(`>> removeToken error: ${err.message}`);
    }
  }

  private getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        this.token = token;
        console.log(`> Token was retrieved ${token.substring(0, 10)}`);
      } else {
        console.log("> Not token found");
      }
    } catch (err) {
      console.error(`>> getToken error: ${err.message}`);
    }
  }

  private initializeAvcoreCloudClient = async () => {
    try {
      if (!this.cloud && !this.avcoreCloudClient) {
        this.cloud = await avcoreCredentialsRequest();

        const stream = await this.createTestStream();
        console.log("Got stream", stream);

        this.avcoreCloudClient = new CloudClient(this.cloud.url, this.cloud.token);
        console.log(`Avcore CloudClient has been initialized with token: ${this.cloud.token} and url: ${this.cloud.url}`);

        console.log("creating capture");

        const capture = await this.avcoreCloudClient.create(
          API_OPERATION.PUBLISH,
          "stream1234",
          {
            kinds: ["audio", "video"],
            // @ts-ignore
            deviceHandlerName: "ReactNative",
          },
        );

        console.log("capture: ", capture);
        await capture.publish(stream).catch((err) => console.error(err));
        console.log("published");

        // const playback = await this.avcoreCloudClient.create(
        //   API_OPERATION.SUBSCRIBE,
        //   "stream1234",
        //   {
        //     kinds: ["audio", "video"],
        //     // @ts-ignore
        //     deviceHandlerName: "ReactNative",
        //   }
        // );

        // console.log(playback);

        // const incomingStrem = await playback.subscribe();
        // console.log(incomingStrem);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Notification", err.message);
    }
  }

  private createTestStream = async (): Promise<MediaStream> => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        // @ts-ignore
        video: {
          facingMode: "user",
          mandatory: {
            minWidth: 640,
            minHeight: 480,
            minFrameRate: 30,
          },
        },
      });
      return stream as MediaStream;
    } catch (err) {
      console.error(err);
    }
  }
}

export const UserServiceInstance = new UserService();

export const UserServiceContext = createContext(UserServiceInstance);
