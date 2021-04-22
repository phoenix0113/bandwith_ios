import React from "react";
import { ScrollView } from "react-native";

import { BasicText, COLORS } from "../../../components/styled";
import { Contact, ContactContent, ContactListContainer, ContactImage } from "./styled";

import { ContactItemWithStatus } from "../../../services/contacts";
import { ContactType } from "../../../shared/interfaces";
import { UserStatus } from "../../../shared/socket";

const item: Omit<ContactItemWithStatus, "_id"> = {
  name: "Serhii Pyrozhenko",
  status: "online",
  imageUrl: null,
};

const items = [];

for (let i = 0; i < 30; i++) {
  items.push({...item, _id: i});
}

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

export const ContactListComponent = ({ contacts, handleContactClick, type }: IProps)  => {
  return (
    <ContactListContainer>
      <ScrollView>
        {!!items.length && items.map((contact, index) => (
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
