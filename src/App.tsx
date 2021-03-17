import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {configure} from "mobx";
import "react-native-get-random-values";

import { navigationRef } from "./navigation/helper";
import { WelcomeNavigation } from "./navigation/welcome";

/**
 * Initializing all the necessary services
 */
import { UserServiceInstance } from "./services/user";
import "./services/contacts";
import "./services/notifications";
import "./services/socket";
import "./services/media";
import "./services/outgoingCall";
import "./services/incomingCall";
import "./services/logger";
import "./services/app";

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
