import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { observer } from "mobx-react";

import { WelcomeStackParamList } from "./types";

import { WelcomeScreen } from "../../screens/welcome";
import { LoginScreen } from "../../screens/login";
import { RegistrationScreen } from "../../screens/registration";
import { MainNavigation } from "../main";
import { IncomingCallScreen } from "../../screens/incomingCall";
import { OutgoingCallScreen } from "../../screens/outgoingCall";
import { PhoneSetupScreen } from "../../screens/phoneSetup";
import { ForgotPasswordScreen } from "../../screens/forgotPassword";
import { VerifyCodeScreen } from "../../screens/verifyCode";
import { ResetPasswordScreen } from "../../screens/resetPassword";
import { EditProfileScreen } from "../../screens/editProfile";
import { SharedScreen } from "../../screens/shared";

import { UserServiceContext } from "../../services/user";

const WelcomeStack = createStackNavigator<WelcomeStackParamList>();

export const WelcomeNavigation = observer(() => {
  const {token} = useContext(UserServiceContext);

  return (
    <WelcomeStack.Navigator
      headerMode="none"
      initialRouteName={token ? "Main" : "Welcome"}
      screenOptions={{gestureEnabled: false}}
    >
      <WelcomeStack.Screen name="Welcome" component={WelcomeScreen}/>
      <WelcomeStack.Screen name="Login" component={LoginScreen}/>
      <WelcomeStack.Screen name="Registration" component={RegistrationScreen}/>
      <WelcomeStack.Screen name="Main" component={MainNavigation} />
      <WelcomeStack.Screen name="PhoneSetup" component={PhoneSetupScreen} />
      <WelcomeStack.Screen name="IncomingCall" component={IncomingCallScreen} />
      <WelcomeStack.Screen name="OutgoingCall" component={OutgoingCallScreen} />
      <WelcomeStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <WelcomeStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <WelcomeStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <WelcomeStack.Screen name="EditProfile" component={EditProfileScreen} />
      <WelcomeStack.Screen name="Shared" component={SharedScreen} />
    </WelcomeStack.Navigator>
  );
});
