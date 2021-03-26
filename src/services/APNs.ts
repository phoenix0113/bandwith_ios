import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { makeObservable, observable } from "mobx";
import { createContext } from "react";
import PushNotification from "react-native-push-notification";

class APNService {
  @observable token: string = null;

  constructor() {
    makeObservable(this);

    const that = this;

    PushNotification.configure({
      onRegister: function (tokenData) {
        const { token } = tokenData;

        console.log("> APN token:", token);
        that.token = token;
      },
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  public sendLocalNotification = (message: string) => {
    PushNotification.localNotification({
      id: Math.floor(Math.random() * 1000),
      message,
    });
  };
}

export const APNServiceInstance = new APNService();

export const APNServiceContext = createContext(APNServiceInstance);


