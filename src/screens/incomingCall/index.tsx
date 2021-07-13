import { IncomingCallServiceContext } from "../../services/incomingCall";

import { IncomingCallStatus } from "../../interfaces/call";
import React, { useState, useContext, useMemo } from "react";
import { Modal } from "react-native";
import { Input } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { OngoingCallComponent } from "../../components/Call/Ongoing";

import { IncomingCallComponent } from "../../components/Call/Incoming";

import { publishRecording, checkRecordingName } from "../../axios/routes/feed";
import { showGeneralErrorAlert } from "../../utils/notifications";
import { CHECK_RECORDING_NAME_ERROR } from "../../utils/constants";

import { inputStyles } from "../login/utils";
import { ModalWrapper, ModalContent, ModalBody, InputLabel } from "../../components/Call/Ended/styled";
import { COLORS, BasicButtonText, BasicButton, SpinnerOverlayText } from "../../components/styled";


export const IncomingCallScreen = observer((): JSX.Element => {
  const {
    status,
    endCall,
    videoStream,
    remoteVideoStream,
    callParticipantData,
    playback,
    callId,
    participantAppStatus,
    participantCallDetectorStatus,
    isReconnecting,
  } = useContext(IncomingCallServiceContext);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return !name;
  }, [name]);

  const setRecordingName = async () => {
    try {
      setIsLoading(true);
      console.log("callId", callId);
      console.log("callParticipantData.id", callParticipantData.id);
      const { _id } = await publishRecording({
        callId,
        participants: [callParticipantData.id],
      });
      
      console.log("_id", _id);
      
      let data = await checkRecordingName({
        _id: _id,
        name: name,
      });
      setIsLoading(false);
      console.log("> data", data);
    } catch(err) {
      showGeneralErrorAlert(CHECK_RECORDING_NAME_ERROR);
      console.log(">  Check recording name error", err);
    }
  }

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
                <InputLabel>Your recordin's name</InputLabel>
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
