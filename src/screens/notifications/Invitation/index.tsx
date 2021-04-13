import React from "react";
import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem, BasicContentWrapper,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView, BasicButton, BasicButtonText,
} from "../../../components/styled";
import { ProfileImageWrapper } from "../../../components/ProfileImageWrapper";

import { NotificationUser } from "../../../shared/interfaces";

interface IProps {
  _id: string;
  closeHandler: () => void;
  acceptHandler: (_id: string, userId: string) => void;
  declineHandler: (_id: string) => void;
  user: NotificationUser;
}

export const InvitationComponent = (
  { _id, closeHandler, acceptHandler, declineHandler, user }: IProps,
): JSX.Element => (
  <BasicSafeAreaView>
    <PageWrapper>

    <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Add to Friends?</NavigationText>
        </CenterItem>
        <RightItem onPress={closeHandler}>
          <NavigationText color={COLORS.ALTERNATIVE}>
            Cancel
          </NavigationText>
        </RightItem>
      </NavigationBar>

      <BasicContentWrapper>
        <ProfileImageWrapper src={user.imageUrl} />

        <BasicText lineHeight="40px">{user.name}</BasicText>
        <BasicText margin="0 0 10% 0" lineHeight="14px" fontSize="12px" color={COLORS.GREY}>
          Sent you a friend request
        </BasicText>

        <BasicButton
          width="100%"
          onPress={() => acceptHandler(_id, user._id)}
          backgroundColor={COLORS.WHITE}
        >
          <BasicButtonText color={COLORS.BLACK}>Accept</BasicButtonText>
        </BasicButton>

        <BasicButton
          width="100%"
          onPress={() => declineHandler(_id)}
          backgroundColor={COLORS.WHITE}
        >
          <BasicButtonText color={COLORS.RED}>Decline</BasicButtonText>
        </BasicButton>
      </BasicContentWrapper>

    </PageWrapper>
  </BasicSafeAreaView>
);
