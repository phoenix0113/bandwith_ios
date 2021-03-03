import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { navigationRef } from "./navigation/helper";
import { WelcomeNavigation } from "./navigation/welcome";

console.log("> Reload log tracker");

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
