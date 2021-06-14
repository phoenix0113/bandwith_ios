import React, { useMemo, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { Input } from "react-native-elements";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { RegistrationScreenNavigationProps } from "../../navigation/welcome/types";
import { getPasswordErrorMessage, getEmailErrorMessage, inputStyles, getUsernameErrorMessage } from "../login/utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem, NavigationText, BasicButtonText, BasicButton, BasicSafeAreaView, ScrollViewContent
} from "../../components/styled";
import { InputLabel, InputGroup } from "./styled";
import { UserServiceInstance } from "../../services/user";

type WithNavigatorScreen = {
  navigation: RegistrationScreenNavigationProps;
}

export const RegistrationScreen = ({navigation}: WithNavigatorScreen) => {
  const [username, setUsername] = useState<string|null>(null);
  const [email, setEmail] = useState<string|null>(null);
  const [password, setPassword] = useState<string|null>(null);
  const [rPassword, setRPassword] = useState<string|null>(null);

  const usernameErrorMessage = useMemo(() => username === null ? "" : getUsernameErrorMessage(username), [username]);
  const emailErrorMessage = useMemo(() => email === null ? "" : getEmailErrorMessage(email), [email]);
  const passwordErrorMessage = useMemo(() => password === null ? "" : getPasswordErrorMessage(password), [password]);
  const rPasswordErrorMessage = useMemo(() => rPassword === null ? "" : getPasswordErrorMessage(password, rPassword), [rPassword]);

  const onSubmit = async () => {
    if (email && password && username) {
      UserServiceInstance.register(email, password, username);
    }
  };

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
  const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const isSubmitDisabled = useMemo(() => {
    return !username || !email || !password || !rPassword
      || !!usernameErrorMessage || !!emailErrorMessage || !!passwordErrorMessage || !!rPasswordErrorMessage;
  }, [username, email, password, rPassword, usernameErrorMessage, passwordErrorMessage, emailErrorMessage, rPasswordErrorMessage]);

  return (
    <BasicSafeAreaView>
      <PageWrapper justifyContent="space-around">
        <NavigationBar>
          <LeftItem onPress={() => navigation.navigate("Welcome")}>
            <BackButtonIcon />
          </LeftItem>
          <CenterItem>
            <NavigationText>Register</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <BandwwithTextLogo width="50%" />

        <ScrollViewContent justifyContent={"space-around"}>
          <KeyboardAwareScrollView>
            <InputGroup>
              <InputLabel style={{ marginTop: (keyboardStatus === "Keyboard Shown") ? 5 : 20, marginBottom: (keyboardStatus === "Keyboard Shown") ? 5 : 20 }}>Username it's your identity</InputLabel>
              <Input
                onChangeText={(value: string) => setUsername(value)}
                placeholder="ENTER YOUR USERNAME"
                autoCorrect={false}
                textContentType="oneTimeCode"
                errorMessage={usernameErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel style={{ marginTop: (keyboardStatus === "Keyboard Shown") ? 5 : 20, marginBottom: (keyboardStatus === "Keyboard Shown") ? 5 : 20 }}>Your gmail is required for login</InputLabel>
              <Input
                onChangeText={(value: string) => setEmail(value)}
                placeholder="ENTER YOUR EMAIL"
                autoCorrect={false}
                textContentType="oneTimeCode"
                errorMessage={emailErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel style={{ marginTop: (keyboardStatus === "Keyboard Shown") ? 5 : 20, marginBottom: (keyboardStatus === "Keyboard Shown") ? 5 : 20 }}>Your password it's your safety</InputLabel>
              <Input
                secureTextEntry={true}
                onChangeText={(value: string) => setPassword(value)}
                placeholder="ENTER YOUR PASSWORD"
                textContentType="oneTimeCode"
                errorMessage={passwordErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel style={{ marginTop: (keyboardStatus === "Keyboard Shown") ? 5 : 20, marginBottom: (keyboardStatus === "Keyboard Shown") ? 5 : 20 }}>Your password it's your safety</InputLabel>
              <Input
                secureTextEntry={true}
                onChangeText={(value: string) => setRPassword(value)}
                placeholder="REPEAT YOUR PASSWORD"
                textContentType="oneTimeCode"
                errorMessage={rPasswordErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <BasicButton
              width="100%"
              disabled={isSubmitDisabled}
              onPress={onSubmit}
            >
              <BasicButtonText>REGISTER</BasicButtonText>
            </BasicButton>
          </KeyboardAwareScrollView>
        </ScrollViewContent>
      </PageWrapper>
    </BasicSafeAreaView>
  );
};

