import React, { useState, useContext, useCallback } from "react";
import { observer } from "mobx-react";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { showUnexpectedErrorAlert } from "../../utils/notifications";

import {
  CenterItem, LeftItem, NavigationBar, PageWrapper, BasicText,
  RightItem, NavigationText, BasicSafeAreaView, COLORS,
 } from "../../components/styled";
import { ContactAccountComponent } from "./ContactAccount";

import { Contact, ContactContent, ContactListCOntainer, ContactImage } from "./styled";

import { OutgoingCallServiceInstance } from "../../services/outgoingCall";
import { ContactsServiceContext, ContactItemWithStatus } from "../../services/contacts";
import { SocketServiceContext, SocketServiceInstance } from "../../services/socket";
import { UserServiceInstance } from "../../services/user";


import { UserStatus } from "../../shared/socket";

const getContactNumber = (index: number) => `0${index + 1}`.slice(-2);

const getColor = (status: UserStatus): string => {
  switch (status) {
    case "online":
      return COLORS.ALTERNATIVE;
    case "offline":
      return COLORS.GREY;
    case "busy":
      return COLORS.ORANGE;
    default:
      return COLORS.GREY;
  }
};

export const ContactListScreen = observer(() => {
  const { removeContactAndNotify } = useContext(SocketServiceContext);
  const { contacts } = useContext(ContactsServiceContext);

  useFocusEffect(
    useCallback(() => {
      if (UserServiceInstance.profile) {
        SocketServiceInstance.refetchContacts();
      }
    }, [])
  );

  const [contactViewer, setContactViewer] = useState<ContactItemWithStatus>(null);

  const closeViewer = () => {
    setContactViewer(null);
  };

  const handleContactClick = (contact: ContactItemWithStatus) => {
    setContactViewer(contact);
  };

  const deleteContact = async (_id: string) => {
    try {
      if (await removeContactAndNotify(_id)) {
        closeViewer();
      }
    } catch (err) {
      showUnexpectedErrorAlert("screen.deleteContact()", err.message);
    }
  };

  const callContact = (_id: string) => {
    OutgoingCallServiceInstance.makeCall(_id);
    closeViewer();
  };

  if (contactViewer) {
    return (
      <ContactAccountComponent
        _id={contactViewer._id}
        imageUrl={contactViewer.imageUrl}
        name={contactViewer.name}
        status={contactViewer.status}
        deleteHandler={deleteContact}
        callHandler={callContact}
        closeHandler={closeViewer}
      />
    );
  }


  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>My Contacts</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <ContactListCOntainer>
        <ScrollView>
          {!!contacts.length && contacts.map((contact, index) => (
            <Contact onPress={() => handleContactClick(contact)} key={contact._id}>
              <BasicText fontSize="12px" lineHeight="14px" letterSpacing="0.26px">{getContactNumber(index)}</BasicText>
              <ContactImage source={{ uri: contact.imageUrl || "DefaultProfileImage" }} />
              <ContactContent>
                <BasicText textAlign="left" fontWeight="700" fontSize="14px" lineHeight="24px" letterSpacing="0.26px">{contact.name}</BasicText>
                <BasicText textAlign="left" fontSize="12px" lineHeight="14px" letterSpacing="0.26px" color={getColor(contact.status)}>
                  {contact.status}
                </BasicText>
              </ContactContent>
            </Contact>
          ))}
        </ScrollView>
        </ContactListCOntainer>

      </PageWrapper>
    </BasicSafeAreaView>
  );
});

