import { makeObservable, observable, reaction } from "mobx";
import { createContext } from "react";

import { UserServiceInstance } from "./user";

import { getContactListRequest } from "../axios/routes/contacts";
import { ContactItem } from "../shared/interfaces";
import { UserStatus } from "../shared/socket";
import { AppServiceInstance } from "./app";
import { showUnexpectedErrorAlert } from "../utils/notifications";

export interface ContactItemWithStatus extends ContactItem {
  status: UserStatus;
}

class ContactsService {
  private onReconnectActions: Array<Function> = [];

  @observable contacts: Array<ContactItemWithStatus> = [];

  constructor() {
    makeObservable(this);

    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile) {
          this.fetchUserContacts();
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

  public fetchUserContacts = async (
    onlineUsers?: Array<string>,
    busyUsers?: Array<string>,
  ) => {
    try {
      console.log("> Fetching contact list");

      const contacts = await getContactListRequest();

      this.contacts = contacts.map((contact) => {
        let status: UserStatus = "offline"; // setting a default value

        if (onlineUsers?.length || busyUsers?.length) {
          this.contacts.forEach((c) => {
            if (onlineUsers.includes(c._id)) {c.status = "online";}
            if (busyUsers.includes(c._id)) {c.status = "busy";}
          });
        }

        return {
          ...contact,
          status,
        };
      });
    } catch (err) {
      if (!AppServiceInstance.netAccessible) {
        this.scheduleActions(this.fetchUserContacts);
      } else {
        showUnexpectedErrorAlert("fetchUserContacts()", err.message);
      }
    }
  }

  public updateContactListStatus = (
    onlineUsers: Array<string>,
    busyUsers: Array<string>,
  ): void => {
    this.contacts.forEach((c) => {
      if (onlineUsers.includes(c._id)) {c.status = "online";}
      if (busyUsers.includes(c._id)) {c.status = "busy";}
    });
    console.log("> Contacts statuses have been updated. Current contact list: ", this.contacts);
  }

  public updateContactStatus = (userId: string, status: UserStatus): void => {
    const targetContact = this.contacts.find((c) => c._id === userId);
    if (targetContact) {
      targetContact.status = status;
      console.log(`> Contact's (${targetContact.name}) status updated to ${status}`);
    }
  }

  public removeContactFromList = (userId: string): void => {
    this.contacts = this.contacts.filter((c) => c._id !== userId);
  }

  public isContact = (userId: string): boolean => !!this.contacts.find((c) => c._id === userId)

  private scheduleActions = (action: Function) => {
    this.onReconnectActions.push(action);
  }
}

export const ContactsServiceInstance = new ContactsService();

export const ContactsServiceContext = createContext(ContactsServiceInstance);

