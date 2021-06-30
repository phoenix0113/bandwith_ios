import styled from "styled-components/native";
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../components/styled";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    color: COLORS.WHITE,
  },
  tabText: {
    color: COLORS.WHITE,
    fontSize: 15,
  },
});

export const ModalContent = styled.View`
  margin: 0 30px;
`;

export const ModalBody = styled.View`
  margin: 50px 0;
`;

export const ModalText = styled.Text`
  font-family: Kefa;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0.64px;
  text-align: left;
  color: ${COLORS.WHITE};
`;

export const ModalFooter = styled.View`
  width: ${windowWidth - 60}px;
`;

export const ModalWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
