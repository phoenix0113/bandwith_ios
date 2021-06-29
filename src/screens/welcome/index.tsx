import React from "react";
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import { WelcomeScreenNavigationProps } from "../../navigation/welcome/types";

import { UserServiceInstance } from "../../services/user";

import { WelcomeWrapper, ContentToolbox, HeaderContent, HeaderWrapper, ButtonContent, GoogleIcon } from "./styled";
import { BasicButton, BasicButtonText, BasicSafeAreaView } from "../../components/styled";

import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import BandwwithHandIcon from "../../assets/images/general/BandwwithHandIcon.svg";
const googleIcon = "../../assets/images/general/Google.png";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

export const WelcomeScreen = ({ navigation }: WithNavigatorScreen): JSX.Element => {

  const handleResponse = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME
        ],
      });

      console.log("> appleAuthRequestResponse", appleAuthRequestResponse);
      
      let username = appleAuthRequestResponse.fullName.givenName + " " + appleAuthRequestResponse.fullName.familyName;
      let email = appleAuthRequestResponse.email;

      UserServiceInstance.authWithApple(username, email);
    } catch (error) {
      console.warn("error code", error);
    }
  }

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
          
          <ButtonContent>
            <BasicButton
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%", // You must specify a width
                height: 50, // You must specify a height
              }}
              flexGrow={1}
              onPress={() => UserServiceInstance.authWithGoogle()}
            >
              <GoogleIcon source={require(googleIcon)} />
              <BasicButtonText>Sign with Google</BasicButtonText>
            </BasicButton>
          </ButtonContent>
          
          <ButtonContent>
            <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: "100%", // You must specify a width
                height: 50, // You must specify a height
              }}
              onPress={handleResponse}
            />
          </ButtonContent>

        </ContentToolbox>
      </WelcomeWrapper>
    </BasicSafeAreaView>
  );
};