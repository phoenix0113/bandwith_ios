import styled from "styled-components/native";
import { COLORS } from "../../components/styled";

export const WelcomeWrapper = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.BLACK};
`;

export const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 42px;
  flex-grow: 2;
`;

export const HeaderContent = styled.Text`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0.73px;
  text-align: center;
  color: ${COLORS.WHITE};
  text-transform: uppercase;
`;

export const ContentToolbox = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 50px 30px;
  align-items: flex-end;
`;
