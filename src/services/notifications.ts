import { makeObservable, observable, reaction, runInAction } from "mobx";
import { createContext } from "react";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";

import { checkNotificationsRequest, getNotificationListRequest, removeNotificationRequest } from "../axios/routes/notifications";
import { Notification, NotificationTypes } from "../shared/interfaces";

class NotificationService {
  @observable notifications: Array<Notification> = [];

  constructor() {
    makeObservable(this);

    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile && !this.notifications.length) {
          this.fetchUserNotifications();
        }
      }
    );
  }

  private fetchUserNotifications = async () => {
    try {
      console.log("> Fetching notification list");
      this.notifications = await getNotificationListRequest() || [];
    } catch (err) {
      Alert.alert("Notification", err.message);
    }
  }

  public deleteNotification = async (id: string) => {
    try {
      if (await removeNotificationRequest({ notification_id: id })) {
        this.notifications = this.notifications.filter((n) => n._id !== id);
      }
    } catch (err) {
      Alert.alert("Notification", err.message);
    }
  }

  public checkNotificationsStatus = async () => {
    try {
      const unreadNotifications = this.notifications
        .reduce<Array<string>>((acc, n) => (n.read ? acc : [...acc, n._id]), []);

      if (!unreadNotifications.length) {
        console.log("> All notifications are already read");
      } else {
        console.log("> Mark following notifications as read: ", unreadNotifications);
        if (await checkNotificationsRequest({ notifications: unreadNotifications })) {
          this.notifications = this.notifications.map((n) => ({
            ...n,
            read: true,
          }));
        }
      }
    } catch (err) {
      Alert.alert("Notification", err.message);
    }
  }

  /**
   * Happens when both users sent "Add to Contact list" notifications to each other
   * and one of the accepted it
   * This event happens on the other's user side and will remove notification
   * about request to contact list and add "Accepted" like invitation
   */
  public onMutualInvitationAcceptance = (notification: Notification) => {
    const index = this.notifications
      .findIndex((n) => n.type === NotificationTypes.INVITATION
        && n.user._id === notification.user._id);

    runInAction(() => {
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
      this.notifications = [notification, ...this.notifications];
    });
  }

  public addNotification = (notification: Notification) => {
    runInAction(() => {
      this.notifications = [notification, ...this.notifications];
    });
  }
}

export const NotificationServiceInstance = new NotificationService();

export const NotificationServiceContext = createContext(NotificationServiceInstance);
