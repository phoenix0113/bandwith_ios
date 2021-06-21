import React, { useState, useRef, useEffect } from "react";
import { Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import Icon from "react-native-vector-icons/AntDesign";

import { BasicContentWrapper, COLORS, BasicButton, BasicButtonText, ScrollViewContent } from "../../../components/styled";
import { InputValidationText, styles } from "./../styled";
import { InputGroup } from "../../login/styled";

interface IProps {
  sendSms: (phone: string, countryCode: string) => void;
}

export const PhoneSetupStep = ({ sendSms }: IProps) => {
  const phoneInput = useRef<PhoneInput>(null);

  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");

  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);

  const checkNumber = () => {
    let checkValid = phoneInput.current?.isValidNumber(phone);
    checkValid = (phoneInput.current?.getCountryCode() === "CN") ? false : checkValid;
    setChecked(true);
    setValid(checkValid ? checkValid : false);
  };

  const onSubmit = async () => {
    sendSms(formattedPhone, phoneInput.current.getCountryCode());
  };

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
  const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  return (
    <BasicContentWrapper justifyContent="space-around">
      <BasicContentWrapper justifyContent="space-around">
        <InputGroup>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="US"
            layout="first"
            value={phone}
            onChangeCountry={() => {
              setValid(false);
              setChecked(false);
              setPhone("");
              setFormattedPhone("");
            }}
            onChangeText={(text) => {
              setChecked(false);
              setPhone(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedPhone(text);
            }}
            withDarkTheme
            containerStyle={styles.inputContainer}
            codeTextStyle={styles.inputText}
            textContainerStyle={styles.inputTextContainer}
            textInputStyle={styles.inputText}
            renderDropdownImage={<Icon name="down" size={16} color={COLORS.WHITE} />}
            textInputProps={{returnKeyType: "done", selectionColor: COLORS.ALTERNATIVE}}
          />
          <InputValidationText valid={valid}>
            {!checked ? "" : valid ? "Looks good. Click Submit to continue" : "Wrong phone number format"}
          </InputValidationText>
        </InputGroup>

      </BasicContentWrapper>

      <BasicButton
        width="100%"
        backgroundColor={checked && valid ? COLORS.ALTERNATIVE : COLORS.WHITE}
        borderColor={checked && valid ? COLORS.ALTERNATIVE : COLORS.WHITE}
        onPress={checked && valid ? () => onSubmit() : () => checkNumber()}
      >
        <BasicButtonText>{checked && valid ? "Submit" : "Check"}</BasicButtonText>
      </BasicButton>
    </BasicContentWrapper>
  );
};
