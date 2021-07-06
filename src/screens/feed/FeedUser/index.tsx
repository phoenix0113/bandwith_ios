import React, { useContext, useMemo } from "react";
import { COLORS } from "../../../components/styled";
import { RecordUser } from "../../../shared/interfaces";

import { ProfileImageWrapper } from "../../../components/ProfileImageWrapper";
import { SocketServiceContext } from "../../../services/socket";
import { OutgoingCallServiceInstance } from "../../../services/outgoingCall";
import { showGeneralErrorAlert } from "../../../utils/notifications";
import { UserServiceContext } from "../../../services/user";
import { ContactsServiceContext } from "../../../services/contacts";
import { REMOVE_FROM_FRIEND_LIST_ERROR, USER_STATUS_ERROR } from "../../../utils/constants";

import { observer } from "mobx-react";
import { RecordUserWrapper, RightItem, RightText, NavigationBar, LeftItem, CenterItem, NavigationText, ProfileImageContent,
  ProfileNameText, ProfileActionButton, ProfileActionText, BasicContentWrapper
} from "../styled";
import { View } from "react-native";

interface IProps {
  user: RecordUser;
  closeHandler: () => void;
}

export const RecordUserComponent = observer(({ user, closeHandler }: IProps) => {
  const {
    contacts, sendAddToFriendInvitation, removeContact, canCallToUser, isContact,
  } = useContext(SocketServiceContext);
  const { sendInvite, isInvite, inviteRequests } = useContext(ContactsServiceContext);
  
  // const [requestSent, setRequestSent] = useState(false);
  const addToFriends = () => {
    sendAddToFriendInvitation(user._id, () => {
      sendInvite(user._id);
    });
  };

  const removeFromFriends = async () => {
    try {
      if (await removeContact(user._id)) {
        closeHandler();
      }
    } catch (err) {
      showGeneralErrorAlert(REMOVE_FROM_FRIEND_LIST_ERROR);
    }
  };

  const call = () => {
    if (canCallToUser(user._id)) {
      OutgoingCallServiceInstance.makeCall(user._id);
      closeHandler();
    } else {
      showGeneralErrorAlert(USER_STATUS_ERROR);
    }
  };
  const isUserInContactList = useMemo(() => isContact(user._id), [contacts]);
  const isUserInInviteList = useMemo(() => isInvite(user._id), [inviteRequests]);
  const { profile } = useContext(UserServiceContext);

  return (
    <RecordUserWrapper>
      <NavigationBar>
        <LeftItem />
        <CenterItem>
          <NavigationText>Contact Account</NavigationText>
        </CenterItem>
        <RightItem>
          <RightText onPress={closeHandler}>Cancel</RightText>
        </RightItem>
      </NavigationBar>
      <BasicContentWrapper>
        <ProfileImageContent>
          <ProfileImageWrapper src={user.imageUrl} />
        </ProfileImageContent>
        <View style={{width: "100%"}}>
          <ProfileNameText>{user.name}</ProfileNameText>
          {!isUserInContactList && profile?._id !== user._id && (
            <ProfileActionButton
              onPress={addToFriends}
              style={{
                backgroundColor: isUserInInviteList ? COLORS.ALTERNATIVE : COLORS.MAIN_LIGHT,
              }}
              disabled={isUserInInviteList ? true : false }
            >
              <ProfileActionText style={{color: isUserInInviteList ? COLORS.BLACK : COLORS.WHITE}}>
                {isUserInInviteList ? "Invitation is sent" : "Add to Friends" }
              </ProfileActionText>
            </ProfileActionButton>
          )}

          {isUserInContactList && profile?._id !== user._id && (
            <ProfileActionButton
              onPress={removeFromFriends}
              style={{
                backgroundColor: COLORS.MAIN_LIGHT,
              }}
            >
              <ProfileActionText style={{color: COLORS.RED}}>
                Delete
              </ProfileActionText>
            </ProfileActionButton>
          )}

          {profile?._id !== user._id && (
            <ProfileActionButton
              onPress={call}
              style={{
                backgroundColor: COLORS.MAIN_LIGHT,
              }}
            >
              <ProfileActionText style={{color: COLORS.WHITE}}>
                Make a Call
              </ProfileActionText>
            </ProfileActionButton>
          )}
        </View>
      </BasicContentWrapper>
    </RecordUserWrapper>
  );
});