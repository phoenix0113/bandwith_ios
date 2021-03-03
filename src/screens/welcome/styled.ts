import styled from "styled-components/native";

export const COLORS = {
  MAIN_DARK: "#0B131A",
  MAIN_LIGHT: "#0F1A23",
  GREY: "#908F9D",
  LIGHT_GREY: "#DEDEDE",
  WHITE: "#fff",
  BLACK: "#0B0B0B",
  RED: "#FF0000",
  ORANGE: "#FD9D00",
  ALTERNATIVE: "#0AFFEF",
};

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

const BasicButton = styled.TouchableOpacity`
  padding: 11px 37.5px;
  border-radius: 6px;
  border: 2px solid;
  margin-bottom: 20px;
`;

type ButtonTextProps = {
  color: string;
}

export const ButtonText = styled.Text<ButtonTextProps>`
  font-size: 18px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0px;
  color: ${({color}) => color};
`;

export const LoginButton = styled(BasicButton)`
  background-color: white;
  border-color: ${COLORS.MAIN_LIGHT};
`;

export const RegistrationButton = styled(BasicButton)`
  background-color: ${COLORS.MAIN_LIGHT};
  border-color: ${COLORS.MAIN_LIGHT};
  color: white;
  flex-grow: 1;
  margin-left: 10px;
`;
