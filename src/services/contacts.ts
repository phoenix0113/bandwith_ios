/* eslint-disable prefer-destructuring */
import { makeObservable, observable, reaction } from "mobx";
import { createContext } from "react";
import Contacts from "react-native-contacts";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";
import { AppServiceInstance } from "./app";

import { getContactListRequest, importContactsRequest } from "../axios/routes/contacts";
import { ContactImportItem, ContactItem } from "../shared/interfaces";
import { UserStatus } from "../shared/socket";
import { showUnexpectedErrorAlert } from "../utils/notifications";

export interface ContactItemWithStatus extends ContactItem {
  status: UserStatus;
}

class ContactsService {
  private onReconnectActions: Array<Function> = [];

  @observable contacts: Array<ContactItemWithStatus> = [];

  @observable isImporting = false;

  constructor() {
    makeObservable(this);

    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile) {
          this.fetchUserContacts();

          if (!profile.contactsImported && !this.isImporting) {
            this.importUserContacts();
          } else {
            console.log("> Contacts have been already imported");
          }
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

  public importUserContacts = async () => {
    console.log("> Contacts import initiated");
    this.isImporting = true;

    try {
      const imported = await Contacts.getAll();
      const importedData: Array<ContactImportItem> = [];

      imported.forEach((contact) => {
        let name = "";
        if (contact.givenName) {
          name = contact.givenName;
        }
        if (contact.middleName) {
          name = `${name} ${contact.middleName}`;
        }
        if (contact.familyName) {
          name = `${name} ${contact.familyName}`;
        }
        if (!name && contact.displayName) {
          name = contact.displayName;
        }

        let phones = [];
        contact.phoneNumbers.forEach((item) => {
          phones.push(item.number.replace(/[^A-Z0-9]+/ig, ""));
        });
        if (name && phones.length) {
          importedData.push({
            name: name.trim(),
            phones,
            recordId: contact.recordID,
          });
        }
      });

      importedData.forEach((data) => {
        console.log(`${data.name}: ${data.phones}`);
      });

      const response = await importContactsRequest({ contacts: importedData });
      console.log("> Contacts import were performed. Response: ", response);


      if (response.updated) {
        Alert.alert("Contacts were imported", `Found ${response.profile.contacts.length} contacts with an installed app`);
      } else if (!response.updated && !UserServiceInstance.profile.contactsImported) {
        Alert.alert("Contacts were imported", "No one of your contacts has an app yet");
      } else if (!response.updated && UserServiceInstance.profile.contacts.length > response.profile.contacts.length) {
        Alert.alert("Contacts were imported", `Removed ${UserServiceInstance.profile.contacts.length} contacts from the list since they are no longer correspond to user's app`);
      } else {
        Alert.alert("Contacts already up to date");
      }

      UserServiceInstance.profile = response.profile;
    } catch (err) {
      showUnexpectedErrorAlert("importUserContacts()", err.message, err);
    } finally {
      this.isImporting = false;
    }
  }

  public fetchUserContacts = async (
    onlineUsers?: Array<string>,
    busyUsers?: Array<string>,
  ) => {
    try {
      console.log("> Fetching contact list");

      const oldContacts = [...this.contacts];

      const contacts = await getContactListRequest();

      this.contacts = contacts.map((contact) => {
        let status: UserStatus;
        if (oldContacts?.length) {
          const oldContactObject = oldContacts.find((c) => c._id === contact._id);
          if (oldContactObject) {
            status = oldContactObject.status;
          } else {
            status = "offline"; // setting a default value
          }
        } else {
          status = "offline"; // setting a default value
        }

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

