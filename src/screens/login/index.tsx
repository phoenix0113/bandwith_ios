import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
} from "react-native";

import {LoginScreenNavigationProps} from "../../navigation/welcome/types";

type WithNavigatorScreen = {
  navigation: LoginScreenNavigationProps;
}

export const LoginScreen = ({navigation}: WithNavigatorScreen) => (
  <SafeAreaView>
    <View>
      <Text>Login1</Text>
      <Button title="Back" onPress={() => navigation.navigate("Welcome")}/>
      <Button title="Registration" onPress={() => navigation.navigate("Registration")}/>
      <Button title="Main" onPress={() => navigation.navigate("Main")}/>
    </View>
  </SafeAreaView>
);
