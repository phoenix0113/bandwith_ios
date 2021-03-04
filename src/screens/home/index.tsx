import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
} from "react-native";

import {UserServiceInstance} from "../../services/user";

export const HomeScreen = () => (
  <SafeAreaView>
    <View>
      <Text>Home</Text>
      <Button title="Logout" onPress={() => UserServiceInstance.logout()} />
    </View>
  </SafeAreaView>
);
