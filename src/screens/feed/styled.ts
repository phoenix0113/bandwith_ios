import styled from "styled-components/native";
import {RTCView} from "react-native-webrtc";

export const CallWrapper = styled.View`
  display: flex;
  flex-grow: 1;
  width: 100%;
  border: 1px solid red;
  flex-direction: column;
`;

export const CallVideo = styled(RTCView)`
  width: 100%;
  height: 46%;
`;
