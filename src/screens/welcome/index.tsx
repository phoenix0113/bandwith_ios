import React from "react";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

import { WelcomeWrapper, ContentToolbox, HeaderContent, HeaderWrapper } from "./styled";
import { COLORS, BasicButton, BasicButtonText, BasicSafeAreaView } from "../../components/styled";

import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import ContinueWithGoogleIcon from "../../assets/images/general/ContinueWithGoogle.svg";
import BandwwithHandIcon from "../../assets/images/general/BandwwithHandIcon.svg";

import { WelcomeScreenNavigationProps } from "../../navigation/welcome/types";

GoogleSignin.configure({
  webClientId: "145536000163-qjfeu4edovl197fsv86kor0li68uhdl0.apps.googleusercontent.com",
  offlineAccess: false,
});

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

export const WelcomeScreen = ({ navigation }: WithNavigatorScreen): JSX.Element => {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Process Cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Process in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play services are not available");
      } else {
        Alert.alert("Something else went wrong... ", error.toString());
      }
    }
  };

  return (
    <BasicSafeAreaView>
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

          <ContinueWithGoogleIcon
            width="100%"
            onPress={() => signIn()}
          />

        </ContentToolbox>
      </WelcomeWrapper>
    </BasicSafeAreaView>
  );
};
