import { createContext } from "react";
import SocketIO from "socket.io-client";
import { makeObservable, observable, reaction, runInAction, toJS } from "mobx";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";
import { ContactsServiceInstance } from "./contacts";
import { NotificationServiceInstance } from "./notifications";
import { APNServiceInstance } from "./APNs";
import { AppServiceInstance } from "./app";

import { CallSocket } from "../interfaces/Socket";
import { SERVER_BASE_URL } from "../utils/constants";
import {
 ACTIONS, APNCallCancel, APNCallRequest, APNCallTimeout, CLIENT_ONLY_ACTIONS, ErrorData, JoinLobbyRequest, LobbyCallEventData, MakeLobbyCallResponse, SendAPNDeviceIdRequest, SetCallAvailabilityRequest, SetOnlineStatus, SocketData,
} from "../shared/socket";
import { NotificationTypes } from "../shared/interfaces";
import { addUserToContactListRequest, removeUserFromContactListRequest } from "../axios/routes/contacts";
import { createAddToFriednsInvitation, createInvitationAcceptedNotification, createMissedCallNotification, createRemovedFromContactsNotification } from "../shared/utils";
import { logOnServerRequest } from "../axios/routes/logs";
import { showUnexpectedErrorAlert } from "../utils/notifications";

export interface LobbyCallEventDataExtended extends LobbyCallEventData {
  isFriend: boolean;
}

export interface LobbyCallResponse extends MakeLobbyCallResponse {
  isFriend: boolean;
  onCancelHandler?: (callId: string, userId: string) => void;
  onTimeoutHandler?: (callId: string, userId: string) => void;
}

let connectInterval = null;

class SocketService {
  public inCall = false;

  public socket: CallSocket = null;

  @observable incomingCallData: LobbyCallEventDataExtended = null;

  @observable onlineUsers: Array<string> = [];

  @observable busyUsers: Array<string> = [];

  @observable socketReconnectionTimestamp: number = null;

  public socketDisconnected = false;

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
          this.sendAPNToken();
        }
      }
    );

    reaction(
      () => AppServiceInstance.appState,
      () => {
        if (AppServiceInstance.appState === "inactive") {
          console.log("> Skipping status 'inactive'. New online status won't be send");
          return;
        }

        if (!UserServiceInstance.profile?.available) {
          console.log("> You set status 'Offline'. New online status won't be send");
          return;
        }
        if (this.inCall) {
          console.log("> You're in a call. New online status won't be send");
          return;
        }

        this.sendNewOnlineStatus();
      }
    );

    reaction(
      () => APNServiceInstance.incomingCallData,
      (incomingCallData) => {
        if (!incomingCallData) {
          return;
        }

        connectInterval = setInterval(() => {
          if (AppServiceInstance.appState === "background") {
            logOnServerRequest({log: "[CLIENT] [APN] waiting for app"});
          } else {
            if (this.socket && this.socket.connected) {
              logOnServerRequest({log: "[CLIENT] [APN] triggered after app state is active in reaction"});

              this.initializeIncomingCall(incomingCallData);
            }
            if (connectInterval) {
              clearInterval(connectInterval);
              connectInterval = null;
            }
          }
        }, 250);
      }
    );

    reaction(
      () => AppServiceInstance.canReconnect,
      (canReconnect) => {
        if (this.socket && canReconnect){
          this.fetchUserStatuses();
        }
      }
    );
  }

  private init = () => {
    this.socket = SocketIO(SERVER_BASE_URL, {
      query: `auth_token=${UserServiceInstance.token}&socketId=${UserServiceInstance.profile._id}-socket`,
      transports: ["websocket"],
      upgrade: false,
    }) as CallSocket;

    if (APNServiceInstance.token) {
      this.sendAPNToken();
    }

    this.socket.on("disconnect", () => {
      this.socketDisconnected = true;
    });

    this.socket.on("connect", () => {
      const joinLobbyRequest: JoinLobbyRequest = {
        self_id: UserServiceInstance.profile._id,
        self_name: UserServiceInstance.profile.name,
        self_image: UserServiceInstance.profile.imageUrl || null,
        available: UserServiceInstance.profile.available,
      };

      this.socket.emit(ACTIONS.JOIN_LOBBY, joinLobbyRequest, ({ onlineUsers, busyUsers }) => {
        runInAction(() => {
          this.socketReconnectionTimestamp = Date.now();
          this.socketDisconnected = false;
        });

        console.log("> You've joined the the Waiting Lobby");

        // check if we have an incoming call from APN
        if (APNServiceInstance.incomingCallData) {
          logOnServerRequest({log: "[CLIENT] [APN] triggered after lobby_join"});
          if (connectInterval) {
            clearInterval(connectInterval);
            connectInterval = null;
          }
          this.initializeIncomingCall(APNServiceInstance.incomingCallData);
        }

        this.handleUserStatusesList(onlineUsers, busyUsers);
      });
    });

    this.socket.on(CLIENT_ONLY_ACTIONS.LOBBY_CALL, (data) => {
      this.initializeIncomingCall(data);
    });

    this.socket.on(CLIENT_ONLY_ACTIONS.NOTIFICATION, async (notification) => {
      console.log(`> You've got notifications from ${notification.user.name}. Notification: `, notification);

      switch (notification.type) {
        case NotificationTypes.ACCEPTED_INVITATION: {
          NotificationServiceInstance.onMutualInvitationAcceptance(notification);

          await ContactsServiceInstance.fetchUserContacts(this.onlineUsers, this.busyUsers);
          this.fetchUserStatuses();

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

        const alreadyInOnline = this.onlineUsers.indexOf(user_id);
        if (alreadyInOnline === -1) {this.onlineUsers.push(user_id);}
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
  }

  private fetchUserStatuses = () => {
    const requestData: SocketData = { socketId: this.socket.id };
    this.socket.emit(ACTIONS.GET_LOBBY_USERS_STATUSES, requestData, ({busyUsers, onlineUsers}) => {
      this.handleUserStatusesList(onlineUsers, busyUsers);
    });
  }

  private handleUserStatusesList = (onlineUsers: Array<string>, busyUsers: Array<string>) => {
    this.onlineUsers = onlineUsers;
    this.busyUsers = busyUsers;

    console.log("> Online users in the lobby: ", toJS(this.onlineUsers));
    console.log("> Busy users in the lobby: ", toJS(this.busyUsers));

    ContactsServiceInstance.updateContactListStatus(onlineUsers, busyUsers);
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
        Alert.alert("APN call error", data.error);
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
          Alert.alert("Lobby call error", data.error);
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
            ContactsServiceInstance.fetchUserContacts(this.onlineUsers, this.busyUsers);

            callback();
          },
        );
      }
    } catch (err) {
      showUnexpectedErrorAlert("addContactAndNotify()", err.message);
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
      showUnexpectedErrorAlert("removeContactAndNotify()", "Something went wrong while deleting a contact");
      return false;
    } catch (err) {
      showUnexpectedErrorAlert("removeContactAndNotify()", err.message);
      return false;
    }
  }

  private sendAPNToken = () => {
    const request: SendAPNDeviceIdRequest = {
      apnDeviceId: APNServiceInstance.token,
    };

    SocketServiceInstance.socket.emit(ACTIONS.SEND_APN_DEVICE_ID, request, () => {
      console.log("> APN token has been send to the server. Test notification will be send soon");
    });
  }

  private sendNewOnlineStatus = () => {
    const request: SetOnlineStatus = {
      onlineStatus: AppServiceInstance.appState === "active" ? "online" : "offline",
    };

    this.socket.emit(ACTIONS.SET_ONLINE_STATUS, request, () => {
      console.log(`> New online status was sent: ${request.onlineStatus}`);
    });
  }
}

export const SocketServiceInstance = new SocketService();

export const SocketServiceContext = createContext(SocketServiceInstance);
