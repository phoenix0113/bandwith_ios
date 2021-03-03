import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { WelcomeStackParamList } from "./types";

import { WelcomeScreen } from "../../screens/welcome";
import { LoginScreen } from "../../screens/login";
import { RegistrationScreen } from "../../screens/registration";
import { MainNavigation } from "../main";

const WelcomeStack = createStackNavigator<WelcomeStackParamList>();

export const WelcomeNavigation = () => (
  <WelcomeStack.Navigator>
    <WelcomeStack.Screen name="Welcome" component={WelcomeScreen}/>
    <WelcomeStack.Screen name="Login" component={LoginScreen}/>
    <WelcomeStack.Screen name="Registration" component={RegistrationScreen}/>
    <WelcomeStack.Screen name="Main" component={MainNavigation} />
  </WelcomeStack.Navigator>
);
