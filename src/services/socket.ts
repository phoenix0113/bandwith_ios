import { createContext } from "react";
import SocketIO from "socket.io-client";
import { makeObservable, observable, reaction, runInAction, toJS } from "mobx";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";
import { ContactsServiceInstance } from "./contacts";
import { NotificationServiceInstance } from "./notifications";

import { CallSocket } from "../interfaces/Socket";
import { SERVER_BASE_URL } from "../utils/constants";
import { ACTIONS, CLIENT_ONLY_ACTIONS, ErrorData, LobbyCallEventData, MakeLobbyCallResponse } from "../shared/socket";
import { NotificationTypes } from "../shared/interfaces";
import { addUserToContactListRequest, removeUserFromContactListRequest } from "../axios/routes/contacts";
import { ALL_USERS_ARE_UNAVAILABLE } from "../shared/errors";
import { createAddToFriednsInvitation, createInvitationAcceptedNotification, createMissedCallNotification, createRemovedFromContactsNotification } from "../shared/utils";

export interface LobbyCallEventDataExtended extends LobbyCallEventData {
  isFriend: boolean;
}

export interface LobbyCallResponse extends MakeLobbyCallResponse {
  isFriend: boolean;
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
  }

  private init = () => {
    this.socket = SocketIO(SERVER_BASE_URL, {
      query: `auth_token=${UserServiceInstance.token}&socketId=${UserServiceInstance.profile._id}-socket`,
    }) as CallSocket;

    this.socket.on("connect", () => {
      this.socket.emit(ACTIONS.JOIN_LOBBY, {
        self_id: UserServiceInstance.profile._id,
        self_name: UserServiceInstance.profile.name,
        self_image: UserServiceInstance.profile.imageUrl || null,
      },
      ({ onlineUsers, busyUsers }) => {
        console.log("> You've joined the the Waiting Lobby");

        this.onlineUsers = onlineUsers;
        this.busyUsers = busyUsers;

        console.log("> Online users in the lobby: ", toJS(this.onlineUsers));
        console.log("> Busy users in the lobby: ", toJS(this.busyUsers));

        ContactsServiceInstance.updateContactListStatus(onlineUsers, busyUsers);
      });

      this.socket.on(CLIENT_ONLY_ACTIONS.LOBBY_CALL, (data) => {
        console.log("info", "global.ts", `You've been called by ${data.caller_name} from room with id ${data.call_id}`, true, true);

        runInAction(() => {
          this.incomingCallData = {
            ...data,
            isFriend: ContactsServiceInstance.isContact(data.caller_id),
          };
        });
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

  public clearIncomingCallData = () => {
    this.incomingCallData = null;
  }

  public callRandomUser = (
    callId: string,
    callback: (data: LobbyCallResponse | ErrorData, error?: boolean) => void,
  ) => {
    if (!this.onlineUsers.length) {
      Alert.alert("Notification", ALL_USERS_ARE_UNAVAILABLE);
      callback(null, true);
      return;
    }

    const randomOnlineUser = this.onlineUsers[Math.floor(Math.random() * this.onlineUsers.length)];

    this.callSpecificUser(callId, randomOnlineUser, callback, true);
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
}

export const SocketServiceInstance = new SocketService();

export const SocketServiceContext = createContext(SocketServiceInstance);
