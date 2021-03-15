import React from "react";
import Icon from "react-native-vector-icons/AntDesign";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicSafeAreaView,
 } from "../../components/styled";

import { UserServiceInstance } from "../../services/user";
import { OutgoingCallServiceInstance } from "../../services/outgoingCall";

import MakeCallIcon from "../../assets/images/home/MakeCall.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import { ContentText, ContentTitle, ContentWrapper } from "./styled";

export const HomeScreen = () => (
  <BasicSafeAreaView>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText />
        </CenterItem>
        <RightItem onPress={() => UserServiceInstance.logout()}>
          <Icon name="logout" size={20} color={COLORS.WHITE} />
        </RightItem>
      </NavigationBar>

      <BandwwithTextLogo width="50%" />

      <ContentWrapper>
        <MakeCallIcon onPress={() => OutgoingCallServiceInstance.makeCall()} />
        <ContentTitle>Make Random Call</ContentTitle>
        <ContentText>Make calls to complete strangers, meet, invite friends and share your calls</ContentText>
      </ContentWrapper>

    </PageWrapper>
  </BasicSafeAreaView>
);
