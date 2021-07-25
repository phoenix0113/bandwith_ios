import styled from "styled-components/native";
import { COLORS } from "../../components/styled";

export const InputLabel = styled.Text`
  font-family: Kefa;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.64px;
  text-align: left;
  color: ${COLORS.WHITE};
  margin: 30px 0;
`;

export const InputGroup = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const PasswordIcon = styled.Image`
  width: 28px;
  height: 18.4px;
`;

export const PasswordInput = styled.View`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const PasswordIconTooltip = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 13px;
`;
