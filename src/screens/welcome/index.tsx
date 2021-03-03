import React from "react";
import { SafeAreaView } from "react-native";

import {
  WelcomeWrapper, ContentToolbox, HeaderContent, ButtonText,
  HeaderWrapper, LoginButton, RegistrationButton,
} from "./styled";
import { COLORS } from "../../components/styled";

import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import ContinueWithGoogleIcon from "../../assets/images/general/ContinueWithGoogle.svg";
import BandwwithHandIcon from "../../assets/images/general/BandwwithHandIcon.svg";

import { WelcomeScreenNavigationProps } from "../../navigation/welcome/types";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

export const WelcomeScreen = ({ navigation }: WithNavigatorScreen): JSX.Element => (
  <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
    <WelcomeWrapper>
      <HeaderWrapper>
        <BandwwithTextLogo width="50%" />
        <BandwwithHandIcon width="33%"/>
        <HeaderContent>in order to use the application you need to log in</HeaderContent>
      </HeaderWrapper>
      <ContentToolbox>
        <LoginButton onPress={() => navigation.navigate("Login")}>
          <ButtonText color={COLORS.BLACK}>Login</ButtonText>
        </LoginButton>
        <RegistrationButton onPress={() => navigation.navigate("Registration")}>
          <ButtonText color={COLORS.WHITE}>Registration</ButtonText>
        </RegistrationButton>
        <ContinueWithGoogleIcon width="100%"/>
      </ContentToolbox>
    </WelcomeWrapper>
  </SafeAreaView>
);

