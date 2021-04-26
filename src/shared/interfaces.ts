import { ListRecordingItem } from "avcore";

export interface AuthResponse {
  token: string;
}

export interface OAuthGoogleRequest {
  tokenId: string;
  isIos?: boolean;
  isAndroid?: boolean;
}

export interface OAuthFacebookRequest {
  accessToken: string;
  userID: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
}

export interface UserProfileRequest {
  firebaseToken: string;
}

export interface ImportedContactItem {
  recordId: string;
  name: string;
  user: ContactItem;
}

interface UserExtraData {
  available: boolean;
  phone: string;
  verified: boolean;
  contactsImported: boolean;
  contacts: ImportedContactItem[];
}

export interface UserProfileResponse extends RegistrationRequest, UserProfileRequest, Document, UserExtraData {
  hints?: UserHint[];
}

export interface SendSMSRequest {
  phone: string;
}

export interface VerifyCodeRequest {
  code: string;
  phone: string;
}

export interface UpdatePhoneRequest {
  phone: string;
}

// TODO: most likely some user data has to be here
export interface SubscribeToFirebasePushesRequest {
  token: string;
}

export interface NotificationData {
  title: string;
  body: string;
  redirectUrl: string;
  callId: string;
  username: string;
}

export interface FirebaseNotificationRequest extends NotificationData {
  from: string;
}

/**
 * Firebase expects "[key: string]: string" type as a notification data
 */
export interface FirebaseNotificationDummyType {
  [key: string]: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Document {
  _id: string;
}

export interface BasicResponse {
  success: boolean;
}

export interface User extends Document, RegistrationRequest, UserProfileRequest, UserExtraData {}

export type ContactType = "in-app"|"imported";

export interface Contact extends Document, CreateContactRequest {}

export interface CreateContactRequest {
  contactPerson: string;
}

export interface ContactItem extends Document {
  name: string;
  imageUrl?: string;
}

export interface GetContactListResponse {
  contacts: ContactItem[];
}

export interface RemoveContactRequest {
  contactPerson: string;
}

/**
 * Contacts import
 */
export interface ContactImportItem {
  phones: Array<string>;
  name: string;
  recordId: string;
}

export interface ImportContactsRequest {
  contacts: Array<ContactImportItem>;
}

export interface ImportContactsResponse {
  updated: boolean;
  profile: UserProfileResponse
}
//

export interface GetUserDataResponse extends Document {
  name: string;
  email: string;
  imageUrl?: string;
}

export interface GetAllUsersResponse {
  users: User[];
}

export interface GetUserResponse {
  user: User;
}

export interface CloudCredentials {
  url: string;
  token: string;
}

export interface AvcoreAuthResponse {
  cloud: CloudCredentials;
}

/**
 * Notifications
 */
export enum NotificationTypes {
  INVITATION="invitation",
  ACCEPTED_INVITATION="acceptedInvitation",
  REMOVED_FROM_CONTACTS="removedFromContacts",
  NOTIFICATION="notification",
  MISSED_CALL="missedCall",
}

export type NotificationUser = ContactItem;

export interface NotificationRequest {
  header: string;
  body: string;
  user: NotificationUser;
  type: NotificationTypes;
  read?: boolean;
}

export interface Notification extends NotificationRequest, Document {}

export interface GetNotificationListResponse {
  notifications: Notification[];
}

export interface DeleteNotificationRequest {
  notification_id: string;
}

export interface CheckNotificationsRequest {
  notifications: string[];
}

/**
 * Comments
 */
export type CommentUser = ContactItem;

export interface CommentRequest {
  content: string;
  user: CommentUser;
  date: number;
  callId?: string;
  recordingIds?: Array<string>;
}

export interface Comment extends CommentRequest, Document {}

// Type that can be used in the following way in express: `req.query as GetAllCommentsQuery`
export interface GetAllCommentsQuery {
  callId: string;
  limit?: number;
  offset?: number;
}

export interface GetAllRecordCommentsQuery {
  recordId: string;
  limit?: number;
  offset?: number;
}

// Note: all the comments must be sorted by `date` from newest to oldest
// `amount` field is an amount of comments in the database for provided `callId`
export interface GetAllCommentsResponse {
  comments: Array<Comment>;
  amount: number;
}

export enum HintTypes {
  NOTIFICATION="notification",
  FEED="feed",
  FEED_PLAYER="feedPlayer",
}

export interface SetReadHintRequest {
  type: HintTypes;
}

export type SetReadHintResponse = UserProfileResponse;

export interface UserHint extends Document {
  type: HintTypes;
  seen: boolean;
}

/**
 * Recordings
 */
export interface CreateCallRecordingRequest {
  pipeId: string;
  callId: string;
  createDate?: number;
}

export interface PublishRecordingRequest {
  callId: string;
  participants: string[];
}

export type RecordUser = ContactItem;

export interface GetRecordResponse extends Document {
  list: ListRecordingItem[];
  createDate?: number;
  pipeId: string;
  callId: string;
  participants?: RecordUser[];
  user?: RecordUser;
}

export interface CallRecording extends Document, CreateCallRecordingRequest {
  list: ListRecordingItem[];
  user?: string;
  participiants?: string[];
}

export interface GetAllRecordsQuery {
  limit?: number;
  offset?: number;
}

export interface GetAllRecordsResponse {
  amount: number;
  recordings: Array<GetRecordResponse>;
}

export interface PipeId {
  pipeId: string;
}

/**
 * Logs
 */

export interface SendLogsRequest {
  userId: string;
  logs: string;
}

export interface LogOnServerRequest {
  log: string;
}
