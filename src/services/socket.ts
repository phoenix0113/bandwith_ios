import { createContext } from "react";
import SocketIO from "socket.io-client";
import { makeObservable, observable, reaction, runInAction, toJS } from "mobx";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";
import { ContactsServiceInstance } from "./contacts";
import { NotificationServiceInstance } from "./notifications";
import { APNServiceInstance } from "./APNs";

import { CallSocket } from "../interfaces/Socket";
import { SERVER_BASE_URL } from "../utils/constants";
import {
 ACTIONS, APNCallCancel, APNCallRequest, APNCallTimeout, CLIENT_ONLY_ACTIONS, ErrorData, JoinLobbyRequest, LobbyCallEventData, MakeLobbyCallResponse, SendAPNDeviceIdRequest, SetCallAvailabilityRequest,
} from "../shared/socket";
import { NotificationTypes } from "../shared/interfaces";
import { addUserToContactListRequest, removeUserFromContactListRequest } from "../axios/routes/contacts";
import { createAddToFriednsInvitation, createInvitationAcceptedNotification, createMissedCallNotification, createRemovedFromContactsNotification } from "../shared/utils";

export interface LobbyCallEventDataExtended extends LobbyCallEventData {
  isFriend: boolean;
}

export interface LobbyCallResponse extends MakeLobbyCallResponse {
  isFriend: boolean;
  onCancelHandler?: (callId: string, userId: string) => void;
  onTimeoutHandler?: (callId: string, userId: string) => void;
}

class SocketService {
  public socket: CallSocket = null;

  @observable incomingCallData: LobbyCallEventDataExtended = null;

  @observable onlineUsers: Array<string> = [];

  @observable busyUsers: Array<string> = [];

  constructor() {
    makeObservable(this);

    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile && !this.socket) {
          this.init();
        }
      }
    );

    // TODO: find a better place to initialize token on the server and
    // if possible store it there
    reaction(
      () => APNServiceInstance.token,
      () => {
        if (this.socket) {
          this.sendTestNotification();
        }
      }
    );
  }

  private init = () => {
    this.socket = SocketIO(SERVER_BASE_URL, {
      query: `auth_token=${UserServiceInstance.token}&socketId=${UserServiceInstance.profile._id}-socket`,
    }) as CallSocket;

    if (APNServiceInstance.token) {
      this.sendTestNotification();
    }

    this.socket.on("connect", () => {
      const joinLobbyRequest: JoinLobbyRequest = {
        self_id: UserServiceInstance.profile._id,
        self_name: UserServiceInstance.profile.name,
        self_image: UserServiceInstance.profile.imageUrl || null,
        available: UserServiceInstance.profile.available,
      };

      this.socket.emit(ACTIONS.JOIN_LOBBY, joinLobbyRequest, ({ onlineUsers, busyUsers }) => {
        console.log("> You've joined the the Waiting Lobby");

        // check if we have an incoming call from APN
        // may need additional "reaction" to track it in some cases
        if (APNServiceInstance.incomingCallData) {
          this.initializeIncomingCall(APNServiceInstance.incomingCallData);
        }

        this.onlineUsers = onlineUsers;
        this.busyUsers = busyUsers;

        console.log("> Online users in the lobby: ", toJS(this.onlineUsers));
        console.log("> Busy users in the lobby: ", toJS(this.busyUsers));

        ContactsServiceInstance.updateContactListStatus(onlineUsers, busyUsers);
      });

      this.socket.on(CLIENT_ONLY_ACTIONS.LOBBY_CALL, (data) => {
        this.initializeIncomingCall(data);
      });

      this.socket.on(CLIENT_ONLY_ACTIONS.NOTIFICATION, (notification) => {
        console.log(`> You've got notifications from ${notification.user.name}. Notification: `, notification);

        switch (notification.type) {
          case NotificationTypes.ACCEPTED_INVITATION: {
            ContactsServiceInstance.fetchUserContacts(this.onlineUsers, this.busyUsers);

            NotificationServiceInstance.onMutualInvitationAcceptance(notification);
            break;
          }
          case NotificationTypes.REMOVED_FROM_CONTACTS:
            ContactsServiceInstance.fetchUserContacts(this.onlineUsers, this.busyUsers);
            break;
          default:
            NotificationServiceInstance.addNotification(notification);
        }
      });

      this.socket.on(CLIENT_ONLY_ACTIONS.USER_STATUS, ({ status, user_id }) => {
        if (status === "online") {
          const oldStatus = this.busyUsers.indexOf(user_id);
          if (oldStatus !== -1) {this.busyUsers.splice(oldStatus, 1);}

          this.onlineUsers.push(user_id);
        } else if (status === "busy") {
          const oldStatus = this.onlineUsers.indexOf(user_id);
          if (oldStatus !== -1) {this.onlineUsers.splice(oldStatus, 1);}

          this.busyUsers.push(user_id);
        } else if (status === "offline") {
          const oldOnlineStatus = this.onlineUsers.indexOf(user_id);
          if (oldOnlineStatus !== -1) {
            this.onlineUsers.splice(oldOnlineStatus, 1);
          } else {
            const oldBusyStatus = this.busyUsers.indexOf(user_id);
            if (oldBusyStatus !== -1) {this.busyUsers.splice(oldBusyStatus, 1);}
          }
        }

        if (ContactsServiceInstance.isContact(user_id)) {
          ContactsServiceInstance.updateContactStatus(user_id, status);
        }

        console.log("> Online users in lobby changed: ", toJS(this.onlineUsers));
        console.log("> Busy users in lobby changed: ", toJS(this.busyUsers));
      });
    });
  }

  private initializeIncomingCall = (data: LobbyCallEventData) => {
    console.log(`You've been called by ${data.caller_name} from room with id ${data.call_id}`);

    runInAction(() => {
      this.incomingCallData = {
        ...data,
        isFriend: ContactsServiceInstance.isContact(data.caller_id),
      };
      APNServiceInstance.resetIncomingCallData();
    });
  }

  public clearIncomingCallData = () => {
    this.incomingCallData = null;
  }

  public callRandomUser = (
    callId: string,
    callback: (data: LobbyCallResponse | ErrorData, error?: boolean) => void,
  ) => {
    if (!this.onlineUsers.length) {
      // no users in the lobby, make call via APN
      this.APNCall(callId, callback);
    } else {
      // there are online users in the lobby, prioritize them
      const randomOnlineUser = this.onlineUsers[Math.floor(Math.random() * this.onlineUsers.length)];

      this.callSpecificUser(callId, randomOnlineUser, callback, true);
    }
  }

  private APNCall = (
    callId: string,
    callback: (data: LobbyCallResponse | ErrorData, error?: boolean) => void,
  ) => {
    const requestData: APNCallRequest = { call_id: callId };

    this.socket.emit(ACTIONS.MAKE_APN_CALL, requestData, (data) => {
      if ("errorId" in data) {
        Alert.alert("Error", data.error);
        callback(null, true);
      } else {
        console.log(`> Trying to make APN call to ${data.participant_name}`);
        callback({
          ...data,
          isFriend: false,
          onCancelHandler: this.cancelAPNCallHandler,
          onTimeoutHandler: this.APNCallTimeoutHandler,
        });
      }
    });
  }

  private cancelAPNCallHandler = (callId: string, userId: string) => {
    console.log("> Cancelling APN call...");

    const requestData: APNCallCancel = { call_id: callId, user_id: userId };
    this.socket.emit(ACTIONS.CANCEL_APN_CALL, requestData, () => {
      console.log("> CANCEL_APN_CALL event success");
    });
  }

  private APNCallTimeoutHandler = (callId: string, userId: string) => {
    console.log("> APN call timeout...");

    const requestData: APNCallTimeout = { call_id: callId, user_id: userId };
    this.socket.emit(ACTIONS.APN_CALL_TIMEOUT, requestData, () => {
      console.log("> APN_CALL_TIMEOUT event success");
    });
  }

  public toggleAvailabilityStatus = () => {
    const request: SetCallAvailabilityRequest = {
      available: !UserServiceInstance.profile.available,
    };

    this.socket.emit(ACTIONS.SET_CALL_AVAILABILITY, request, () => {
      UserServiceInstance.profile.available = !UserServiceInstance.profile.available;
    });
  }

  public callSpecificUser = (
    callId: string,
    userId: string,
    callback: (data: LobbyCallResponse | ErrorData, error?: boolean) => void,
    isRandomCall = false,
  ) => {
    console.log(`MAKE_LOBBY_CALL to ${userId} (generated callId: ${callId})`);
    this.socket.emit(
      ACTIONS.MAKE_LOBBY_CALL, { call_id: callId, _id: userId, isRandomCall }, (data) => {
        if ("errorId" in data) {
          // TODO: playing of the audio
          // this.stopAudio();
          Alert.alert("Notification", data.error);
          callback(data);
        } else {
          console.log(`> Trying to call to ${data.participant_name}`);
          callback({
            ...data,
            isFriend: isRandomCall ? false : ContactsServiceInstance.isContact(data.participant_id),
          });
        }
      },
    );
  }

  public canCallToUser = (userId: string): boolean => this.onlineUsers.includes(userId);

  // Notifications management
  public sendAddToFriendInvitation = (
    target_id: string,
    callback: () => void,
  ) => {
    this.socket.emit(
      ACTIONS.SEND_INVITATION,
      {
        target_id,
        notification: createAddToFriednsInvitation({
          _id: UserServiceInstance.profile._id,
          name: UserServiceInstance.profile.name,
          imageUrl: UserServiceInstance.profile.imageUrl,
        }),
      },
      () => {
        console.log("> Invitation has been sent");
        callback();
      },
    );
  }

  public sendMissedCallNotification = () => {
    this.socket.emit(ACTIONS.SEND_MISSED_CALL_NOTIFICATION, {
      notification: createMissedCallNotification({
        _id: UserServiceInstance.profile._id,
        name: UserServiceInstance.profile.name,
        imageUrl: UserServiceInstance.profile.imageUrl,
      }),
    },
    () => {
      console.log("> Missed call notification has been sent to you");
    });
  }


  // Contact list managements
  public addContactAndNotify = async (userId: string, callback: () => void) => {
    try {
      if (await addUserToContactListRequest({ contactPerson: userId })) {
        Alert.alert("Notification", "User in your contacts now");
        this.socket.emit(
          ACTIONS.SEND_INVITATION_ACCEPTED,
          {
            target_id: userId,
            notification: createInvitationAcceptedNotification({
              _id: UserServiceInstance.profile._id,
              name: UserServiceInstance.profile.name,
              imageUrl: UserServiceInstance.profile.imageUrl,
            }),
          },
          () => {
            console.log("> Notifications (invitation accepted) has been sent");
            callback();
          },
        );
      }
    } catch (err) {
      Alert.alert("Notification", err.message);
    }
  };

  public removeContactAndNotify = async (userId: string): Promise<boolean> => {
    try {
      if (await removeUserFromContactListRequest({ contactPerson: userId })) {
        ContactsServiceInstance.removeContactFromList(userId);

        this.socket.emit(
          ACTIONS.SEND_REMOVED_FROM_CONTACTS,
          {
            target_id: userId,
            notification: createRemovedFromContactsNotification({
              _id: UserServiceInstance.profile._id,
              name: UserServiceInstance.profile.name,
              imageUrl: UserServiceInstance.profile.imageUrl,
            }),
          },
          () => {
            console.log("> User was removed from your contact list");
          },
        );

        return true;
      }
      Alert.alert("Notification", "Something went wrong while deleting a contact");
      return false;
    } catch (err) {
      Alert.alert("Notification", err.message);
      return false;
    }
  }

  private sendTestNotification = () => {
    const request: SendAPNDeviceIdRequest = {
      apnDeviceId: APNServiceInstance.token,
    };

    SocketServiceInstance.socket.emit(ACTIONS.SEND_APN_DEVICE_ID, request, () => {
      console.log("> APN token has been send to the server. Test notification will be send soon");
    });
  }
}

export const SocketServiceInstance = new SocketService();

export const SocketServiceContext = createContext(SocketServiceInstance);
