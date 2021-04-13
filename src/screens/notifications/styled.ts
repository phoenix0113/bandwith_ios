import styled from "styled-components/native";
import { COLORS } from "../../components/styled";
import {StyleSheet} from "react-native";

export const Styles = StyleSheet.create({
  flatList: {
    width: "100%",
    paddingRight: 20,
  },
});

export const NotificationBlock = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  padding: 0 0 17px 20px;
  background-color: ${COLORS.BLACK};
`;

export const NotificationHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 8px 0;
`;

export const NotificationUserImage = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;

export const SwipeableContainer =  styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;

`;
