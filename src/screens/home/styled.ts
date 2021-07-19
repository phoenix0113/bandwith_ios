import styled from "styled-components/native";
import { COLORS } from "../../components/styled";

export const ContentWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
  align-items: center;
  margin-top: 20px;
`;

export const SwitchWrapper = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
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
  margin: 70px 0 5px 0;
`;

export const ContentText = styled.Text`
  margin-top: 10px;
  font-family: Kefa;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.WHITE_VAGUE};
  padding-bottom: 50px;
`;

interface PageWrapperProps {
  background?: string;
  paddingHorizontal?: string;
}

export const PageWrapper = styled.ScrollView<PageWrapperProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-horizontal: ${({paddingHorizontal}) => paddingHorizontal || "24px"}; 
  background-color: ${({ background }) => background || COLORS.BLACK};
`;

