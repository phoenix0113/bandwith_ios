import React from "react";
import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem, BasicContentWrapper,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView, BasicButton, BasicButtonText,
} from "../../../components/styled";

import { ProfileImageWrapper } from "../../../components/ProfileImageWrapper";
import { UserStatus } from "../../../shared/socket";

interface IProps {
  _id: string;
  name: string;
  imageUrl: string;
  status: UserStatus;
  deleteHandler: (id: string) => void;
  callHandler: (id: string) => void;
  closeHandler: () => void;
}

export const ContactAccountComponent = (
  { name, imageUrl, _id, deleteHandler, callHandler, closeHandler, status }: IProps,
): JSX.Element => (
  <BasicSafeAreaView>
    <PageWrapper>

      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Contact Account</NavigationText>
        </CenterItem>
        <RightItem onPress={closeHandler}>
          <NavigationText color={COLORS.ALTERNATIVE}>
            Cancel
          </NavigationText>
        </RightItem>
      </NavigationBar>

      <BasicContentWrapper>
        <ProfileImageWrapper src={imageUrl} />

        <BasicText margin="0 0 10% 0" lineHeight="40px">{name}</BasicText>

        <BasicButton
          width="100%"
          onPress={() => callHandler(_id)}
          backgroundColor={COLORS.WHITE}
        >
          <BasicButtonText color={COLORS.BLACK}>Make a Call</BasicButtonText>
        </BasicButton>

        <BasicButton
          width="100%"
          onPress={() => deleteHandler(_id)}
          backgroundColor={COLORS.WHITE}
        >
          <BasicButtonText color={COLORS.RED}>Delete</BasicButtonText>
        </BasicButton>
      </BasicContentWrapper>

    </PageWrapper>
  </BasicSafeAreaView>
);
