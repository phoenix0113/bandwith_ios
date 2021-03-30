import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { makeObservable, observable } from "mobx";
import { createContext } from "react";
import PushNotification from "react-native-push-notification";
import { LobbyCallEventData } from "../shared/socket";
import { logger } from "./logger";

logger.logOnServer("APNs.ts file");

class APNService {
  @observable token: string = null;

  @observable incomingCallData: LobbyCallEventData = null;

  constructor() {
    makeObservable(this);

    const that = this;
    logger.logOnServer("APNs.ts file constructor");

    PushNotification.configure({
      onRegister: function (tokenData) {
        const { token } = tokenData;
        logger.logOnServer("onRegister: " + tokenData);

        console.log("> APN token:", token);
        that.token = token;
      },
      onRegistrationError: function (error) {
        logger.logOnServer("onRegisterError: " + error);
      },
      onNotification: function (notification) {
        that.incomingCallData = {
          call_id: notification.data.call_id,
          caller_id: notification.data.caller_id,
          caller_image: notification.data.caller_image,
          caller_name: notification.data.caller_name,
          caller_socket: notification.data.caller_socket,
        };
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

  public resetIncomingCallData = () => {
    this.incomingCallData = null;
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


