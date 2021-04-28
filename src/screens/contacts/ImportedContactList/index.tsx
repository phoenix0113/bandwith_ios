import React, { useContext } from "react";
import { ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { BasicText, COLORS, SpinnerOverlayText } from "../../../components/styled";
import { Contact, ContactContent, ContactListContainer, ContactImage, ActionsOverlayContainer } from "../ContactList/styled";

import { ContactItemWithStatus, ContactsServiceContext, ContactsServiceInstance, ImportedContactItemWithStatus } from "../../../services/contacts";
import { getColor, getContactNumber } from "../utils";
import { ContactType } from "../../../shared/interfaces";

interface IProps {
  contacts: Array<ImportedContactItemWithStatus>;
  handleContactClick: (contact: ContactItemWithStatus, type: ContactType) => void;
}

export const ImportedContactListComponent = observer(({ contacts, handleContactClick }: IProps)  => {
  const { isImporting } = useContext(ContactsServiceContext);

  return (
    <ContactListContainer>
      <ActionsOverlayContainer onPress={ContactsServiceInstance.importUserContacts}>
        <Icon name="refresh" size={35} color={COLORS.WHITE} />
      </ActionsOverlayContainer>

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
          <Contact onPress={() => handleContactClick(contact.user, "imported")} key={contact.user._id}>
            <BasicText fontSize="12px" lineHeight="14px" letterSpacing="0.26px">{getContactNumber(index)}</BasicText>
            <ContactImage source={{ uri: contact.user.imageUrl || "DefaultProfileImage" }} />
            <ContactContent>
              <BasicText textAlign="left" fontWeight="700" fontSize="14px" lineHeight="24px" letterSpacing="0.26px">{contact.name}</BasicText>
              <BasicText textAlign="left" fontSize="12px" lineHeight="14px" letterSpacing="0.26px" color={getColor(contact.user.status)}>
                {contact.user.status}
              </BasicText>
            </ContactContent>
          </Contact>
        ))}
      </ScrollView>
    </ContactListContainer>
  );
});
