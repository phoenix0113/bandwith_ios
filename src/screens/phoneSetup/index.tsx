import React, { useState } from "react";
import { Alert } from "react-native";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem,
  NavigationText, BasicSafeAreaView, COLORS,
} from "../../components/styled";

import { PhoneSetupStep } from "./SetupStep";
import { PhoneVerificationStep } from "./VerificationStep";

import { UserServiceInstance } from "../../services/user";

export const PhoneSetupScreen = () => {
  const [phone, setPhone] = useState(null);

  const [step, setStep] = useState(1);
  const [smsSentTime, setSmsSentTime] = useState<number>(null);

  const onEdit = () => {
    setStep(1);
    setPhone(null);
    setSmsSentTime(null);
  };

  const sendSms = async (enteredPhone: string) => {
    console.log(`> Sending SMS to ${enteredPhone}`);

    if (await UserServiceInstance.sendVerificationSMS(enteredPhone)) {
      setPhone(enteredPhone);
      setSmsSentTime(Date.now());
      setStep(2);
    }
  };

  const resendSms = async () => {
    console.log(`> Resending SMS to ${phone}`);

    if (await UserServiceInstance.sendVerificationSMS(phone)) {
      setSmsSentTime(Date.now());
      Alert.alert("Code was sent");
    }
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
          <PhoneVerificationStep smsSentTime={smsSentTime} resendSms={resendSms} phone={phone} />
        )}

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
