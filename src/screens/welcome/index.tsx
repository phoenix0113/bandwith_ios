import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { 
  AppleButton, appleAuth
} from "@invertase/react-native-apple-authentication";

import { WelcomeWrapper, ContentToolbox, HeaderContent, HeaderWrapper, ButtonContent, GoogleIcon } from "./styled";
import { COLORS, BasicButton, BasicButtonText, BasicSafeAreaView } from "../../components/styled";

import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import ContinueWithGoogleIcon from "../../assets/images/general/ContinueWithGoogle.svg";
// import GoogleIcon from "../../assets/images/general/Google.svg";
const googleIcon = "../../assets/images/general/Google.png";
import BandwwithHandIcon from "../../assets/images/general/BandwwithHandIcon.svg";

import { WelcomeScreenNavigationProps } from "../../navigation/welcome/types";

import { UserServiceInstance } from "../../services/user";

type WithNavigatorScreen = {
  navigation: WelcomeScreenNavigationProps;
}
/**
* You"d technically persist this somewhere for later use.
*/
let user = null;

/**
* Fetches the credential state for the current user, if any, and updates state on completion.
*/
async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
  if (user === null) {
    updateCredentialStateForUser("N/A");
  } else {
    const credentialState = await appleAuth.getCredentialStateForUser(user);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      updateCredentialStateForUser("AUTHORIZED");
    } else {
      updateCredentialStateForUser(credentialState);
    }
  }
}
 
/**
* Starts the Sign In flow.
*/
async function onAppleButtonPress(updateCredentialStateForUser) {
  console.warn("Beginning Apple Authentication");
  console.log("> appleAuth.Scope.EMAIL", appleAuth.Scope.EMAIL);
  console.log("> appleAuth.Scope.FULL_NAME", appleAuth.Scope.FULL_NAME);
 
  // start a login request
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
 
    console.log("> appleAuthRequestResponse", appleAuthRequestResponse);

    const {
      user: newUser,
      email,
      // nonce,
      identityToken,
      realUserStatus /* etc */,
     } = appleAuthRequestResponse;
 
    user = newUser;
 
    // fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
    //   updateCredentialStateForUser(`Error: ${error.code}`),
    // );
 
    if (identityToken) {
      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      console.log("> identityToken", identityToken);
      UserServiceInstance.authWithApple(user, email);
    } else {
      // no token - failed sign-in?
      console.log("> Failed Sign in with Apple account!");
    }
 
    if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
      console.log("> I'm a real person!");
    }
 
    console.warn(`Apple Authentication Completed, ${user}, ${email}`);
   } catch (error) {
    if (error.code === appleAuth.Error.CANCELED) {
      console.warn("User canceled Apple Sign in.");
    } else {
      console.error(error);
    }
   }
 }
export const WelcomeScreen = ({ navigation }: WithNavigatorScreen): JSX.Element => {
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
  useEffect(() => {
    if (!appleAuth.isSupported) return;

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );
  }, []);

  useEffect(() => {
    if (!appleAuth.isSupported) return;

    return appleAuth.onCredentialRevoked(async () => {
      console.warn("Credential Revoked");
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );
    });
  }, []);

  if (!appleAuth.isSupported) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <Text>Apple Authentication is not supported on this device.</Text>
      </View>
    );
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
              onPress={() => onAppleButtonPress(updateCredentialStateForUser)}
            />
          </ButtonContent>

        </ContentToolbox>
      </WelcomeWrapper>
    </BasicSafeAreaView>
  );
};

const styles = StyleSheet.create({
  appleButton: {
    width: 200,
    height: 60,
    margin: 10,
  },
  header: {
    margin: 10,
    marginTop: 30,
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "pink",
  },
  horizontal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});