import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {configure} from "mobx";

import { navigationRef } from "./navigation/helper";
import { WelcomeNavigation } from "./navigation/welcome";

import { UserServiceInstance } from "./services/user";
import "./services/contacts";
import "./services/socket";

configure({ enforceActions: "never" });
UserServiceInstance.init();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content"/>
      <NavigationContainer ref={navigationRef}>
        <WelcomeNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
