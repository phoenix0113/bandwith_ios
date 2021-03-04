import React from "react";
import { SafeAreaView } from "react-native";

import { WelcomeWrapper, ContentToolbox, HeaderContent, HeaderWrapper } from "./styled";
import { COLORS, BasicButton, BasicButtonText } from "../../components/styled";

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
        <BasicButton
          backgroundColor={COLORS.BLACK}
          onPress={() => navigation.navigate("Login")}
        >
          <BasicButtonText color={COLORS.WHITE}>Login</BasicButtonText>
        </BasicButton>
        <BasicButton
          flexGrow={1}
          margin="0 0 20px 10px "
          onPress={() => navigation.navigate("Registration")}
        >
          <BasicButtonText>Registration</BasicButtonText>
        </BasicButton>
        <ContinueWithGoogleIcon width="100%"/>
      </ContentToolbox>
    </WelcomeWrapper>
  </SafeAreaView>
);

