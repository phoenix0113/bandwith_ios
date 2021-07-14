import React, { useMemo, useContext } from "react";
import { SocketServiceContext } from "../../../services/socket";
import { UserServiceContext } from "../../../services/user";
import { ContactsServiceContext } from "../../../services/contacts";
import { OutgoingCallServiceInstance } from "../../../services/outgoingCall";
import { NotificationServiceContext } from "../../../services/notifications";
import { showGeneralErrorAlert } from "../../../utils/notifications";

import { REMOVE_FROM_FRIEND_LIST_ERROR, USER_STATUS_ERROR } from "../../../utils/constants";

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
): JSX.Element => {
  const { canCallToUser, removeContact, sendAddToFriendInvitation } = useContext(SocketServiceContext);
  const { contacts, isInvite, inviteRequests, isContact, sendInvite, fetchUserContacts } = useContext(ContactsServiceContext);
  const { fetchUserNotifications } = useContext(NotificationServiceContext);

  const isUserInContactList = useMemo(() => isContact(user._id), [contacts]);
  const isUserInInviteList = useMemo(() => isInvite(user._id), [inviteRequests]);
  const { profile } = useContext(UserServiceContext);

  const addToFriends = () => {
    sendAddToFriendInvitation(user._id, () => {
      sendInvite(user._id);
    });
    closeHandler();
    fetchUserNotifications();
  };

  const call = () => {
    if (canCallToUser(user._id)) {
      OutgoingCallServiceInstance.makeCall(user._id);
      closeHandler();
      fetchUserContacts();
      fetchUserNotifications();
    } else {
      showGeneralErrorAlert(USER_STATUS_ERROR);
    }
  };

  const removeFromFriends = async () => {
    try {
      if (await removeContact(user._id)) {
        closeHandler();
        fetchUserNotifications();
      }
    } catch (err) {
      showGeneralErrorAlert(REMOVE_FROM_FRIEND_LIST_ERROR);
    }
  };

  return (
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

          {!isUserInContactList && profile?._id === user._id && (
            <BasicButton
              width="100%"
              backgroundColor={COLORS.WHITE}
              onPress={addToFriends}
              disabled={isUserInInviteList ? true : false }
            >
              <BasicButtonText style={{color: COLORS.BLACK}}>
                {isUserInInviteList ? "Invitation is sent" : "Add to Friends" }
              </BasicButtonText>
            </BasicButton>
          )}

          {!isUserInContactList && !isUserInInviteList && profile?._id !== user._id && (
            <BasicButton
              width="100%"
              onPress={() => acceptHandler(_id, user._id)}
              backgroundColor={COLORS.WHITE}
            >
              <BasicButtonText color={COLORS.BLACK}>Accept</BasicButtonText>
            </BasicButton>
          )}

          {!isUserInContactList && !isUserInInviteList && profile?._id !== user._id && (
            <BasicButton
              width="100%"
              onPress={() => declineHandler(_id)}
              backgroundColor={COLORS.WHITE}
            >
              <BasicButtonText color={COLORS.RED}>Decline</BasicButtonText>
            </BasicButton>
          )}

          {isUserInContactList && profile?._id !== user._id && (
            <BasicButton
              width="100%"
              onPress={removeFromFriends}
              backgroundColor={COLORS.WHITE}
            >
              <BasicButtonText style={{color: COLORS.RED}}>
                Delete
              </BasicButtonText>
            </BasicButton>
          )}

          {profile?._id !== user._id && (
            <BasicButton
              width="100%"
              onPress={call}
              backgroundColor={COLORS.WHITE}
            >
              <BasicButtonText style={{color: COLORS.BLACK}}>
                Make a Call
              </BasicButtonText>
            </BasicButton>
          )}

        </BasicContentWrapper>

      </PageWrapper>
    </BasicSafeAreaView>
  );
};
