import React, { useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { observer } from "mobx-react";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, RightItem,
  NavigationText, BasicSafeAreaView, COLORS,
} from "../../components/styled";

import { PhoneSetupStep } from "./SetupStep";
import { PhoneVerificationStep } from "./VerificationStep";

import { UserServiceInstance, UserServiceContext } from "../../services/user";

export const PhoneSetupScreen = observer(() => {
  const [phone, setPhone] = useState(null);
  const [countryCode, setCountryCode] = useState(null);

  const [step, setStep] = useState(1);
  const [smsSentTime, setSmsSentTime] = useState<number>(null);

  const { previouslySetPhone, previouslySetCountryCode } = useContext(UserServiceContext);

  useEffect(() => {
    if (previouslySetPhone && previouslySetCountryCode) {
      setPhone(previouslySetPhone);
      setCountryCode(previouslySetCountryCode);
      setStep(2);
      setSmsSentTime(Date.now());
    }
  }, [previouslySetPhone, previouslySetPhone]);

  const onEdit = () => {
    setStep(1);
    setPhone(null);
    setSmsSentTime(null);
  };

  const sendSms = async (enteredPhone: string, enteredCountryCode: string) => {
    console.log(`> Sending SMS to ${enteredPhone}`);

    if (await UserServiceInstance.sendVerificationSMS(enteredPhone, enteredCountryCode)) {
      setCountryCode(enteredCountryCode);
      setPhone(enteredPhone);
      setSmsSentTime(Date.now());
      setStep(2);
    }
  };

  const resendSms = async () => {
    console.log(`> Resending SMS to ${phone}`);

    if (await UserServiceInstance.sendVerificationSMS(phone, countryCode)) {
      setSmsSentTime(Date.now());
      Alert.alert("Code was sent");
    }
  };

  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem>
            <NavigationText
              color={COLORS.ALTERNATIVE}
              onPress={
                UserServiceInstance.phoneEditMode
                  ? () => UserServiceInstance.cancelPhoneEditing()
                  : () => UserServiceInstance.logout()}
              >
              {UserServiceInstance.phoneEditMode ? "Cancel" : "Logout"}
            </NavigationText>
          </LeftItem>
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
          <PhoneVerificationStep smsSentTime={smsSentTime} resendSms={resendSms} phone={phone} countryCode={countryCode} />
        )}

      </PageWrapper>
    </BasicSafeAreaView>
  );
});
