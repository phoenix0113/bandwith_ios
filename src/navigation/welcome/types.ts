import { StackNavigationProp } from "@react-navigation/stack";

export type WelcomeStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
  Main: undefined;
};

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
