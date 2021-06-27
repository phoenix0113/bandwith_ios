import styled from "styled-components/native";
import { COLORS } from "../../components/styled";
import { Dimensions } from "react-native";

export const InputLabel = styled.Text`
  font-family: Kefa;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.64px;
  text-align: left;
  color: ${COLORS.WHITE};
  margin: 20px 0;
`;

export const InputGroup = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 10px 0;
`;

export const ModalText = styled.Text`
  font-family: Kefa;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0.64px;
  text-align: left;
  color: ${COLORS.WHITE};
  width: 90%;
`;

export const CheckBoxContent = styled.View`
  width: 10%;
`;