import styled from "styled-components/native";
import { COLORS } from "../../components/styled";
import { StyleSheet } from "react-native";

interface InputValidationTextProps {
  valid: boolean;
}

export const InputValidationText = styled.Text<InputValidationTextProps>`
  font-family: Kefa;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.64px;
  text-align: left;
  color: ${({valid}) => valid ? COLORS.ALTERNATIVE : COLORS.RED};
`;

export const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.BLACK,
  },
  inputTextContainer: {
    backgroundColor: COLORS.BLACK,
  },
  inputText: {
    color: COLORS.WHITE,
    fontSize: 20,
  },
});
