import React, { useMemo, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { Input } from "react-native-elements";

import { LoginScreenNavigationProps } from "../../navigation/welcome/types";
import { getPasswordErrorMessage, inputStyles } from "./utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem, NavigationText, BasicButtonText, BasicButton, BasicSafeAreaView, ContentGroup, ScrollViewContent,
} from "../../components/styled";
import { InputLabel, InputGroup } from "./styled";
import { UserServiceInstance } from "../../services/user";

type WithNavigatorScreen = {
  navigation: LoginScreenNavigationProps;
}

export const ResetPasswordScreen = ({navigation}: WithNavigatorScreen) => {
  const [password, setPassword] = useState<string|null>(null);

  const passwordErrorMessage = useMemo(() => password === null ? "" : getPasswordErrorMessage(password), [password]);

  const onSubmit = async () => {
    if (password){
      UserServiceInstance.resetPassword(password);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return !password || !!passwordErrorMessage;
  }, [password, passwordErrorMessage]);

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

  return (
    <BasicSafeAreaView>
      <PageWrapper justifyContent="space-around">

        <NavigationBar>
          <LeftItem onPress={() => navigation.navigate("Welcome")}>
            <BackButtonIcon />
          </LeftItem>
          <CenterItem>
            <NavigationText>Reset Your Password</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <BandwwithTextLogo width="50%" />

        <ScrollViewContent justifyContent="space-around">
          <ContentGroup>
            <InputGroup>
              <InputLabel>Please input your new password</InputLabel>
              <Input
                onChangeText={(value: string) => setPassword(value)}
                placeholder="ENTER NEW PASSWORD"
                autoCorrect={false}
                errorMessage={passwordErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <BasicButton
              width="100%"
              disabled={isSubmitDisabled}
              onPress={onSubmit}
            >
              <BasicButtonText>SUBMIT</BasicButtonText>
            </BasicButton>
          </ContentGroup>
        </ScrollViewContent>
      </PageWrapper>
    </BasicSafeAreaView>
  );
};
