import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { Input } from "react-native-elements";

import { RegistrationScreenNavigationProps } from "../../navigation/welcome/types";
import { getPasswordErrorMessage, getEmailErrorMessage, inputStyles, getUsernameErrorMessage } from "../login/utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicButtonText, BasicButton,
} from "../../components/styled";
import { InputLabel, InputGroup } from "../login/styled";
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
  const rPasswordErrorMessage = useMemo(() => rPassword === null ? "" : getPasswordErrorMessage(rPassword), [rPassword]);

  const onSubmit = async () => {
    if (email && password && username) {
      UserServiceInstance.register(email, password, username);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return !username || !email || !password || !rPassword
      || !!usernameErrorMessage || !!emailErrorMessage || !!passwordErrorMessage || !!rPasswordErrorMessage;
  }, [username, email, password, rPassword, usernameErrorMessage, passwordErrorMessage, emailErrorMessage, rPasswordErrorMessage]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
      <PageWrapper paddingHorizontal="24px">

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

        <InputGroup>
          <InputLabel>Username it's your identity</InputLabel>
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
          <InputLabel>Your gmail is required for login</InputLabel>
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

        <InputGroup>
          <InputLabel>Your password it's your safety</InputLabel>
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

      </PageWrapper>
    </SafeAreaView>
  );
};

