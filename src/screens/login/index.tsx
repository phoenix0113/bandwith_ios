import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { Input } from "react-native-elements";

import {LoginScreenNavigationProps} from "../../navigation/welcome/types";
import {getPasswordErrorMessage, getEmailErrorMessage, inputStyles} from "./utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicButtonText, BasicButton,
} from "../../components/styled";
import {InputLabel, InputGroup} from "./styled";
import {UserServiceInstance} from "../../services/user";

type WithNavigatorScreen = {
  navigation: LoginScreenNavigationProps;
}

export const LoginScreen = ({navigation}: WithNavigatorScreen) => {
  const [email, setEmail] = useState<string|null>(null);
  const [password, setPassword] = useState<string|null>(null);

  const emailErrorMessage = useMemo(() => email === null ? "" : getEmailErrorMessage(email), [email]);
  const passwordErrorMessage = useMemo(() => password === null ? "" : getPasswordErrorMessage(password), [password]);

  const onSubmit = async () => {
    if (email && password){
      UserServiceInstance.login(email, password);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return !email || !password || !!emailErrorMessage || !!passwordErrorMessage;
  }, [email, password, passwordErrorMessage, emailErrorMessage]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
      <PageWrapper paddingHorizontal="24px">

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

        <BasicButton
          width="100%"
          disabled={isSubmitDisabled}
          onPress={onSubmit}
        >
          <BasicButtonText>LOGIN</BasicButtonText>
        </BasicButton>

      </PageWrapper>
    </SafeAreaView>
  );
};
