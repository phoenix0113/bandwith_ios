import React from "react";
import { StyleSheet } from "react-native";
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { SignInWithAppleButton  } from "react-native-apple-authentication";

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

  // const handleResponse = async () => {
  //   try {
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [
  //         appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME
  //       ],
  //     });

  //     console.log("> appleAuthRequestResponse", appleAuthRequestResponse);

  //     if (appleAuthRequestResponse.fullName.givenName && appleAuthRequestResponse.fullName.familyName && appleAuthRequestResponse.email) {
  //       let username = appleAuthRequestResponse.fullName.givenName + " " + appleAuthRequestResponse.fullName.familyName;
  //       let email = appleAuthRequestResponse.email;
  
  //       UserServiceInstance.authWithApple(username, email);
  //     } else {
  //       showGeneralErrorAlert("Apple Auth Error. Please check your Apple accout again.");
  //     }
  //   } catch (error) {
  //     console.log("error code", error);
  //     showGeneralErrorAlert("Apple Sign In is not supported on this device.");
  //   }
  // }

  const appleSignIn = (appleAuthRequestResponse) => {
    try {
      if (appleAuthRequestResponse.fullName && appleAuthRequestResponse.fullName.givenName && appleAuthRequestResponse.fullName.familyName && appleAuthRequestResponse.email) {
        let username = appleAuthRequestResponse.fullName.givenName + " " + appleAuthRequestResponse.fullName.familyName;
        let email = appleAuthRequestResponse.email;
  
        UserServiceInstance.authWithApple(username, email);
      // } else {
      //   showGeneralErrorAlert("Apple Auth Error. Please check your Apple accout again.");
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        showGeneralErrorAlert("User canceled Apple Sign in.");
      } else {
        console.log("> Error code", error);
      }
      // showGeneralErrorAlert("Apple Sign In is not supported on this device.");
    }
    console.log("> appleAuthRequestResponse", appleAuthRequestResponse);
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
            {/* <AppleButton
              buttonStyle={AppleButton.Style.WHITE}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: "100%", // You must specify a width
                height: 50, // You must specify a height
              }}
              onPress={appleSignIn}
            /> */}
            { SignInWithAppleButton({
              buttonStyle: styles.appleBtn,
              callBack: appleSignIn,
              buttonText: "Sign Up With Apple",
              textStyle: styles.appleBtnTxt,
            })}
          </ButtonContent>

        </ContentToolbox>
      </WelcomeWrapper>
    </BasicSafeAreaView>
  );
};

const styles = StyleSheet.create({
  appleBtn: {
    width: "100%", // You must specify a width
    height: 50, // You must specify a height
    backgroundColor: "white",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  appleBtnTxt: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 25,
    letterSpacing: 0,
  }
});
