import { makeObservable, observable, reaction, runInAction } from "mobx";
import md5 from "md5";
import AsyncStorage from "@react-native-community/async-storage";
import { createContext } from "react";
import { CloudClient } from "avcore/client";
import { Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

import { CloudCredentials, UserProfileResponse, GetRecordResponse } from "../shared/interfaces";
import {
  loginRequest, registerRequest, userProfileRequest, avcoreCredentialsRequest, resetPasswordRequest,
  authWithGoogleRequest, sendSMSRequest, verifyCodeRequest, updatePhoneRequest, getVerifyCodeRequest,
  getUserDataByID, authWithAppleRequest,
} from "../axios/routes/user";
import { getRecordingsByUserID } from "../axios/routes/feed";
import { setBearerToken, clearBearerToken } from "../axios/instance";
import { navigateToScreen } from "../navigation/helper";
import { WelcomeScreensEnum } from "../navigation/welcome/types";
import { MainScreensEnum } from "../navigation/main/types";
import {
  TOKEN_STORAGE_KEY, GOOGLE_CLIENT_ID, SMS_PHONE, SMS_REQUEST_ID,COUNTRY_CODE, VERIFY_CODE, VERIFY_STATUS,
  EMAIL, RESET_PASSWORD_STATUS, FETCH_USER_DATA_ERROR, EMAIL_PASSWORD_INCORRECT_ERROR, EMAIL_INCORRECT_ERROR,
  RESET_PASSWORD_ERROR, EMAIL_EXIST_ERROR, INITIALIZE_AVCOR_ERROR, VERIFY_SMS_ERROR, VERIFY_SMS_CODE_ERROR,
  PHONE_NUMBER_UPDATE_ERROR, LOADING_PROFILE_RECORDINGS_ERROR,
} from "../utils/constants";
import { AppServiceInstance } from "./app";
import { showNetworkErrorAlert, showUnexpectedErrorAlert, showGeneralErrorAlert } from "../utils/notifications";

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: false,
});

interface SmsRequest {
  phone: string;
  requestId: string;
  countryCode: string;
}

class UserService {
  @observable profile: UserProfileResponse = null;

  @observable currentProfileRecording: GetRecordResponse = null;
  
  @observable profileRecordings: Array<GetRecordResponse> = [];

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
          this.checkPhoneVerificationProcess();
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

  @observable previouslySetPhone: string = null;
  @observable previouslySetCountryCode: string = null;

  // check if already set up the phone number and sent verification code
  private checkPhoneVerificationProcess = async () => {
    const { requestId, phone, countryCode } = await this.getSMSRequestFromStorage();


    if (phone && requestId && countryCode) {
      runInAction(() => {
        this.previouslySetPhone = phone;
        this.previouslySetCountryCode = countryCode;
        this.nexmoRequestId = requestId;
        if (this.profile.verified && this.profile.phone) {
          this.phoneEditMode = true;
          navigateToScreen(WelcomeScreensEnum.PhoneSetup);
        }
      });
    }
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
      this.loadProfileRecordings(this.profile._id);
      console.log("> Fetched user profile:", this.profile.name);
    } catch (err) {
      if (!AppServiceInstance.netAccessible) {
        this.scheduleActions(this.fetchUserData);
      } else {
        console.log(err.message);
        showGeneralErrorAlert(FETCH_USER_DATA_ERROR);
      }
    }
  }

  public login = async (email: string, password: string) => {
    try {
      const { token } = await loginRequest({
        email: email.toLowerCase(),
        password: md5(password),
        role: "user",
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
        console.log(err.message);
        showGeneralErrorAlert(EMAIL_PASSWORD_INCORRECT_ERROR);
      }
    }
  }

  public forgotPassword = async (email:string) => {
    try {
      const { code } = await getVerifyCodeRequest({
        email: email.toLowerCase(),
        role: "user",
      });

      console.log(`> Forgot Password Request sent`);
      this.saveVerifyCodeToStorage(code);
      this.saveEmailToStorage(email.toLowerCase());
      navigateToScreen("VerifyCode");

    } catch (err) {
      if (!AppServiceInstance.netAccessible) {
        showNetworkErrorAlert();
      } else {
        console.log(err.message);
        showGeneralErrorAlert(EMAIL_INCORRECT_ERROR);
      }
    }
  }

  private saveEmailToStorage = async (email: string) => {
    try {
      await AsyncStorage.setItem(EMAIL, email);
      console.log(`> Email was saved: ${email.substring(0, 10)}`);
    } catch (err) {
      console.error(`>> save verify code error: ${err.message}`);
    }
  }

  private saveVerifyCodeToStorage = async (code:string) => {
    try {
      let verify_code = md5(code);
      await AsyncStorage.setItem(VERIFY_CODE, verify_code);
      console.log(`> Verify code was saved: ${verify_code.substring(0, 10)}`);
    } catch (err) {
      console.error(`>> save verify code error: ${err.message}`);
    }
  }

  public verifyCode = async (code:string) => {
    await AsyncStorage.setItem(VERIFY_STATUS, "VERIFY_STATUS");
    try {
      const storageCode = await AsyncStorage.getItem(VERIFY_CODE);
      if(md5(code) === storageCode) {
        console.log(`> Verify code was success: ${storageCode.substring(0, 10)}`);
        navigateToScreen("ResetPassword");
      } else {
        await AsyncStorage.setItem(VERIFY_STATUS, "Your verify code not match now. Please check your email again.");
        console.log(`> Verify code was failed: ${storageCode.substring(0, 10)}`);
        navigateToScreen("VerifyCode");
      }
    } catch (err) {
      console.error(`>> Verify code error: ${err.message}`);
    }
    
  }

  public resetPassword = async (password: string) => {
    await AsyncStorage.setItem(VERIFY_STATUS, "VERIFY_STATUS");
    await AsyncStorage.setItem(RESET_PASSWORD_STATUS, "RESET_PASSWORD_STATUS");
    try {
      const email = await AsyncStorage.getItem(EMAIL);
      const { code } = await resetPasswordRequest({
        email: email.toLowerCase(),
        password: md5(password),
        role: "user",
      });

      if (code === "200") {
        console.log(`> Reset Password was success`, code);
        navigateToScreen("Login");
      } else {
        await AsyncStorage.setItem(RESET_PASSWORD_STATUS, "Reset password was failed. Please again.");
        console.log(`> Reset Password was failed`, code);
        navigateToScreen("ResetPassword");
      }
    } catch (err) {
      if (!AppServiceInstance.netAccessible) {
        showNetworkErrorAlert();
      } else {
        console.log(err.message);
        showGeneralErrorAlert(RESET_PASSWORD_ERROR);
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

  public authWithApple = async (user: string, email: string) => {
    try {
      const { token } = await authWithAppleRequest({
        user: user,
        email: email.toLowerCase(),
        password: "unset",
      });

      console.log(`> Apple Auth token ${token}`);

      this.token = token;
      this.saveTokenToStotage(token);
      setBearerToken(this.token);
      this.fetchUserData();
    } catch (err) {
      if (AppServiceInstance.hasNetworkProblems()) {
        showNetworkErrorAlert();
      } else {
        console.log(err.message);
        showGeneralErrorAlert(EMAIL_EXIST_ERROR);
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
      setBearerToken(token);
      this.fetchUserData();
    } catch (err) {
      if (AppServiceInstance.hasNetworkProblems()) {
        showNetworkErrorAlert();
      } else {
        console.log(err.message);
        showGeneralErrorAlert(EMAIL_EXIST_ERROR);
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
        console.log(err.message);
        showGeneralErrorAlert(INITIALIZE_AVCOR_ERROR);
      }
    }
  }

  private nexmoRequestId: string = null;

  public sendVerificationSMS = async (phone: string, countryCode: string): Promise<boolean> => {
    try {
      const { requestId } = await this.getSMSRequestFromStorage();
      const response = await sendSMSRequest({ phone, request_id: requestId });

      if (response.success){
        this.nexmoRequestId = response.request_id;
        this.saveSMSRequestToStorage(response.request_id, phone, countryCode);
        return true;
      } else {
        Alert.alert(response.error);
      }
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(VERIFY_SMS_ERROR);
      return false;
    }
  }

  public verifySMSCode = async (code: string, phone: string, countryCode: string): Promise<void> => {
    try {
      const response = await verifyCodeRequest({ code, request_id: this.nexmoRequestId });
      if (response.success) {
        console.log("> Code was accepted. Updating user profile");
        this.nexmoRequestId = null;
        this.removeSMSRequestFromStorage();
        this.previouslySetPhone = null;

        this.updatePhoneNumber(phone, countryCode);
      } else {
        Alert.alert("Verification Error", response.error);
      }
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(VERIFY_SMS_CODE_ERROR);
    }
  }

  public updatePhoneNumber = async (phone: string, countryCode: string): Promise<void> => {
    try {
      const updatedProfile = await updatePhoneRequest({ phone, countryCode });
      console.log("> Updated user profile: ", updatedProfile);
      this.profile = updatedProfile;
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(PHONE_NUMBER_UPDATE_ERROR);
    }
  }

  private saveSMSRequestToStorage = async (requestId: string, phone: string, countryCode: string) => {
    try {
      await AsyncStorage.setItem(SMS_REQUEST_ID, requestId);
      await AsyncStorage.setItem(SMS_PHONE, phone);
      await AsyncStorage.setItem(COUNTRY_CODE, countryCode);
      console.log(`> RequestId was saved: ${requestId.substring(0, 10)}`);
    } catch (err) {
      console.error(`>> saveTokenToStorage() error: ${err.message}`);
    }
  }

  private removeSMSRequestFromStorage = async () => {
    try {
      await AsyncStorage.removeItem(SMS_REQUEST_ID);
      await AsyncStorage.removeItem(SMS_PHONE);
      await AsyncStorage.removeItem(COUNTRY_CODE);
      console.log("> RequestId was removed from the storage");
    } catch (err) {
      console.error(`>> removeTokenFromStorage() error: ${err.message}`);
    }
  }

  private getSMSRequestFromStorage = async (): Promise<SmsRequest> => {
    try {
      const requestId = await AsyncStorage.getItem(SMS_REQUEST_ID);
      const phone = await AsyncStorage.getItem(SMS_PHONE);
      const countryCode = await AsyncStorage.getItem(COUNTRY_CODE);

      if (phone && requestId && countryCode) {
        console.log(`> Found requestId for phone ${phone} (${countryCode}): ${requestId.substring(0, 10)}`);
        return {
          requestId,
          phone,
          countryCode,
        };
      } else {
        console.log("> Didn't find any SMS request or phone number");
        return {
          requestId: null,
          phone: null,
          countryCode: null,
        };
      }

    } catch (err) {
      console.error(`>> getRequestFromStorage() error: ${err.message}`);
    }
  }

  @observable phoneEditMode = false;

  public editPhone = () => {
    navigateToScreen(WelcomeScreensEnum.PhoneSetup);
    this.phoneEditMode = true;
  }

  public cancelPhoneEditing = () => {
    this.phoneEditMode = false;
    this.nexmoRequestId = null;
    this.removeSMSRequestFromStorage();
    navigateToScreen(MainScreensEnum.Profile);
  }

  @observable profileEditMode = false;

  public editProfile = () => {
    navigateToScreen(WelcomeScreensEnum.EditProfile);
    this.profileEditMode = true;
  }

  public cancelEditProfile = () => {
    this.profileEditMode = false;
    this.nexmoRequestId = null;
    this.removeSMSRequestFromStorage();
    navigateToScreen(MainScreensEnum.Profile);
  }

  private scheduleActions = (action: Function) => {
    this.onReconnectActions.push(action);
  }

  @observable profileUser: UserProfileResponse = null;

  public getUserData = async (id: string) => {
    try {
      this.profileUser = await getUserDataByID(id);
      console.log("> Get user data by ID: ", this.profileUser._id);
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(FETCH_USER_DATA_ERROR);
    }
  }

  public loadProfileRecordings = async (id: string) => {
    try {
      const { recordings } = await getRecordingsByUserID(id);

      this.profileRecordings = [];
      runInAction(() => {
        this.profileRecordings.push(...recordings);
      });
      if (this.currentProfileRecording === null) {
        this.currentProfileRecording = this.profileRecordings[0];
      }

      console.log(">  Profile Recordings", this.profileRecordings);

    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(LOADING_PROFILE_RECORDINGS_ERROR);
    }
  }

  public setCurrentProfileRecording = async (id: string) => {
    this.profileRecordings.forEach((recording) => {
      if (recording?._id === id) {
        this.currentProfileRecording = recording;
      }
    });
    console.log(">  Current Filter Recording ", id);
  }

}

export const UserServiceInstance = new UserService();

export const UserServiceContext = createContext(UserServiceInstance);
