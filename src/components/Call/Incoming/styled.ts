import styled from "styled-components/native";
import { COLORS } from "../../styled";

export const IncomingCallWrapper = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${COLORS.BLACK};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: ${COLORS.WHITE};
  /* padding-top: 20%; */
`;

export const CallUser = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CallToolbar = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  /* padding: 5% 30px 25% 30px; */
  width: 100%;
`;

interface CallToolbarItemProps {
  size?: "big"|"small";
}

export const CallToolbarItem = styled.View<CallToolbarItemProps>`
  height: 100%;
  width: ${({ size }) => (size === "big" ? "37%" : "22%")};
  display: flex;
  justify-content: center;
`;
