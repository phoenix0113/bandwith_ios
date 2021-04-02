import { OutgoingCallStatus, IncomingCallStatus } from "../interfaces/call";
import { NotificationRequest, Notification, CommentRequest, Comment } from "./interfaces";

export const LOBBY_ROOM = "lobby_room";

export enum ACTIONS {
  JOIN_LOBBY = "joinLobby",
  MAKE_LOBBY_CALL = "makeLobbyCall",
  STREAM_START = "streamStart",
  STREAM_STOP = "streamStop",
  STREAM_CHANGE = "streamChange",
  JOIN_CALL = "joinCall",
  LEAVE_CALL = "leaveCall",
  JOIN_CALL_AS_VIEWER = "joinCallAsViewer",
  LEAVE_CALL_AS_VIEWER = "leaveCallAsViewer",
  CALL_PARTICIPANTS = "callParticipants",
  CALL_STATUS_FROM_INITIATOR = "initiatorCallStatus",
  CALL_STATUS_FROM_RECEIVER = "receiverCallStatus",
  APP_STATUS = "appStatus",
  CALL_DETECTOR_STATUS = "callDetectorStatus",
  SEND_INVITATION = "sendInvitation",
  SEND_INVITATION_ACCEPTED = "sendInvitationAccepted",
  SEND_REMOVED_FROM_CONTACTS = "sendRemovedFromContacts",
  SEND_MISSED_CALL_NOTIFICATION = "sendMissedCallNotification",
  MIXER_LAYOUT = "mixerLayout",
  SEND_COMMENT= "sendComment",
  JOIN_RECORDING_COMMENTS_ROOM="joinRecordingCommentsRoom",
  LEAVE_RECORDING_COMMENTS_ROOM="leaveRecordingCommentsRoom",
  SEND_APN_DEVICE_ID="sendApnDeviceId",
  MAKE_APN_CALL="makeApnCall",
  APN_CALL_TIMEOUT="apnCallTimeout",
  CANCEL_APN_CALL="cancelApnCall",
  SET_CALL_AVAILABILITY="setCallAvailability",
  SET_ONLINE_STATUS="setOnlineStatus",
}

/**
 * Actions that will be used by socket.io on the server, but won't be implemented by its class
 */
export enum CLIENT_ONLY_ACTIONS {
  LOBBY_CALL="lobbyCall",
  NOTIFICATION="notification",
  VIEWER_JOINED="viewerJoined",
  VIEWER_LEFT="viewerLeft",
  LIVE_CALL_ENDED="liveCallEnded",
  COMMENT="comment",
  USER_STATUS="userStatus",
  PARTICIPANT_DISCONNECTED="participantDisconnected",
  SELF_DISCONNECTED="selfDisconnected",
  CALL_ALREADY_FINISHED="callAlreadyFinished"
}

/**
 * General
 */
export enum ERROR { UNKNOWN }

export interface ErrorData {
  errorId: ERROR
  error?: any
}

export type Kinds = ("audio"|"video")[];

export interface CallInput {
  callId: string;
}

export interface SocketData {
  socketId: string;
}

export interface CallParticipants {
  participants: SocketData[];
}

export interface SocketClientCallData extends SocketData, CallInput {}

export interface MixerLayoutData extends CallInput{
  layout:LAYOUT
  streamsMap?:{[x:string]:number}
}

/**
 * Lobby manangement
 */

interface SelfData {
  self_id: string;
  self_name: string;
  self_image: string;
}

export interface ParticipantData {
  participant_id: string;
  participant_name: string;
  participant_image: string;
}

export interface JoinLobbyRequest extends SelfData {
  available: boolean;
}

export interface JoinLobbyResponse {
  onlineUsers: Array<string>;
  busyUsers: Array<string>;
}

export interface MakeLobbyCallRequest {
  call_id: string;
  _id: string;
  isRandomCall: boolean;
}

export type MakeLobbyCallResponse = ParticipantData;

export interface LobbyCallEventData {
  caller_id: string;
  caller_name: string;
  caller_image: string;
  call_id: string;
}

export type UserStatus = "online" | "offline" | "busy";

export interface UserStatusEventData {
  user_id: string;
  status: UserStatus;
}

export interface SendAPNDeviceIdRequest {
  apnDeviceId: string;
}

export interface APNCallRequest {
  call_id: string;
}

export interface APNCallTimeout extends APNCallRequest {
  user_id: string;
}

export type APNCallCancel = APNCallTimeout;

export interface SetCallAvailabilityRequest {
  available: boolean;
}

export interface SetOnlineStatus {
  onlineStatus: UserStatus;
}

/**
 * Notifications (works in "lobby" room)
 */

interface BasicNotificationRequest {
  notification: NotificationRequest;
  target_id: string;
}

export type SendInvitationRequest = BasicNotificationRequest

export type SendInvitationAcceptedRequest = BasicNotificationRequest;

export type SendRemovedFromContactsRequest = BasicNotificationRequest;

export type SendMissedCallNotificationRequest = {
  notification: NotificationRequest;
};

export type NotificationEventData = Notification;

/**
 * Call status control
 */
export interface CallStatusFromInitiator extends SocketData, CallInput {
  status: OutgoingCallStatus;
}

export interface CallStatusFromReceiver extends SocketData, CallInput {
  status: IncomingCallStatus;
}

export type AppStatusType = "active" | "background" | "inactive" | "unknown" | "extension";

export type CallDetectorStatusType = "Incoming" | "Connected" | "Disconnected";

export interface AppStatus extends CallInput {
  appStatus: AppStatusType;
}

export interface CallDetectorStatus extends CallInput {
  callDetectorStatus: CallDetectorStatusType;
}

export interface ParticipantDisconnectedEventData extends SocketData, CallInput {
  userId: string;
}

export type SelfDisconnectedEventData = CallInput

export type CallFinishedEventData = CallInput

/**
 * Avcore stream management
 */
export interface StreamData {
    stream:string
}
export interface StreamKindsData extends StreamData {
    kinds: Kinds
}
export interface StreamKindsCallData extends StreamKindsData, CallInput {}

export type StreamStartRequest = StreamKindsCallData

export interface StreamStopRequest extends StreamData, CallInput {}

export interface StreamStartData extends SocketData, StreamKindsCallData {}

export interface StreamStopData extends StreamStopRequest, SocketData {}

/**
 * Mixer layout management
 */
export enum LAYOUT {
  GRID_1,
  GRID_2,
}

/**
 * LIVE calls
 */
export interface JoinAsViewerRequest {
  callId: string;
}

export interface JoinAsViewerResponse {
  firstParticipant: ParticipantData;
  secondParticipant: ParticipantData;
}

export type ViewerJoinedEventData = ParticipantData;

export type ViewerLeftEventData = ParticipantData;

export enum JoinAsViewerErrors {
  NO_PARTICIPANTS="The call isn't live anymore"
}

/**
 * Comments
 */
export type SendCommentRequest = CommentRequest;

export type CommentEventData = Comment;

/**
 * Recordings rooms
 */
export interface JoinRecordingCommentsRoomRequest {
  recordingId: string;
}

export type LeaveRecordingCommentsRoomRequest = JoinRecordingCommentsRoomRequest;
