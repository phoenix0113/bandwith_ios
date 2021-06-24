import styled from "styled-components/native";
import { COLORS } from "../../components/styled";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  flex-direction: column;
  width: 100%;
`;

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