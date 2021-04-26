import React, { useContext } from "react";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { BasicText, COLORS, SpinnerOverlayText } from "../../../components/styled";
import { Contact, ContactContent, ContactListContainer, ContactImage, ActionsOverlayContainer } from "./styled";

import { ContactItemWithStatus, ContactsServiceContext, ContactsServiceInstance } from "../../../services/contacts";
import { ContactType } from "../../../shared/interfaces";
import { UserStatus } from "../../../shared/socket";

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


interface IProps {
  contacts: Array<ContactItemWithStatus>;
  handleContactClick: (contact: ContactItemWithStatus) => void;
  type: ContactType;
}

export const ContactListComponent = observer(({ contacts, handleContactClick, type }: IProps)  => {
  const { isImporting } = useContext(ContactsServiceContext);

  console.log(contacts);

  return (
    <ContactListContainer>
      {type === "imported" && (
        <ActionsOverlayContainer onPress={ContactsServiceInstance.importUserContacts}>
          <Icon name="refresh" size={35} color={COLORS.WHITE} />
        </ActionsOverlayContainer>
      )}

      <Spinner
        visible={isImporting}
        textContent="Importing..."
        textStyle={SpinnerOverlayText.text}
        size="large"
        color={COLORS.WHITE}
        overlayColor={COLORS.BLACK}
        animation="fade"
      />


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
    </ContactListContainer>
  );
});
