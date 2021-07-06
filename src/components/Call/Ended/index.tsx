import React, { useState } from "react";

import { ProfileImageWrapper } from "../../ProfileImageWrapper";
import { TimerComponent } from "../../Timer";
import { ContentWrapper } from "./styled";
import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView, BasicButtonText, BasicButton,
} from "../../styled";

import { CallParticipantData } from "../../../interfaces/call";
import { CALL_FINISHED_REDIRECT_TIMER } from "../../../utils/constants";
import { SocketServiceInstance } from "../../../services/socket";
import { publishRecording } from "../../../axios/routes/feed";

interface IProps {
  callParticipantData: CallParticipantData;
  resetHandler: () => void;
  callId: string;
}

export const CallEndedComponent = ({ callParticipantData, resetHandler, callId }: IProps): JSX.Element => {
  const [published, setPublished] = useState(false);
  const publishHandler = () => {
    publishRecording({
      callId,
      participants: [callParticipantData.id],
    });

    setPublished(true);
  };
  const [requestSent, setRequestSent] = useState(false);
  const addToFriendsHandler = () => {
    SocketServiceInstance.sendAddToFriendInvitation(callParticipantData?.id, () => {
      setRequestSent(true);
    });
  };

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
          <RightItem onPress={resetHandler}>
            <NavigationText color={COLORS.ALTERNATIVE}>
              Close
            </NavigationText>
          </RightItem>
        </NavigationBar>

        <ContentWrapper>
          <ProfileImageWrapper src={callParticipantData?.image} />

          <BasicText lineHeight="40px">Call Ended</BasicText>
          <BasicText fontSize="12px" lineHeight="24px" color={COLORS.WHITE_VAGUE} >
            You will be automatically redirected to the home page
          </BasicText>

          <BasicText fontSize="16px" lineHeight="22px" color={COLORS.WHITE_VAGUE}>
            <TimerComponent
              initialValue={CALL_FINISHED_REDIRECT_TIMER}
              onEndCallback={resetHandler}
            />
          </BasicText>

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

          <BasicButton
            disabled={published}
            width="100%"
            margin="5% 0 20px 0"
            onPress={publishHandler}
            backgroundColor={published ? COLORS.ALTERNATIVE : COLORS.MAIN_LIGHT}
            borderColor={published ? COLORS.ALTERNATIVE : COLORS.MAIN_LIGHT}
          >
            <BasicButtonText color={published ? COLORS.BLACK : COLORS.WHITE}>
              {published ? "Published" : "Public Publish" }
            </BasicButtonText>
          </BasicButton>

        </ContentWrapper>

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
