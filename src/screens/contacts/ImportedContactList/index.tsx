import React, { useContext, useState } from "react";
import { ScrollView, Modal } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Spinner from "react-native-loading-spinner-overlay";
import { observer } from "mobx-react";

import { BasicText, COLORS, SpinnerOverlayText, BasicButton, BasicButtonText } from "../../../components/styled";
import { Contact, ContactContent, ContactListContainer, ContactImage, ActionsOverlayContainer } from "../ContactList/styled";
import { ModalWrapper, ModalContent, ModalBody, ModalText, ModalFooter } from "../styled";

import { ContactItemWithStatus, ContactsServiceContext, ContactsServiceInstance, ImportedContactItemWithStatus } from "../../../services/contacts";
import { getColor, getContactNumber } from "../utils";
import { ContactType } from "../../../shared/interfaces";

interface IProps {
  contacts: Array<ImportedContactItemWithStatus>;
  handleContactClick: (contact: ContactItemWithStatus, type: ContactType) => void;
}

export const ImportedContactListComponent = observer(({ contacts, handleContactClick }: IProps)  => {
  const { importUserContacts } = useContext(ContactsServiceContext);
  const [showModal, setShowModal] = useState(false);
  const [imported, setImported] = useState(false);
  const onSubmit = () => {
    setShowModal(false);
    importUserContacts();
  }

  return (
    <>
      {
        (showModal) ? (
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setShowModal(false);
            }}
            visible={showModal}
            style={{alignItems: "center", display: "flex", }}
          >
            <ModalWrapper>
              <ModalContent>
                <ModalBody>
                  <ModalText>Some data will upload from your contacts to the server.</ModalText>
                </ModalBody>
                <ModalFooter>
                  <BasicButton onPress={onSubmit} width="100%">
                    <BasicButtonText>I agree</BasicButtonText>
                  </BasicButton>
                  <BasicButton onPress={() => setShowModal(false)} width="100%">
                    <BasicButtonText>Cancel</BasicButtonText>
                  </BasicButton>
                </ModalFooter>
              </ModalContent>
            </ModalWrapper>
          </Modal>
        ) : (
          <ContactListContainer>
            <ActionsOverlayContainer onPress={() => setShowModal(true)}>
              <Icon name="refresh" size={35} color={COLORS.WHITE} />
            </ActionsOverlayContainer>

            <Spinner
              visible={imported}
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
                    <BasicText textAlign="left" fontWeight="700" fontSize="14px" lineHeight="14px" letterSpacing="0.26px">{contact.name}</BasicText>
                    <BasicText margin="4px 0 3px 0" textAlign="left" fontSize="12px" lineHeight="12px" color={COLORS.GREY}>{`@${contact.user.name}`}</BasicText>
                    <BasicText textAlign="left" fontSize="12px" lineHeight="14px" letterSpacing="0.26px" color={getColor(contact.user.status)}>
                      {contact.user.status}
                    </BasicText>
                  </ContactContent>
                </Contact>
              ))}
            </ScrollView>
          </ContactListContainer>
        )
      }
    </>
  );
});
