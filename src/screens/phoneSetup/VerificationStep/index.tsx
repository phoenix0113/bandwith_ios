import React, { useState, useRef } from "react";
import { TextInput, TouchableOpacity } from "react-native";

import { BasicContentWrapper, BasicButton, BasicButtonText, BasicText, COLORS } from "../../../components/styled";
import { CodeInput, HiddenInput, PressableStyled, ResendContainer } from "./styled";

import { TimerComponent } from "../../../components/Timer";

import { UserServiceInstance } from "../../../services/user";

interface IProps {
  smsSentTime: number;
  resendSms: () => void;
  phone: string;
}

const CODE_LENGTH = 4;
const WAIT_TILL_NEXT_SMS = 1000 * 60;

export const PhoneVerificationStep = ({ smsSentTime, resendSms, phone }: IProps) => {
  const [code, setCode] = useState("");
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const codeDigitsArray = [null, null, null, null];

  const ref = useRef<TextInput>(null);

  const handleOnPress = () => {
    setContainerIsFocused(true);
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const onSubmit = async () => {
    console.log(`> Verifying code ${code} for ${phone} number`);
    setDisabledSubmit(true);
    await UserServiceInstance.verifySMSCode(code, phone);
    setDisabledSubmit(false);
  };

  const [showTimer, setShowTimer] = useState(false);

  const getTimerInitialValue = () => {
    const currentTime = Date.now();
    const timePassed = currentTime - smsSentTime;

    return Math.round((WAIT_TILL_NEXT_SMS - timePassed) / 1000);
  };

  const onResendClick = () => {
    // don't do anything if timer is already shown
    if (showTimer) {
      return;
    }
    const canSend = smsSentTime + WAIT_TILL_NEXT_SMS < Date.now();
    if (!!smsSentTime && !canSend) {
      setShowTimer(true);
    } else {
      resendSms();
    }
  };

  const toDigitInput = (_value: string, index: number) => {
    const digit = code[index] || " ";

    const isCurrentDigit = index === code.length;
    const isLastDigit = index === CODE_LENGTH - 1;
    const isCodeFull = code.length === CODE_LENGTH;

    const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    return (
      <CodeInput key={index} focused={containerIsFocused && isFocused}>
        <BasicText>{digit}</BasicText>
      </CodeInput>
    );
  };

  return (
    <BasicContentWrapper justifyContent="space-between">
      <BasicContentWrapper>

      <PressableStyled onPress={handleOnPress}>
        {codeDigitsArray.map(toDigitInput)}
      </PressableStyled>

      <ResendContainer>
        <TouchableOpacity onPress={onResendClick}>
          <BasicText
            fontSize="14px"
            lineHeight="14px"
            color={COLORS.ALTERNATIVE}
            textAlign="left"
            underline
          >
            Resend SMS
          </BasicText>
        </TouchableOpacity>
        {showTimer && (
          <BasicText
            fontSize="16px"
            lineHeight="16px"
            textAlign="left"
            margin="10px 0 0 0"
          >
            {`${"You can send SMS in: "}`}
            <TimerComponent
              initialValue={getTimerInitialValue()}
              onEndCallback={() => setShowTimer(false)}
            />
          </BasicText>
        )}
      </ResendContainer>

      <HiddenInput
        ref={ref}
        value={code}
        onChangeText={setCode}
        onSubmitEditing={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        maxLength={CODE_LENGTH}
      />

      </BasicContentWrapper>

      <BasicButton
        width="100%"
        onPress={onSubmit}
        disabled={code.length !== CODE_LENGTH || disabledSubmit}
      >
        <BasicButtonText>Verify</BasicButtonText>
      </BasicButton>

    </BasicContentWrapper>
  );
};
