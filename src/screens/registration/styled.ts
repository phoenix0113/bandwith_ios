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
  flex-direction: row;
  width: 100%;
  margin: 10px 0;
`;
export const ModalContent = styled.View`
  position: absolute;
  width: ${windowWidth}px;
  height: ${windowHeight - 150}px;
`;

export const ModalBody = styled.ScrollView`
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
`;

export const ModalFooter = styled.View`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  top: ${windowHeight - 140}px;
  width: ${windowWidth}px;
`;

export const ModalWrapper = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  width: ${windowWidth}px;
  height: ${windowHeight - 100}px;
  background: ${COLORS.WHITE}
`;

/**
 * Modal button
 */
 type ModalButtonProps = {
  flexGrow?: number;
  width?: string;
  disabled?: boolean;
}

export const ModalButton = styled.TouchableOpacity<ModalButtonProps>`
  padding: 3px 5px;
  border-radius: 3px;
  border: 2px solid;
  width: 100px;
  background-color: ${COLORS.WHITE};
  border-color: ${COLORS.WHITE};
  flex-grow: ${({flexGrow}) => flexGrow || 0};
`;

export const AgreementText = styled.Text`
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