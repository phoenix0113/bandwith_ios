import React, { useState, useMemo } from "react";
import { Input } from "react-native-elements";

import { ProfileImageWrapper } from "../../ProfileImageWrapper";
import { ContentWrapper } from "./styled";
import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView, BasicButtonText, BasicButton,
} from "../../styled";

import { InputLabel } from "./styled";
import { inputStyles } from "../../../screens/login/utils";

import { CallParticipantData } from "../../../interfaces/call";
import { SocketServiceInstance } from "../../../services/socket";
import { publishRecording } from "../../../axios/routes/feed";

interface IProps {
  callParticipantData: CallParticipantData;
  resetHandler: () => void;
  callId: string;
}

export const CallEndedComponent = ({ callParticipantData, resetHandler, callId }: IProps): JSX.Element => {
  const publishHandler = () => {
    publishRecording({
      callId,
      participants: [callParticipantData.id],
      recordingName,
    });

    resetHandler();
  };
  const [requestSent, setRequestSent] = useState(false);
  const addToFriendsHandler = () => {
    SocketServiceInstance.sendAddToFriendInvitation(callParticipantData?.id, () => {
      setRequestSent(true);
    });
  };

  const [recordingName, setRecordingName] = useState("");

  const isSubmitDisabled = useMemo(() => {
    return !recordingName;
  }, [recordingName]);

  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>
              {callParticipantData?.name || "Unknown user"}
            </NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <ContentWrapper>
          <ProfileImageWrapper src={callParticipantData?.image} />

          <BasicText lineHeight="40px">Call Ended</BasicText>

          {!callParticipantData?.isFriend && (
            <BasicButton
              margin="5% 0 20px 0"
              width="100%"
              onPress={addToFriendsHandler}
              backgroundColor={requestSent ? COLORS.GREY_SENT : COLORS.WHITE}
              borderColor={requestSent ? COLORS.GREY_SENT : COLORS.WHITE}
            >
              <BasicButtonText color={requestSent ? COLORS.BLACK : COLORS.BLACK}>
                {requestSent ? "Invitation is sent" : "Add to Friends" }
              </BasicButtonText>
            </BasicButton>
          )}

          <InputLabel>Your recording's name</InputLabel>
          <Input
            onChangeText={(value: string) => setRecordingName(value)}
            placeholder="ENTER RECORDING'S NAME"
            textContentType="oneTimeCode"
            inputStyle={inputStyles.inputText}
            containerStyle={inputStyles.inputContainer}
            value={recordingName}
          />

          <BasicButton
            disabled={isSubmitDisabled}
            width="100%"
            margin="5% 0 20px 0"
            onPress={publishHandler}
            backgroundColor={COLORS.WHITE}
            borderColor={COLORS.WHITE}
          >
            <BasicButtonText color={COLORS.BLACK}>
              OK
            </BasicButtonText>
          </BasicButton>

        </ContentWrapper>

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
