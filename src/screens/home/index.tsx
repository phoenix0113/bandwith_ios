import React from "react";
import { SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText,
 } from "../../components/styled";
import { UserServiceInstance } from "../../services/user";

import MakeCallIcon from "../../assets/images/home/MakeCall.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";

import { ContentText, ContentTitle, ContentWrapper } from "./styled";

export const HomeScreen = () => (
  <SafeAreaView style={{ backgroundColor: COLORS.BLACK }} >
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

      <BandwwithTextLogo/>

      <ContentWrapper>
        <MakeCallIcon />
        <ContentTitle>Make Random Call</ContentTitle>
        <ContentText>Make calls to complete strangers, meet, invite friends and share your calls</ContentText>
      </ContentWrapper>

    </PageWrapper>
  </SafeAreaView>
);
