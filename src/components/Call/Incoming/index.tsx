import React from "react";
import { View } from "react-native";

import { IncomingCallServiceInstance } from "../../../services/incomingCall";

import { ProfileImageWrapper } from "../../ProfileImageWrapper";
import { IncomingCallWrapper, CallUser, CallToolbar, CallToolbarItem } from "./styled";
import {
 NavigationBar, CenterItem, PageWrapper, COLORS,
 NavigationText, BasicText, BasicSafeAreaView,
} from "../../styled";

import DeclineCallIcon from "../../../assets/images/call/DeclineCall.svg";
import AcceptCallIcon from "../../../assets/images/call/AcceptCall.svg";

import { CallParticipantData } from "../../../interfaces/call";

interface IProps {
  callParticipantData: CallParticipantData;
}

export const IncomingCallComponent = ({ callParticipantData }: IProps): JSX.Element => (
  <BasicSafeAreaView>
    <PageWrapper justifyContent="space-between">

      <NavigationBar>
        <CenterItem>
          <NavigationText>Incoming Call</NavigationText>
        </CenterItem>
      </NavigationBar>

      <IncomingCallWrapper>
        <ProfileImageWrapper src={callParticipantData?.image} />

        <CallUser>
          <View>
            <BasicText fontWeight="700" lineHeight="40px">{callParticipantData?.name || "test"}</BasicText>
          </View>
          <View>
            <BasicText fontSize="12px" color={COLORS.WHITE_VAGUE} lineHeight="14px" >{callParticipantData?.isFriend ? "Friend" : "Unknown User"}</BasicText>
          </View>
        </CallUser>

        <CallToolbar>
          <CallToolbarItem size="small">
            <DeclineCallIcon width="100%" onPress={IncomingCallServiceInstance.onRejectCall} />
          </CallToolbarItem>
          <CallToolbarItem size="big">
            <AcceptCallIcon width="100%" onPress={IncomingCallServiceInstance.onAcceptCall} />
          </CallToolbarItem>
          <CallToolbarItem size="small" />
        </CallToolbar>

      </IncomingCallWrapper>
    </PageWrapper>
  </BasicSafeAreaView>
);
