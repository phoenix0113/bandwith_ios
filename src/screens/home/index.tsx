import React, { useContext } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Switch } from "react-native";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicSafeAreaView, BasicText,
 } from "../../components/styled";

import { UserServiceContext, UserServiceInstance } from "../../services/user";
import { OutgoingCallServiceInstance } from "../../services/outgoingCall";
import { SocketServiceInstance } from "../../services/socket";

import MakeCallIcon from "../../assets/images/home/MakeCall.svg";
import BandwwithTextLogo from "../../assets/images/general/BandwwithTextLogo.svg";
import ArtistLoaderIcon from "../../assets/images/general/ArtistLoader.svg";

import { ContentText, ContentTitle, ContentWrapper, SwitchWrapper } from "./styled";
import { observer } from "mobx-react";

export const HomeScreen = observer(() => {
  const { profile } = useContext(UserServiceContext);

  return (
  <BasicSafeAreaView>
    <PageWrapper>

      <NavigationBar>
        <LeftItem onPress={UserServiceInstance.logout}>
          <Icon name="logout" size={20} color={COLORS.WHITE} />
        </LeftItem>
        <CenterItem />
        <RightItem>
          <SwitchWrapper>
            <BasicText fontSize="15px" lineHeight="28px" margin="0 3px 0 0">
              {profile?.available ? "Online" : "Offline"}
            </BasicText>
            <Switch
              trackColor={{ false: "#767577", true: "#85b3d6" }}
              thumbColor={profile?.available ? COLORS.ALTERNATIVE : "#f4f3f4"}
              ios_backgroundColor={COLORS.MAIN_DARK}
              onValueChange={SocketServiceInstance.toggleAvailabilityStatus}
              value={profile?.available}
              disabled={!profile}
            />
          </SwitchWrapper>
        </RightItem>
      </NavigationBar>

      <BandwwithTextLogo width="50%" />

      <ContentWrapper>
        <ArtistLoaderIcon />
      </ContentWrapper>

    </PageWrapper>
  </BasicSafeAreaView>
);});
