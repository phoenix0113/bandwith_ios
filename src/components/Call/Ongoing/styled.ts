import styled from "styled-components/native";
import { COLORS } from "../../styled";
import { Dimensions } from "react-native";

export const CALL_PAGE_NAVIGATION_HEIGHT = 75;

const CALL_CONTENT_HEIGHT = Dimensions.get("window").height - 44 - 34 - (CALL_PAGE_NAVIGATION_HEIGHT * 2);

export const CallPageNavigation = styled.View`
  width: 100%;
  background: ${COLORS.BLACK};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 17px;
  height: ${CALL_PAGE_NAVIGATION_HEIGHT}px;
`;

export const NavigationCenterContent = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  color: ${COLORS.WHITE};
`;


export const CallPageBottomNavigation = styled.View`
  width: 100%;
  background: ${COLORS.BLACK};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 27px;
  height: ${CALL_PAGE_NAVIGATION_HEIGHT}px;
`;

export const BottomNavigationItem = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 18%;
`;


export const CallWrapper = styled.View`
  background-color: ${COLORS.BLACK};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: ${CALL_CONTENT_HEIGHT};
`;

export const CallParticipant = styled.View`
  width: 100%;
  height: 50%;
  border: 1px solid grey;
`;
