import { NotificationRequest, NotificationTypes, NotificationUser } from "./interfaces";

export const createAddToFriednsInvitation = (user: NotificationUser): NotificationRequest => ({
  header: "Friend invitation",
  body: `${user.name} has invited you`,
  type: NotificationTypes.INVITATION,
  user,
  read: false,
});

export const createInvitationAcceptedNotification = (
  user: NotificationUser,
): NotificationRequest => ({
  header: "Contact accepted",
  body: `${user.name} in your contacts now`,
  type: NotificationTypes.ACCEPTED_INVITATION,
  user,
  read: false,
});

export const createRemovedFromContactsNotification = (
  user: NotificationUser,
): NotificationRequest => ({
  header: "Removed from contacts",
  body: `${user.name} removed you from contact list`,
  type: NotificationTypes.REMOVED_FROM_CONTACTS,
  user,
  read: false,
});

export const createMissedCallNotification = (
  user: NotificationUser,
): NotificationRequest => ({
  header: "Missed call",
  body: `You missed call from ${user.name}`,
  type: NotificationTypes.MISSED_CALL,
  user,
  read: false,
});
