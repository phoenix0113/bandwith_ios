import { makeObservable, observable, reaction } from "mobx";
import md5 from "md5";
import AsyncStorage from "@react-native-community/async-storage";
import { createContext } from "react";
import { CloudClient } from "avcore/client";
import { Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

import { CloudCredentials, UserProfileResponse } from "../shared/interfaces";
import {
  loginRequest, registerRequest, userProfileRequest, avcoreCredentialsRequest,
  authWithGoogleRequest, sendSMSRequest, verifyCodeRequest, updatePhoneRequest,
} from "../axios/routes/user";
import { setBearerToken, clearBearerToken } from "../axios/instance";
import { navigateToScreen } from "../navigation/helper";
import { WelcomeScreensEnum } from "../navigation/welcome/types";
import { MainScreensEnum } from "../navigation/main/types";
import { TOKEN_STORAGE_KEY, GOOGLE_CLIENT_ID } from "../utils/constants";
import { AppServiceInstance } from "./app";
import { showNetworkErrorAlert, showUnexpectedErrorAlert } from "../utils/notifications";

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: false,
});

class UserService {
  @observable profile: UserProfileResponse = null;

  @observable token: string = null;

  public cloud: CloudCredentials = null;

  @observable avcoreCloudClient: CloudClient = null;

  private onReconnectActions: Array<Function> = [];

  constructor () {
    makeObservable(this);

    reaction(
      () => this.token && this.profile,
      () => {
        if (this.token && this.profile) {
          console.log(this.profile);
          if (this.profile.phone && this.profile.verified) {
            navigateToScreen(WelcomeScreensEnum.Main);
          } else {
            navigateToScreen(WelcomeScreensEnum.PhoneSetup);
          }
          this.initializeAvcoreCloudClient();
        } else {
          navigateToScreen("Welcome");
        }
      }
    );

    reaction(
      () => AppServiceInstance.canReconnect,
      (canReconnect) => {
         if (this.onReconnectActions.length && canReconnect) {

          this.onReconnectActions.forEach((func) => {
            func();
          });
          this.onReconnectActions = [];
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
      if (!AppServiceInstance.netAccessible) {
        this.scheduleActions(this.fetchUserData);
      } else {
        showUnexpectedErrorAlert("fetchUserData()", err.message);
      }
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
      if (!AppServiceInstance.netAccessible) {
        showNetworkErrorAlert();
      } else {
        showUnexpectedErrorAlert("login()", err.message);
      }
    }
  }

  public authWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      const { token } = await authWithGoogleRequest({ tokenId: idToken, isIos: true });

      console.log(`> Google Auth token ${token}`);

      this.token = token;
      this.saveTokenToStotage(token);
      setBearerToken(token);
      this.fetchUserData();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Google Authentication", "Process Cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Google Authentication", "Process in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google Authentication", "Play services are not available");
      } else {
        Alert.alert("Google Authentication", `Unexpected error: ${error.toString()}`);
      }
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
      if (AppServiceInstance.hasNetworkProblems()) {
        showNetworkErrorAlert();
      } else {
        showUnexpectedErrorAlert("register()", err.message);
      }
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
      if (AppServiceInstance.hasNetworkProblems()) {
        this.scheduleActions(this.initializeAvcoreCloudClient);
      } else {
        showUnexpectedErrorAlert("initializeAvcoreCloudClient()", err.message);
      }
    }
  }

  public sendVerificationSMS = async (phone: string): Promise<boolean> => {
    try {
      const response = await sendSMSRequest({ phone });
      if (response.success){
        return true;
      } else {
        Alert.alert(response.error);
      }
    } catch (err) {
      showUnexpectedErrorAlert("sendVerificationSMS()", err.message);
      return false;
    }
  }

  public verifySMSCode = async (code: string, phone: string): Promise<void> => {
    try {
      if (await verifyCodeRequest({ code, phone })) {
        console.log("> Code was accepted. Updating user profile");
        this.updatePhoneNumber(phone);
      } else {
        Alert.alert("Verification Error", "Verification code is wrong or expired");
      }
    } catch (err) {
      showUnexpectedErrorAlert("verifySMSCode()", err.message);
    }
  }

  public updatePhoneNumber = async (phone: string): Promise<void> => {
    try {
      const updatedProfile = await updatePhoneRequest({ phone });
      console.log("> Updated user profile: ", updatedProfile);
      this.profile = updatedProfile;
    } catch (err) {
      showUnexpectedErrorAlert("verifySMSCode()", err.message);
    }
  }

  @observable phoneEditMode = false;

  public editPhone = () => {
    navigateToScreen(WelcomeScreensEnum.PhoneSetup);
    this.phoneEditMode = true;
  }

  public cancelPhoneEditing = () => {
    this.phoneEditMode = false;
    navigateToScreen(MainScreensEnum.Profile);
  }

  private scheduleActions = (action: Function) => {
    this.onReconnectActions.push(action);
  }
}

export const UserServiceInstance = new UserService();

export const UserServiceContext = createContext(UserServiceInstance);
