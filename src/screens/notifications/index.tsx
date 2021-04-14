import React, { useState, useContext, useCallback } from "react";
import { observer } from "mobx-react";
import { FlatList } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useFocusEffect } from "@react-navigation/native";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, COLORS,
  RightItem, NavigationText, BasicSafeAreaView, BasicText,
} from "../../components/styled";
import { NotificationBlock, NotificationHeader, NotificationUserImage, Styles, SwipeableContainer } from "./styled";
import { Notification, NotificationTypes, NotificationUser } from "../../shared/interfaces";

import { InvitationComponent } from "./Invitation";

import VerifiedIcon from "../../assets/images/notifications/Verified.svg";
import DeleteIcon from "../../assets/images/notifications/Delete.svg";

import { NotificationServiceContext, NotificationServiceInstance } from "../../services/notifications";
import { SocketServiceInstance } from "../../services/socket";
import { UserServiceInstance } from "../../services/user";

export const NotificationsScreen = observer(() => {
  const { notifications } = useContext(NotificationServiceContext);

  useFocusEffect(
    useCallback(() => {
      if (UserServiceInstance.profile) {
        NotificationServiceInstance.fetchUserNotifications(() => {
          if (notifications?.length) {
            NotificationServiceInstance.checkNotificationsStatus();
          }
        });
      }
    }, [])
  );

  const [invitationViewerId, setViewerInvitationId] = useState<string>(null);
  const [invitationViewerUser, setViewerInvitationUser] = useState<NotificationUser>(null);

  const handleDelete = (notification: Notification) => {
    console.log(`> Notification with id ${notification._id} is about to be removed`);
    NotificationServiceInstance.deleteNotification(notification._id);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === NotificationTypes.INVITATION) {
      setViewerInvitationId(notification._id);
      setViewerInvitationUser(notification.user);
    }
  };

  const closeViewer = () => {
    setViewerInvitationId(null);
    setViewerInvitationUser(null);
  };

  const removeNotification = (_id: string) => {
    handleDelete(notifications.find((n) => n._id === _id));
    closeViewer();
  };

  const acceptInvitation = (_id: string, userId: string) => {
    SocketServiceInstance.addContactAndNotify(userId, () => {
      removeNotification(_id);
    });
  };

  if (invitationViewerId && invitationViewerUser) {
    return (
      <InvitationComponent
        _id={invitationViewerId}
        user={invitationViewerUser}
        acceptHandler={acceptInvitation}
        declineHandler={removeNotification}
        closeHandler={closeViewer}
      />
    );
  }

  return (
    <BasicSafeAreaView>
      <PageWrapper paddingHorizontal="0">

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>Notifications</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <FlatList
          style={Styles.flatList}
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            return (
              <Swipeable
                overshootRight={false}
                overshootLeft={false}
                renderRightActions={() => (
                  <SwipeableContainer>
                    <DeleteIcon onPress={() => handleDelete(item)} />
                  </SwipeableContainer>
                )}
              >
                <NotificationBlock key={item._id} onPress={() => handleNotificationClick(item)}>
                  <NotificationHeader>
                    <NotificationUserImage source={{ uri: item.user.imageUrl || "DefaultProfileImage" }} />
                    <BasicText margin="0 10px" fontSize="14px" lineHeight="16px">{`@${item.user.name}`}</BasicText>
                    <VerifiedIcon />
                  </NotificationHeader>

                  <BasicText fontSize="14px" lineHeight="16px" textAlign="left">{item.header}</BasicText>
                </NotificationBlock>
              </Swipeable>
            );
          }}
        />

      </PageWrapper>
    </BasicSafeAreaView>
  );
});
