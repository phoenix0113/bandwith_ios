import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
} from "react-native";

import {RegistrationScreenNavigationProps} from "../../navigation/welcome/types";

type WithNavigatorScreen = {
  navigation: RegistrationScreenNavigationProps;
}

export const RegistrationScreen = ({navigation}: WithNavigatorScreen) => (
  <SafeAreaView>
    <View>
      <Text>Registration</Text>
      <Button title="Back" onPress={() => navigation.navigate("Welcome")}/>
      <Button title="Login" onPress={() => navigation.navigate("Login")}/>
    </View>
  </SafeAreaView>
);
