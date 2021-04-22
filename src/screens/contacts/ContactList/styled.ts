import styled from "styled-components/native";

export const ContactListContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0 12px;
  flex: 1;
`;

export const Contact = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 65px;
`;

export const ContactImage = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 22px;
  margin-left: 15px;
`;

export const ContactContent = styled.View`
  display: flex;
  flex-direction: column;
  padding-left: 14px;
`;

export const ActionsOverlayContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 8.5%;
  display: flex;
  z-index: 10;
  padding: 5px;
`;
