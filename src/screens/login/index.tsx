import React, { useState } from "react";
import { SafeAreaView, Button } from "react-native";
import { Input } from "react-native-elements";
import {LoginScreenNavigationProps} from "../../navigation/welcome/types";
import {emailErrorMessage, passwordErrorMessage} from "./utils";

type WithNavigatorScreen = {
  navigation: LoginScreenNavigationProps;
}

export const LoginScreen = ({navigation}: WithNavigatorScreen) => {
  const [email, setEmail] = useState<string|null>(null);
  const [password, setPassword] = useState<string>("");

  return (
    <SafeAreaView>
      <Input
        onChangeText={(value: string) => setEmail(value)}
        placeholder="Email"
        errorMessage={email === null ? "" : emailErrorMessage(email)}
      />
      <Input
        secureTextEntry={true}
        onChangeText={(value: string) => setPassword(value)}
        placeholder="Password"
        errorMessage={passwordErrorMessage(password)}
      />
      <Button title="Back" onPress={() => navigation.navigate("Welcome")}/>
      <Button title="Registration" onPress={() => navigation.navigate("Registration")}/>
      <Button title="Main" onPress={() => navigation.navigate("Main")}/>
    </SafeAreaView>
  );
};
