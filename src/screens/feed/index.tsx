import React from "react";
import { SafeAreaView } from "react-native";

import {
  COLORS, CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText,
 } from "../../components/styled";

export const FeedScreen = () => (
  <SafeAreaView style={{ backgroundColor: COLORS.BLACK }}>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Feed</NavigationText>
        </CenterItem>
        <RightItem />
      </NavigationBar>

    </PageWrapper>
  </SafeAreaView>
);
