import styled from "styled-components/native";
import { COLORS } from "../../components/styled";

export const InputLabel = styled.Text`
  font-family: Kefa;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.64px;
  text-align: left;
  color: ${COLORS.WHITE};
  margin-bottom: 10px;
`;

export const InputGroup = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 20%;
`;
