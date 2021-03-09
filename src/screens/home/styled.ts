import styled from "styled-components/native";
import { COLORS } from "../../components/styled";

export const ContentWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
`;

export const ContentTitle = styled.Text`
  font-family: Kefa;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.WHITE};
  margin: 40px 0 5px 0;
`;

export const ContentText = styled.Text`
  font-family: Kefa;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.WHITE_VAGUE};
`;
