import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
} from "react-native";

import {WelcomeScreenNavigationProps} from "../../navigation/welcome/types";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

export const WelcomeScreen = ({navigation}: WithNavigatorScreen) => (
  <SafeAreaView>
    <View>
      <Text>Welcome</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")}/>
      <Button title="Registration" onPress={() => navigation.navigate("Registration")}/>
    </View>
  </SafeAreaView>
);

