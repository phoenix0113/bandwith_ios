import React, { useMemo, useState, useEffect } from "react";
import { Modal, Dimensions } from "react-native";

import CheckBox from '@react-native-community/checkbox';
import { Input } from "react-native-elements";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from "react-native-webview";

import { RegistrationScreenNavigationProps } from "../../navigation/welcome/types";
import { getPasswordErrorMessage, getEmailErrorMessage, inputStyles, getUsernameErrorMessage } from "../login/utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem, NavigationText, BasicButtonText, BasicButton, BasicSafeAreaView, ScrollViewContent, COLORS
} from "../../components/styled";
import { CheckBoxContent, InputGroup, ModalButton, ModalWrapper, ModalContent, ModalBody, ModalFooter, AgreementText } from "./styled";
import { UserServiceInstance } from "../../services/user";
import { TERMS_CONDITIONS_URL } from "../../utils/constants";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type WithNavigatorScreen = {
  navigation: RegistrationScreenNavigationProps;
}

export const RegistrationScreen = ({navigation}: WithNavigatorScreen) => {
  const [username, setUsername] = useState<string|null>(null);
  const [email, setEmail] = useState<string|null>(null);
  const [password, setPassword] = useState<string|null>(null);
  const [rPassword, setRPassword] = useState<string|null>(null);
  const [agree, setAgree] = useState(false);
  const [confirmModalStatus, setConfirmModalStatus] = useState(true);

  const usernameErrorMessage = useMemo(() => username === null ? "" : getUsernameErrorMessage(username), [username]);
  const emailErrorMessage = useMemo(() => email === null ? "" : getEmailErrorMessage(email), [email]);
  const passwordErrorMessage = useMemo(() => password === null ? "" : getPasswordErrorMessage(password), [password]);
  const rPasswordErrorMessage = useMemo(() => rPassword === null ? "" : getPasswordErrorMessage(password, rPassword), [rPassword]);

  const onSubmit = async () => {
    UserServiceInstance.register(email, password, username);
  };
  
  const isSubmitDisabled = useMemo(() => {
    return !username || !email || !password || !rPassword || !agree
      || !!usernameErrorMessage || !!emailErrorMessage || !!passwordErrorMessage || !!rPasswordErrorMessage;
  }, [username, email, password, rPassword, usernameErrorMessage, passwordErrorMessage, emailErrorMessage, rPasswordErrorMessage, agree]);

  return (
    <BasicSafeAreaView>
      <PageWrapper justifyContent="space-around">
      {
        (confirmModalStatus) ? (
          <ModalWrapper>
            <ModalContent>
              <ModalBody>
                <WebView
                  source={{ uri: TERMS_CONDITIONS_URL }}
                  style={{ width: windowWidth, height: windowHeight }}
                />
              </ModalBody>
            </ModalContent>
            <ModalFooter>
              <ModalButton onPress={() => setConfirmModalStatus(false)}>
                <BasicButtonText>I agree</BasicButtonText>
              </ModalButton>
              <ModalButton onPress={() => navigation.navigate("Welcome")} width="100%">
                <BasicButtonText>Cancel</BasicButtonText>
              </ModalButton>
            </ModalFooter>
          </ModalWrapper>
        ) : (
          <>
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
                  <Input
                    onChangeText={(value: string) => setUsername(value)}
                    placeholder="ENTER YOUR USERNAME"
                    autoCorrect={false}
                    textContentType="oneTimeCode"
                    errorMessage={usernameErrorMessage}
                    inputStyle={inputStyles.inputText}
                    containerStyle={inputStyles.inputContainer}
                    value={username}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    onChangeText={(value: string) => setEmail(value)}
                    placeholder="ENTER YOUR EMAIL"
                    autoCorrect={false}
                    textContentType="oneTimeCode"
                    errorMessage={emailErrorMessage}
                    inputStyle={inputStyles.inputText}
                    containerStyle={inputStyles.inputContainer}
                    value={email}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    secureTextEntry={true}
                    onChangeText={(value: string) => setPassword(value)}
                    placeholder="ENTER YOUR PASSWORD"
                    textContentType="oneTimeCode"
                    errorMessage={passwordErrorMessage}
                    inputStyle={inputStyles.inputText}
                    containerStyle={inputStyles.inputContainer}
                    value={password}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    secureTextEntry={true}
                    onChangeText={(value: string) => setRPassword(value)}
                    placeholder="REPEAT YOUR PASSWORD"
                    textContentType="oneTimeCode"
                    errorMessage={rPasswordErrorMessage}
                    inputStyle={inputStyles.inputText}
                    containerStyle={inputStyles.inputContainer}
                    value={rPassword}
                  />
                </InputGroup>

                <InputGroup>
                  <CheckBoxContent>
                    <CheckBox
                      style={{ width: 20, height: 20, marginTop: 5 }}
                      value={agree}
                      boxType="square"
                      onCheckColor={COLORS.GREY}
                      onTintColor={COLORS.GREY}
                      animationDuration={0}
                      onChange={() => setAgree(!agree)}
                    />
                  </CheckBoxContent>
                  <AgreementText>You cannot create offensive recording such as nudity, pornography, or profanity.</AgreementText>
                </InputGroup>

                <InputGroup>
                  <BasicButton
                    width="100%"
                    disabled={isSubmitDisabled}
                    onPress={onSubmit}
                  >
                    <BasicButtonText>REGISTER</BasicButtonText>
                  </BasicButton>
                </InputGroup>
              </KeyboardAwareScrollView>
            </ScrollViewContent>
          </>
        )
      }
      </PageWrapper>
    </BasicSafeAreaView>
  );
};

