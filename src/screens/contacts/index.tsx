import React from "react";
import {
  CenterItem, LeftItem, NavigationBar, PageWrapper,
  RightItem, NavigationText, BasicSafeAreaView,
 } from "../../components/styled";

export const ContactListScreen = () => (
  <BasicSafeAreaView>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>My Contacts</NavigationText>
        </CenterItem>
        <RightItem />
      </NavigationBar>

    </PageWrapper>
  </BasicSafeAreaView>
);
