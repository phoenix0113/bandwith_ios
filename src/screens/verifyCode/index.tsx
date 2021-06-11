import React, { useMemo, useState, useEffect } from "react";
import { Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { VERIFY_STATUS } from "../../utils/constants";

import { LoginScreenNavigationProps } from "../../navigation/welcome/types";
import { getVerifyCodeErrorMessage, inputStyles } from "./utils";

import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem, NavigationText, BasicButtonText, BasicButton, BasicSafeAreaView, ContentGroup, ScrollViewContent,
} from "../../components/styled";
import { InputLabel, InputGroup } from "./styled";
import { UserServiceInstance } from "../../services/user";

type WithNavigatorScreen = {
  navigation: LoginScreenNavigationProps;
}

export const VerifyCodeScreen = ({navigation}: WithNavigatorScreen) => {
  const [code, setCode] = useState<string|null>(null);
  const [verifyStatus, setVerifyStatus] = useState("VERIFY_STATUS");

  const getVerifyStatus = async () => {
    let verify_status = await AsyncStorage.getItem(VERIFY_STATUS);
    setVerifyStatus(verify_status);
  }  

  const codeErrorMessage = useMemo(() => code === null ? "" : getVerifyCodeErrorMessage(code, verifyStatus), [code]);

  const changeCode = (code) => {
    setVerifyStatus("VERIFY_STATUS");
    setCode(code);
  }

  const onSubmit = async () => {
    if (code){
      UserServiceInstance.verifyCode(code);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return !code || !!codeErrorMessage;
  }, [code, codeErrorMessage]);

  useEffect(() => {
    getVerifyStatus();
  }, [verifyStatus]);

  return (
    <BasicSafeAreaView>
      <PageWrapper justifyContent="space-around">

        <NavigationBar>
          <LeftItem onPress={() => navigation.navigate("Welcome")}>
            <BackButtonIcon />
          </LeftItem>
          <CenterItem>
            <NavigationText>Checkout Verify Code</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <BandwwithTextLogo width="50%" />

        <ScrollViewContent justifyContent="space-around">
          <ContentGroup>
            <InputGroup>
              <InputLabel>Please input verify code here</InputLabel>
              <Input
                onChangeText={(value: string) => changeCode(value)}
                placeholder="ENTER VERIFY CODE"
                autoCorrect={false}
                errorMessage={codeErrorMessage}
                inputStyle={inputStyles.inputText}
                containerStyle={inputStyles.inputContainer}
              />
            </InputGroup>

            <BasicButton
              width="100%"
              disabled={isSubmitDisabled}
              onPress={onSubmit}
            >
              <BasicButtonText>VERIFY</BasicButtonText>
            </BasicButton>
          </ContentGroup>
        </ScrollViewContent>
      </PageWrapper>
    </BasicSafeAreaView>
  );
};
