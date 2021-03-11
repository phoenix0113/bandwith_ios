import React, { useContext } from "react";
import { ConferenceApi } from "avcore/client";
import { SafeAreaView } from "react-native";
import { MediaStream, RTCView } from "react-native-webrtc";
import { observer } from "mobx-react";

import { MediaServiceContext } from "../../../services/media";

import { BasicText, COLORS, PageWrapper } from "../../styled";
import {
  CallPageNavigation, NavigationCenterContent, BottomNavigationItem,
  CallPageBottomNavigation, CallParticipant, CallWrapper,
} from "./styled";

import CameraOffIcon from "../../../assets/images/call/CameraOff.svg";
import CameraOnIcon from "../../../assets/images/call/CameraOn.svg";
import MicroOffIcon from "../../../assets/images/call/MicroOff.svg";
import MicroOnIcon from "../../../assets/images/call/MicroOn.svg";
import VolumeOffIcon from "../../../assets/images/call/VolumeOff.svg";
import VolumeOnIcon from "../../../assets/images/call/VolumeOn.svg";
import EndCallIcon from "../../../assets/images/call/EndCall.svg";
import SwitchCameraIcon from "../../../assets/images/call/SwitchCamera.svg";
import RecordingIcon from "../../../assets/images/call/Rec.svg";

import { CallParticipantData } from "../../../interfaces/call";
import { MediaType } from "../../../interfaces/global";


interface IProps {
  endCallHandler: () => void,
  localStream: MediaStream,
  remoteStream: MediaStream,
  type: "Incoming"|"Outgoing",
  callParticipantData: CallParticipantData;
  playback?: ConferenceApi,
  callId: string,
}

export const OngoingCallComponent = observer(({
  localStream,
  remoteStream,
  endCallHandler,
  callParticipantData,
  type,
}: IProps): JSX.Element => {
  const {
    camera, volume, micro, toggleMedia, toggleCameraMode,
  } = useContext(MediaServiceContext);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.BLACK }} >
      <PageWrapper paddingHorizontal="0px">

        <CallPageNavigation>
          <RecordingIcon />
          <NavigationCenterContent>
            <BasicText textAlign="left" fontWeight="800" fontSize="14px" lineHeight="31px">{callParticipantData?.name || "Unknown user"}</BasicText>
            <BasicText textAlign="left" fontSize="12px" >{`${type} call`}</BasicText>
          </NavigationCenterContent>
          <SwitchCameraIcon onPress={toggleCameraMode} />
        </CallPageNavigation>

        <CallWrapper>
          <CallParticipant>
            {localStream && <RTCView streamURL={localStream.toURL()} />}
          </CallParticipant>

          <CallParticipant>
            {remoteStream && <RTCView streamURL={remoteStream.toURL()} />}
          </CallParticipant>
        </CallWrapper>

        <CallPageBottomNavigation>
          <BottomNavigationItem>
            {camera
              ? <CameraOnIcon onPress={() => toggleMedia(MediaType.CAMERA)} />
              : <CameraOffIcon onPress={() => toggleMedia(MediaType.CAMERA)} />}
              <BasicText fontSize="10px" lineHeight="14px">
                {`camera (${volume ? "on" : "off"})`}
              </BasicText>
          </BottomNavigationItem>

          <BottomNavigationItem>
            {micro
              ? <MicroOnIcon onPress={() => toggleMedia(MediaType.MICRO)} />
              : <MicroOffIcon onPress={() => toggleMedia(MediaType.MICRO)} />}
              <BasicText fontSize="10px" lineHeight="14px">
                {`micro (${volume ? "on" : "off"})`}
              </BasicText>
          </BottomNavigationItem>

          <BottomNavigationItem>
            {volume
              ? <VolumeOnIcon onPress={() => toggleMedia(MediaType.VOLUME)} />
              : <VolumeOffIcon onPress={() => toggleMedia(MediaType.VOLUME)} />}
              <BasicText fontSize="10px" lineHeight="14px">
                {`volume (${volume ? "on" : "off"})`}
              </BasicText>
          </BottomNavigationItem>

          <BottomNavigationItem>
            <EndCallIcon onPress={endCallHandler}/>
            <BasicText fontSize="10px" lineHeight="14px">
              End Call
            </BasicText>
          </BottomNavigationItem>
        </CallPageBottomNavigation>

      </PageWrapper>
    </SafeAreaView>
  );
});
