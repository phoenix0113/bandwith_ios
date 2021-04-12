import styled from "styled-components/native";

import { COLORS } from "../../components/styled";

export const ContactListCOntainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
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
