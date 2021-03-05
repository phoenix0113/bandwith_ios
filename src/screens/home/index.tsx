import React from "react";
import { SafeAreaView } from "react-native";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicButtonText, BasicButton,
 } from "../../components/styled";
import { UserServiceInstance } from "../../services/user";

export const HomeScreen = () => (
  <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Home</NavigationText>
        </CenterItem>
        <RightItem />
      </NavigationBar>

      <BasicButton onPress={() => UserServiceInstance.logout()}>
        <BasicButtonText>Logout</BasicButtonText>
      </BasicButton>
    </PageWrapper>
  </SafeAreaView>
);
