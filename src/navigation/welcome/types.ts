import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";

export type WelcomeStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
  Main: undefined;
  IncomingCall: undefined;
  OutgoingCall: undefined;
  PhoneSetup: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  ResetPassword: undefined;
  EditProfile: undefined;
  Shared: { id: string };
};

export enum WelcomeScreensEnum {
  Welcome="Welcome",
  Login="Login",
  Registration="Registration",
  Main="Main",
  IncomingCall="IncomingCall",
  OutgoingCall="OutgoingCall",
  PhoneSetup="PhoneSetup",
  ForgotPassword="ForgotPassword",
  VerifyCode="VerifyCode",
  ResetPassword="ResetPassword",
  EditProfile="EditProfile",
  Shared="Shared",
}

export type WelcomeScreenNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "Welcome"
>;

export type LoginScreenNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "Login"
>;

export type RegistrationScreenNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "Registration"
>;

export type MainNavigationNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "Main"
>;

export type IncomingCallScreenNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "IncomingCall"
>;

export type OutgoingCallScreenNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "OutgoingCall"
>;

export type PhoneSetupScreenNavigationProps = StackNavigationProp<
  WelcomeStackParamList,
  "PhoneSetup"
>;

type SharedScreenRouteProp = RouteProp<WelcomeStackParamList, "Shared">;

type ProfileScreenNavigationProp = StackNavigationProp<
  WelcomeStackParamList,
  "Shared"
>;

export type SharedScreenProps = {
  route: SharedScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};
