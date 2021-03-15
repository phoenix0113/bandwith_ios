import React from "react";
import { OutgoingCallServiceInstance } from "../../../services/outgoingCall";

import { TimerComponent } from "../../Timer";
import {
 NavigationBar, CenterItem, PageWrapper, COLORS,
 NavigationText, BasicText, BasicSafeAreaView,
} from "../../styled";
import { OutgoingCallWrapper, TimerWrapper, OutgoingCallContent } from "./styled";

import DeclineCallIcon from "../../../assets/images/call/DeclineCall.svg";

import { CallParticipantData } from "../../../interfaces/call";
import { OUTGOING_CALL_SECONDS } from "../../../utils/constants";

interface IProps {
  callParticipantData: CallParticipantData;
}

export const OutgoingCallComponent = ({ callParticipantData }: IProps): JSX.Element => (
  <BasicSafeAreaView>
    <PageWrapper justifyContent="space-between">

      <NavigationBar>
        <CenterItem>
          <NavigationText>Outgoing Call</NavigationText>
        </CenterItem>
      </NavigationBar>

      <OutgoingCallWrapper>

        <TimerWrapper>
          <BasicText fontSize="32px" lineHeight="44px" color={COLORS.WHITE}>
            <TimerComponent
              initialValue={OUTGOING_CALL_SECONDS}
              onEndCallback={OutgoingCallServiceInstance.noResponseHandler}
            />
          </BasicText>
          <BasicText fontSize="14px" lineHeight="16px" color={COLORS.WHITE_VAGUE}>
            Connecting Time
          </BasicText>
        </TimerWrapper>

        <OutgoingCallContent>
          <BasicText fontSize="30px" lineHeight="40px">
            {callParticipantData?.isFriend ? "Calling to a friend" : "Random Calling"}
          </BasicText>
          <BasicText fontSize="12px" lineHeight="16px">
            Please wait, connection is in progress, it often takes a few seconds
          </BasicText>
        </OutgoingCallContent>

        <DeclineCallIcon onPress={OutgoingCallServiceInstance.cancelCallHandler} />
      </OutgoingCallWrapper>
    </PageWrapper>
  </BasicSafeAreaView>
);
