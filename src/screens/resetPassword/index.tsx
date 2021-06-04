import React, { useMemo, useState } from "react";
import { Input } from "react-native-elements";

import { LoginScreenNavigationProps } from "../../navigation/welcome/types";
import { getPasswordErrorMessage, inputStyles } from "./utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem, NavigationText, BasicButtonText, BasicButton, BasicSafeAreaView, ContentGroup
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
      </PageWrapper>
    </BasicSafeAreaView>
  );
};
