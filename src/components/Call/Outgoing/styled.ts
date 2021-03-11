import styled from "styled-components/native";
import { COLORS } from "../../styled";

export const OutgoingCallWrapper = styled.View`
  flex-grow: 1;
  width: 100%;
  background-color: ${COLORS.BLACK};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20% 20px 10% 20px;
`;

export const TimerWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const OutgoingCallContent = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
