import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { navigationRef } from "./navigation/helper";
import { WelcomeNavigation } from "./navigation/welcome";

console.log("> Reload log tracker");

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content"/>
      <NavigationContainer ref={navigationRef}>
        <WelcomeNavigation />
      </NavigationContainer>
    </>
  );
};

export default App;
