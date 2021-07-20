import { IncomingCallServiceContext } from "../../services/incomingCall";

import { IncomingCallStatus } from "../../interfaces/call";
import React, { useContext } from "react";
import { Modal } from "react-native";
import { observer } from "mobx-react";

import { OngoingCallComponent } from "../../components/Call/Ongoing";
import { IncomingCallComponent } from "../../components/Call/Incoming";

import { ModalWrapper, ModalContent, ModalBody, InputLabel } from "../../components/Call/Ended/styled";
import { BasicButtonText, BasicButton } from "../../components/styled";


export const IncomingCallScreen = observer((): JSX.Element => {
  const {
    status,
    endCall,
    videoStream,
    remoteVideoStream,
    callParticipantData,
    playback,
    callId,
    resetIncomingCall,
    participantAppStatus,
    participantCallDetectorStatus,
    isReconnecting,
  } = useContext(IncomingCallServiceContext);

  switch (status) {
    case IncomingCallStatus.INITIALIZED:
    case IncomingCallStatus.CANCELED:
    case IncomingCallStatus.MISSED:
    case IncomingCallStatus.REJECT:
    case IncomingCallStatus.INCOMING:
      return <IncomingCallComponent callParticipantData={callParticipantData}/>;
    case IncomingCallStatus.FINISHED:
      return (
        <>
          <Modal
              animationType="slide"
              transparent={true}
              visible={true}
              style={{alignItems: "center", display: "flex", }}
            >
            <ModalWrapper>
              <ModalContent>
                <ModalBody>
                  <InputLabel style={{ fontSize: 22, marginBottom: 5, textAlign: "center", lineHeight: 30, }}>The call is complete.</InputLabel>
                  <InputLabel style={{ fontSize: 22, marginTop: 5, textAlign: "center", lineHeight: 30, }}>The caller saves the call recording.</InputLabel>
                  <BasicButton
                    margin="5% 0 20px 0"
                    width="100%"
                    onPress={resetIncomingCall}
                  >
                    <BasicButtonText>OK</BasicButtonText>
                  </BasicButton>
                </ModalBody>
              </ModalContent>
            </ModalWrapper>
          </Modal>
        </>
      );
    case IncomingCallStatus.ACCEPT:
      return (
        <OngoingCallComponent
          endCallHandler={endCall}
          localStream={videoStream}
          remoteStream={remoteVideoStream}
          type="Incoming"
          callParticipantData={callParticipantData}
          callId={callId}
          playback={playback}
          participantAppStatus={participantAppStatus}
          participantCallStatus={participantCallDetectorStatus}
          isReconnecting={isReconnecting}
        />
      );
    default:
      break;
  }
});
