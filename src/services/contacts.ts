/* eslint-disable prefer-destructuring */
import { makeObservable, observable, reaction } from "mobx";
import { createContext } from "react";
import Contacts from "react-native-contacts";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";
import { AppServiceInstance } from "./app";

import { getContactListRequest, importContactsRequest } from "../axios/routes/contacts";
import { ContactImportItem, ContactItem, ImportedContactItem } from "../shared/interfaces";
import { UserStatus } from "../shared/socket";
import { showUnexpectedErrorAlert } from "../utils/notifications";

export interface ContactItemWithStatus extends ContactItem {
  status: UserStatus;
}

export interface ImportedContactItemWithStatus extends Omit<ImportedContactItem, "user"> {
  user: ContactItemWithStatus;
}

class ContactsService {
  private onReconnectActions: Array<Function> = [];

  @observable contacts: Array<ContactItemWithStatus> = [];

  @observable importedContacts: Array<ImportedContactItemWithStatus> = [];

  @observable isImporting = false;

  public requestStatusUpdate: () => void = null;

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
            this.initializeImportedContacts();
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


      const difference = response.profile.contacts.length - UserServiceInstance.profile.contacts.length;

      if (response.updated && difference > 0) {
        Alert.alert("Contacts were imported", `Found ${difference} new contacts with an installed app`);
      } else if (!response.updated && !UserServiceInstance.profile.contactsImported) {
        Alert.alert("Contacts were imported", "No one of your contacts has an app yet");
      } else if (difference < 0) {
        Alert.alert("Contacts were imported", `Removed ${Math.abs(difference)} contacts from the list since they are no longer correspond to user's app`);
      } else {
        Alert.alert("Contacts already up to date");
      }

      UserServiceInstance.profile = response.profile;
      this.initializeImportedContacts();
    } catch (err) {
      showUnexpectedErrorAlert("importUserContacts()", err.message, err);
    } finally {
      this.isImporting = false;
    }
  }

  public initializeImportedContacts = () => {
    console.log("> Initializing imported contacts' statuses");
    const withStatuses: Array<ImportedContactItemWithStatus> = [];

    const oldImportedContacts = [...this.importedContacts];

    UserServiceInstance.profile.contacts.forEach((c) => {
      let status: UserStatus = "offline"; // default status
      if (oldImportedContacts) {
        const oldContactObject = oldImportedContacts.find((ic) => ic.user._id === c.user._id);
        if (oldContactObject) {
          status = oldContactObject.user.status;
        }
      }

      withStatuses.push({
        name: c.name,
        recordId: c.recordId,
        user: {
          ...c.user,
          status: status,
        },
      });
    });
    this.importedContacts = withStatuses;

    // requesting socket service to fetch and update statuses
    if (this.requestStatusUpdate) {
      this.requestStatusUpdate();
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
        let status: UserStatus = "offline";
        if (oldContacts?.length) {
          const oldContactObject = oldContacts.find((c) => c._id === contact._id);
          if (oldContactObject) {
            status = oldContactObject.status;
          }
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

    this.importedContacts.forEach((ic) => {
      if (onlineUsers.includes(ic.user._id)) {ic.user.status = "online";}
      if (busyUsers.includes(ic.user._id)) {ic.user.status = "busy";}
    });
    console.log("> Imported contacts statuses have been updated. Current imported contact list: ", this.importedContacts);
  }

  public updateContactStatus = (userId: string, status: UserStatus): void => {
    const targetContact = this.contacts.find((c) => c._id === userId);
    if (targetContact) {
      targetContact.status = status;
      console.log(`> Contact's (${targetContact.name}) status updated to ${status}`);
    }

    const targetImportedContact = this.importedContacts.find((ic) => ic.user._id === userId);
    if (targetImportedContact) {
      targetImportedContact.user.status = status;
      console.log(`> Imported contact's (${targetImportedContact.user.name}) status updated to ${status}`);
    }
  }

  public removeContactFromList = (userId: string): void => {
    this.contacts = this.contacts.filter((c) => c._id !== userId);
  }

  public isContact = (userId: string): boolean => !!this.contacts.find((c) => c._id === userId);

  public isImportedContact = (userId: string): boolean => !!this.importedContacts.find((ic) => ic.user._id === userId);

  private scheduleActions = (action: Function) => {
    this.onReconnectActions.push(action);
  }
}

export const ContactsServiceInstance = new ContactsService();

export const ContactsServiceContext = createContext(ContactsServiceInstance);

