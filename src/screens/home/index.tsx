import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
} from "react-native";

import {navigateToScreen} from "../../navigation/helper";

export const HomeScreen = () => (
  <SafeAreaView>
    <View>
      <Text>Home</Text>
      <Button title="toWelcome" onPress={() => navigateToScreen("Welcome")} />
    </View>
  </SafeAreaView>
);
