import React from "react";
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import { WelcomeScreenNavigationProps } from "../../navigation/welcome/types";

import { UserServiceInstance } from "../../services/user";
import { showGeneralErrorAlert } from "../../utils/notifications";

import { WelcomeWrapper, ContentToolbox, HeaderContent, HeaderWrapper, ButtonContent, GoogleIcon } from "./styled";
import { BasicButton, BasicButtonText, BasicSafeAreaView } from "../../components/styled";

import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import BandwwithHandIcon from "../../assets/images/general/BandwwithHandIcon.svg";
const googleIcon = "../../assets/images/general/Google.png";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

export const WelcomeScreen = ({ navigation }: WithNavigatorScreen): JSX.Element => {
  return (
    <BasicSafeAreaView>
      <WelcomeWrapper>
        <HeaderWrapper>
          <BandwwithTextLogo width="50%" />
          <BandwwithHandIcon width="33%"/>
          <HeaderContent>in order to use the application you need to log in</HeaderContent>
        </HeaderWrapper>
        <ContentToolbox>
          <ButtonContent>
            <BasicButton
              flexGrow={1}
              onPress={() => navigation.navigate("Login")}
            >
              <BasicButtonText>Login</BasicButtonText>
            </BasicButton>
          </ButtonContent>
          
          <ButtonContent>
            <BasicButton
              flexGrow={1}
              onPress={() => navigation.navigate("Registration")}
            >
              <BasicButtonText>Registration</BasicButtonText>
            </BasicButton>
          </ButtonContent>
          
        </ContentToolbox>
      </WelcomeWrapper>
    </BasicSafeAreaView>
  );
};
