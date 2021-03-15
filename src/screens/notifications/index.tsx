import React from "react";
import {
  CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicSafeAreaView,
 } from "../../components/styled";

export const NotificationsScreen = () => (
  <BasicSafeAreaView>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Notifications</NavigationText>
        </CenterItem>
        <RightItem />
      </NavigationBar>

    </PageWrapper>
  </BasicSafeAreaView>
);
