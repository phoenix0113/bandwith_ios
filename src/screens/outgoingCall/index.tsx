import React, { useState, useContext, useMemo } from "react";
import { Modal } from "react-native";
import { Input } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { OutgoingCallComponent } from "../../components/Call/Outgoing";
import { OngoingCallComponent } from "../../components/Call/Ongoing";
import { CallEndedComponent } from "../../components/Call/Ended";

import { OutgoingCallServiceContext } from "../../services/outgoingCall";

import { publishRecording, checkRecordingName } from "../../axios/routes/feed";
import { showGeneralErrorAlert } from "../../utils/notifications";
import { CHECK_RECORDING_NAME_ERROR } from "../../utils/constants";

import { OutgoingCallStatus } from "../../interfaces/call";

import { inputStyles } from "../login/utils";
import { ModalWrapper, ModalContent, ModalBody, InputLabel } from "../../components/Call/Ended/styled";
import { COLORS, BasicButtonText, BasicButton, SpinnerOverlayText } from "../../components/styled";

export const OutgoingCallScreen = observer((): JSX.Element => {
  const {
    status,
    endCallHandler,
    videoStream,
    remoteVideoStream,
    callParticipantData,
    playback,
    callId,
    resetOutgoingCall,
    participantAppStatus,
    participantCallDetectorStatus,
    isReconnecting,
  } = useContext(OutgoingCallServiceContext);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return !name;
  }, [name]);

  const setRecordingName = async () => {
    try {
      setIsLoading(true);
      const { _id } = await publishRecording({
        callId,
        participants: [callParticipantData.id],
      });

      let data = await checkRecordingName({
        _id: _id,
        name: name,
      });
      setIsLoading(false);
      console.log("> data", data);
      return resetOutgoingCall();
    } catch(err) {
      showGeneralErrorAlert(CHECK_RECORDING_NAME_ERROR);
      console.log("> Check recording name error", err);
      return resetOutgoingCall();
    }
  }

  switch (status) {
    case OutgoingCallStatus.INITIALIZED:
    case OutgoingCallStatus.CANCELED:
    case OutgoingCallStatus.NO_RESPONSE:
    case OutgoingCallStatus.REJECTED_BY_PARTICIPANT:
    case OutgoingCallStatus.WAITING_FOR_PARTICIPANT:
      return <OutgoingCallComponent callParticipantData={callParticipantData} />;
    case OutgoingCallStatus.FINISHED:
      return (
        <>
          <Spinner
            visible={isLoading}
            textContent="Please wait..."
            textStyle={SpinnerOverlayText.text}
            size="large"
            color={COLORS.WHITE}
            overlayColor={COLORS.BLACK}
            animation="fade"
          />
          <Modal
              animationType="slide"
              transparent={true}
              visible={true}
              style={{alignItems: "center", display: "flex", }}
            >
            <ModalWrapper>
              <ModalContent>
                <ModalBody>
                <InputLabel>Your recording's name</InputLabel>
                  <Input
                    onChangeText={(value: string) => setName(value)}
                    placeholder="ENTER RECORDING NAME"
                    textContentType="oneTimeCode"
                    inputStyle={inputStyles.inputText}
                    containerStyle={inputStyles.inputContainer}
                    value={name}
                  />
                  <BasicButton
                    disabled={isSubmitDisabled}
                    margin="5% 0 20px 0"
                    width="100%"
                    onPress={setRecordingName}
                  >
                    <BasicButtonText>OK</BasicButtonText>
                  </BasicButton>
                </ModalBody>
              </ModalContent>
            </ModalWrapper>
          </Modal>
        </>
      );
    case OutgoingCallStatus.ANSWERED_BY_PARTICIPANT:
      return (
        <OngoingCallComponent
          endCallHandler={endCallHandler}
          localStream={videoStream}
          remoteStream={remoteVideoStream}
          type="Outgoing"
          callParticipantData={callParticipantData}
          playback={playback}
          callId={callId}
          participantAppStatus={participantAppStatus}
          participantCallStatus={participantCallDetectorStatus}
          isReconnecting={isReconnecting}
        />
      );
    default:
      break;
  }
});
