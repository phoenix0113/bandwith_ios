import React from "react";
import { SafeAreaView } from "react-native";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText,
 } from "../../components/styled";

export const NotificationsScreen = () => (
  <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Notifications</NavigationText>
        </CenterItem>
        <RightItem />
      </NavigationBar>

    </PageWrapper>
  </SafeAreaView>
);
