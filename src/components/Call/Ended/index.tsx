import React from "react";
import { ProfileImageWrapper } from "../../ProfileImageWrapper";
import { TimerComponent } from "../../Timer";
import { ContentWrapper } from "./styled";
import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView,
} from "../../styled";

import { CallParticipantData } from "../../../interfaces/call";
import { CALL_FINISHED_REDIRECT_TIMER } from "../../../utils/constants";

interface IProps {
  callParticipantData: CallParticipantData;
  resetHandler: () => void;
  callId: string;
}

export const CallEndedComponent = ({ callParticipantData, resetHandler, callId }: IProps): JSX.Element => {
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

        </ContentWrapper>

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
