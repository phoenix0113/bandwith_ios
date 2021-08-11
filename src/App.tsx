import "react-native-gesture-handler";
import React, { useContext, useEffect, useMemo } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { configure } from "mobx";
import "react-native-get-random-values";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { navigationRef } from "./navigation/helper";
import { WelcomeNavigation } from "./navigation/welcome";
import { SharedScreen } from "./screens/shared";
import { SERVER_BASE_URL } from "./utils/constants";
import { COLORS, SpinnerOverlayText } from "./components/styled";

/**
 * Initializing all the necessary services
 */
import { AppServiceContext } from "./services/app";
import { UserServiceInstance } from "./services/user";
import { APNServiceContext } from "./services/APNs";
import { SharedStorageContext } from "./services/shared";
import "./services/contacts";
import "./services/notifications";
import "./services/socket";
import "./services/media";
import "./services/outgoingCall";
import "./services/incomingCall";
import "./services/logger";

configure({ enforceActions: "never" });
let servicesInitialized = false;

import { WelcomeScreenNavigationProps } from "./navigation/welcome/types";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

const MainApp = createStackNavigator({
  Share: {
    screen: SharedScreen,
    navigationOptions: {
      headerTitle: 'Shared'
    },
    path: 'shared/:id'
  },
})

const AppContainer = createAppContainer(MainApp);

const App = observer(({ navigation }: WithNavigatorScreen) => {
  const { incomingCallData } = useContext(APNServiceContext);

  const { netAccessible, netConnected } = useContext(AppServiceContext);

  useEffect(() => {
    if (!servicesInitialized && netAccessible === true && netConnected === true) {
      console.log("> Initializing core services...");
      UserServiceInstance.init();
      servicesInitialized = true;
    }
  }, [netAccessible, netConnected]);

  const spinnerText = useMemo(() => {
    if (incomingCallData) {
      return "Proceeding to the call...";
    }
    if (netAccessible === false || netConnected === false) {
      return "You're offline. Check your connection.";
    }
    return null;
  }, [incomingCallData, netAccessible, netConnected]);

  const prefix = "app.bandwwith.com://";

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
        animation="fade"
       />

      {/* <AppContainer uriPrefix={prefix}> */}
        <NavigationContainer ref={navigationRef}>
          <WelcomeNavigation />
        </NavigationContainer>
      {/* </AppContainer> */}
    </SafeAreaProvider>
  );
});

export default App;
