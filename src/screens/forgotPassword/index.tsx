import React, { useMemo, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { Input } from "react-native-elements";

import { LoginScreenNavigationProps } from "../../navigation/welcome/types";
import { getEmailErrorMessage, inputStyles } from "./utils";

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

export const ForgotPasswordScreen = ({navigation}: WithNavigatorScreen) => {
  const [email, setEmail] = useState<string|null>(null);

  const emailErrorMessage = useMemo(() => email === null ? "" : getEmailErrorMessage(email), [email]);

  const onSubmit = async () => {
    if (email){
      UserServiceInstance.forgotPassword(email);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return !email || !!emailErrorMessage;
  }, [email, emailErrorMessage]);

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
            <NavigationText>Forgot Password</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <BandwwithTextLogo width="50%" />

        <ScrollViewContent justifyContent="space-around">
          <ContentGroup>
            <InputGroup>
              <InputLabel>Your gmail is required for reset password</InputLabel>
              <Input
                onChangeText={(value: string) => setEmail(value)}
                placeholder="ENTER YOUR EMAIL"
                autoCorrect={false}
                errorMessage={emailErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <BasicButton
              width="100%"
              disabled={isSubmitDisabled}
              onPress={onSubmit}
            >
              <BasicButtonText>SEND REQUEST</BasicButtonText>
            </BasicButton>
          </ContentGroup>
        </ScrollViewContent>
      </PageWrapper>
    </BasicSafeAreaView>
  );
};
