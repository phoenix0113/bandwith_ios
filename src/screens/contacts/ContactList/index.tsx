import React from "react";
import { ScrollView } from "react-native";

import { BasicText } from "../../../components/styled";
import { Contact, ContactContent, ContactListContainer, ContactImage } from "./styled";

import { ContactItemWithStatus } from "../../../services/contacts";
import { getColor, getContactNumber } from "../utils";

interface IProps {
  contacts: Array<ContactItemWithStatus>;
  handleContactClick: (contact: ContactItemWithStatus) => void;
}

export const ContactListComponent = ({ contacts, handleContactClick }: IProps)  => {
  return (
    <ContactListContainer>
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
};
