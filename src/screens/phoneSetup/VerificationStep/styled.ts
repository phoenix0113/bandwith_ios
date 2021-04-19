import styled from "styled-components/native";
import { COLORS } from "../../../components/styled";

export const PressableStyled = styled.Pressable`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  height: 80px;
`;

interface CodeInputProps {
  focused: boolean;
}

export const CodeInput = styled.View<CodeInputProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: ${({ focused }) => focused ? COLORS.ALTERNATIVE : COLORS.WHITE_VAGUE};
  border-width: 2px;
  border-radius: 4px;
  padding: 12px;
  margin: 0 3%;
  flex: 1;
`;

export const HiddenInput = styled.TextInput`
  position: absolute;
  height: 0px;
  width: 0px;
  opacity: 0;
`;

export const ResendContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 3%;
`;
