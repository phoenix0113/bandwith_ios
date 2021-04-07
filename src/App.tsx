import "react-native-gesture-handler";
import React, { useContext, useEffect, useMemo } from "react";
import { Alert, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {configure} from "mobx";
import "react-native-get-random-values";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { navigationRef } from "./navigation/helper";
import { WelcomeNavigation } from "./navigation/welcome";
import { COLORS, SpinnerOverlayText } from "./components/styled";

/**
 * Initializing all the necessary services
 */
import { AppServiceContext } from "./services/app";
import { UserServiceInstance } from "./services/user";
import { APNServiceContext } from "./services/APNs";
import "./services/contacts";
import "./services/notifications";
import "./services/socket";
import "./services/media";
import "./services/outgoingCall";
import "./services/incomingCall";
import "./services/logger";

configure({ enforceActions: "never" });
let servicesInitialized = false;

const App = observer(() => {
  const { incomingCallData } = useContext(APNServiceContext);

  const { netAccessible, netConnected, netCurrentType, netOldType } = useContext(AppServiceContext);

  useEffect(() => {
    if (!servicesInitialized && netAccessible === true && netConnected === true) {
      console.log("> Initializing core services...");
      UserServiceInstance.init();
      servicesInitialized = true;
    }
  }, [netAccessible, netConnected]);

  useEffect(() => {
    // Alert.alert("Net", `Old: ${netOldType}. Current: ${netCurrentType}`);
  }, [netCurrentType]);

  const spinnerText = useMemo(() => {
    if (incomingCallData) {
      return "Proceeding to the call...";
    }
    if (netAccessible === false || netConnected === false) {
      return "You're offline. Check your connection.";
    }
    return null;
  }, [incomingCallData, netAccessible, netConnected]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content"/>

      <Spinner
        visible={!!spinnerText}
        textContent={spinnerText}
        textStyle={SpinnerOverlayText.text}
        size="large"
        color={COLORS.WHITE}
        overlayColor={COLORS.BLACK}
       />

      <NavigationContainer ref={navigationRef}>
        <WelcomeNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

export default App;
