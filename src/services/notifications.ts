import { makeObservable, observable, reaction, runInAction } from "mobx";
import { createContext } from "react";

import { UserServiceInstance } from "./user";
import { AppServiceInstance } from "./app";

import {
  checkNotificationsRequest, getNotificationListRequest, removeNotificationRequest
} from "../axios/routes/notifications";
import { Notification, NotificationTypes } from "../shared/interfaces";
import { showGeneralErrorAlert } from "../utils/notifications";
import {
  FETCH_USER_NOTIFICATION, DELETE_USER_NOTIFICATION, CHECK_NOTIFICATION_STATUS
} from "../utils/constants";

class NotificationService {
  private onReconnectActions: Array<Function> = [];

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

    reaction(
      () => AppServiceInstance.canReconnect,
      (canReconnect) => {
         if (UserServiceInstance.profile && this.onReconnectActions.length && canReconnect) {

          this.onReconnectActions.forEach((func) => {
            func();
          });
          this.onReconnectActions = [];
        }
      }
    );
  }

  public fetchUserNotifications = async (callback?: () => void) => {
    try {
      console.log("> Fetching notification list");
      this.notifications = await getNotificationListRequest() || [];
      if (callback) {callback();}
    } catch (err) {
      if (!AppServiceInstance.netAccessible) {
        this.scheduleActions(this.fetchUserNotifications);
      } else {
        console.log("> Fetch User Notifications", err.message);
        showGeneralErrorAlert(FETCH_USER_NOTIFICATION);
      }
    }
  }

  public deleteNotification = async (id: string) => {
    try {
      if (await removeNotificationRequest({ notification_id: id })) {
        this.notifications = this.notifications.filter((n) => n._id !== id);
      }
    } catch (err) {
      if (!AppServiceInstance.netAccessible) {
        this.scheduleActions(this.deleteNotification);
      } else {
        console.log("> Delete Notification", err.message);
        showGeneralErrorAlert(DELETE_USER_NOTIFICATION);
      }
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
      if (!AppServiceInstance.netAccessible) {
        this.scheduleActions(this.checkNotificationsStatus);
      } else {
        console.log("> Check Notifications Status", err.message);
        showGeneralErrorAlert(CHECK_NOTIFICATION_STATUS);
      }
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

  private scheduleActions = (action: Function) => {
    this.onReconnectActions.push(action);
  }
}

export const NotificationServiceInstance = new NotificationService();

export const NotificationServiceContext = createContext(NotificationServiceInstance);
