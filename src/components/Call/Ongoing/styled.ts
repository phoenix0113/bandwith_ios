import styled from "styled-components/native";
import { COLORS } from "../../styled";
import { Dimensions } from "react-native";

import { RTCView } from "react-native-webrtc";

export const CALL_PAGE_NAVIGATION_HEIGHT = 75;

const CALL_CONTENT_HEIGHT = Dimensions.get("window").height - 44 - 34 - (CALL_PAGE_NAVIGATION_HEIGHT * 2);

export const CallPageNavigation = styled.View`
  width: 100%;
  background: ${COLORS.BLACK};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${CALL_PAGE_NAVIGATION_HEIGHT}px;
`;

export const NavigationCenterContent = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const TouchableNavigationItem = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;


export const CallPageBottomNavigation = styled.View`
  width: 100%;
  background: ${COLORS.BLACK};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: ${CALL_PAGE_NAVIGATION_HEIGHT}px;
`;

export const BottomNavigationItem = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 20%;
`;


export const CallWrapper = styled.View`
  background-color: ${COLORS.BLACK};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: ${CALL_CONTENT_HEIGHT}px;
`;

export const ReconnectionWrapper = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.BLACK};
  opacity: 0.75;
  z-index: 100;
`;

export const CallParticipant = styled.View`
  width: 100%;
  height: 50%;
`;

export const CallVideo = styled(RTCView)`
  width: 100%;
  height: 100%;
`;

export const ParticipantStatusOverlay = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${COLORS.BLACK};
  opacity: 0.75;
  display: flex;
  justify-content: center;
  align-items: center;
`;
