import React, { useEffect } from "react";
import { 
  AppleButton, appleAuth
} from "@invertase/react-native-apple-authentication";

import { WelcomeWrapper, ContentToolbox, HeaderContent, HeaderWrapper, ButtonContent } from "./styled";
import { COLORS, BasicButton, BasicButtonText, BasicSafeAreaView } from "../../components/styled";

import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import ContinueWithGoogleIcon from "../../assets/images/general/ContinueWithGoogle.svg";
import BandwwithHandIcon from "../../assets/images/general/BandwwithHandIcon.svg";

import { WelcomeScreenNavigationProps } from "../../navigation/welcome/types";

import {UserServiceInstance} from "../../services/user";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}

export const WelcomeScreen = ({ navigation }: WithNavigatorScreen): JSX.Element => {
  const onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  }

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn('If this function executes, User Credentials have been Revoked');
    });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

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
              backgroundColor={COLORS.BLACK}
              flexGrow={1}
              onPress={() => navigation.navigate("Login")}
            >
              <BasicButtonText color={COLORS.WHITE}>Login</BasicButtonText>
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
            <ContinueWithGoogleIcon
              style={{
                width: "100%",
                height: 50,
              }}
              onPress={() => UserServiceInstance.authWithGoogle()}
            />
          </ButtonContent>
          
          <ButtonContent>
            <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: "100%", // You must specify a width
                height: 50, // You must specify a height
                marginTop: 20
              }}
              onPress={() => onAppleButtonPress()}
            />
          </ButtonContent>

        </ContentToolbox>
      </WelcomeWrapper>
    </BasicSafeAreaView>
  );
};