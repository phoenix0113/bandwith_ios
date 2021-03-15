import React from "react";
import {
  CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicSafeAreaView,
 } from "../../components/styled";


export const FeedScreen = () => {
  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>Feed</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
