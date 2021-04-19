import React, { useState } from "react";
import { Alert } from "react-native";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem,
  NavigationText, BasicSafeAreaView, COLORS,
} from "../../components/styled";

import { PhoneSetupStep } from "./SetupStep";
import { PhoneVerificationStep } from "./VerificationStep";

export const PhoneSetupScreen = () => {
  const [phone, setPhone] = useState(null);

  const [step, setStep] = useState(1);
  const [smsSentTime, setSmsSentTime] = useState<number>(null);

  const onEdit = () => {
    setStep(1);
    setPhone(null);
    setSmsSentTime(null);
  };

  const sendSms = (enteredPhone: string) => {
    console.log(`> Sending SMS to ${enteredPhone}`);
    // actual request to the server

    // if success
    setPhone(enteredPhone);
    setSmsSentTime(Date.now());
    setStep(2);

    // if  error
    // Alert.alert("Wasn't able to send an SMS to this number");
  };

  const resendSms = () => {
    // actual request to the server
    console.log(`> Resending SMS to ${phone}`);

    // if success
    setSmsSentTime(Date.now());
    Alert.alert("Code was sent");
  };

  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>{step === 1 ? "Enter your phone" : "Enter the code from SMS"}</NavigationText>
          </CenterItem>
          <RightItem>{step !== 2 ? null : (
            <NavigationText color={COLORS.ALTERNATIVE} onPress={onEdit}>Edit</NavigationText>
          )}</RightItem>
        </NavigationBar>

        {step === 1 ? (
          <PhoneSetupStep sendSms={sendSms} />
        ) : (
          <PhoneVerificationStep smsSentTime={smsSentTime} resendSms={resendSms} />
        )}

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
