import React, { useMemo, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input } from "react-native-elements";

import { LoginScreenNavigationProps } from "../../navigation/welcome/types";
import { getPasswordErrorMessage, getEmailErrorMessage, inputStyles } from "./utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem, NavigationText, BasicButtonText,
  BasicButton, BasicSafeAreaView, ContentGroup, ScrollViewContent,
} from "../../components/styled";
import {
  InputLabel, InputGroup, PasswordIcon, PasswordInput, PasswordIconTooltip,
} from "./styled";
import { UserServiceInstance } from "../../services/user";

const showPasswordIcon = "../../assets/images/general/show.png";
const hidePasswordIcon = "../../assets/images/general/hide.png";

type WithNavigatorScreen = {
  navigation: LoginScreenNavigationProps;
}

export const LoginScreen = ({navigation}: WithNavigatorScreen) => {
  const [email, setEmail] = useState<string|null>(null);
  const [password, setPassword] = useState<string|null>(null);

  const emailErrorMessage = useMemo(() => email === null ? "" : getEmailErrorMessage(email), [email]);
  const passwordErrorMessage = useMemo(() => password === null ? "" : getPasswordErrorMessage(password), [password]);

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

  const onSubmit = async () => {
    if (email && password){
      UserServiceInstance.login(email, password);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return !email || !password || !!emailErrorMessage || !!passwordErrorMessage;
  }, [email, password, passwordErrorMessage, emailErrorMessage]);

  const [type, setType] = useState("password");

  const onChangeType = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  }

  return (
    <BasicSafeAreaView>
      <PageWrapper justifyContent="space-around">

        <NavigationBar>
          <LeftItem onPress={() => navigation.navigate("Welcome")}>
            <BackButtonIcon />
          </LeftItem>
          <CenterItem>
            <NavigationText>Login</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <BandwwithTextLogo width="50%" />

        <ScrollViewContent justifyContent={"space-around"}>
          <KeyboardAwareScrollView>
            <InputGroup>
              <InputLabel>Your gmail is required for login</InputLabel>
              <Input
                onChangeText={(value: string) => setEmail(value)}
                placeholder="ENTER YOUR EMAIL"
                autoCorrect={false}
                errorMessage={emailErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>Your password it's your safety</InputLabel>
              <PasswordInput>
                <Input
                  secureTextEntry={(type === "password" ? true : false)}
                  onChangeText={(value: string) => setPassword(value)}
                  placeholder="ENTER YOUR PASSWORD"
                  textContentType="oneTimeCode"
                  errorMessage={passwordErrorMessage}
                  inputStyle={inputStyles.inputText}
                  containerStyle={inputStyles.inputContainer}
                />
                <PasswordIconTooltip onPress={onChangeType}>
                  {
                    (type === "password") ? (
                      <PasswordIcon source={require(showPasswordIcon)} />
                    ) : (
                      <PasswordIcon source={require(hidePasswordIcon)} />
                    )
                  }
                </PasswordIconTooltip>
              </PasswordInput>
            </InputGroup>

            <ContentGroup>
              <BasicButton
                width="100%"
                disabled={isSubmitDisabled}
                onPress={onSubmit}
              >
                <BasicButtonText>LOGIN</BasicButtonText>
              </BasicButton>

              <BasicButton
                width="100%"
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <BasicButtonText>FORGOT PASSWORD</BasicButtonText>
              </BasicButton>
            </ContentGroup>
          </KeyboardAwareScrollView>
        </ScrollViewContent>
      </PageWrapper>
    </BasicSafeAreaView>
  );
};
