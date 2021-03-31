import "react-native-gesture-handler";
import React, { useContext, useMemo } from "react";
import { StatusBar } from "react-native";
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
import { UserServiceInstance } from "./services/user";
import { APNServiceContext } from "./services/APNs";
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

const App = observer(() => {
  const { incomingCallData } = useContext(APNServiceContext);

  const visible = useMemo(() => !!incomingCallData, [incomingCallData]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content"/>

      <Spinner
        visible={visible}
        textContent={"Proceeding to the call..."}
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
