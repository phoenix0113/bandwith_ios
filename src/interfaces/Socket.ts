import { Comment } from "../shared/interfaces";
import {
  ACTIONS,
  CLIENT_ONLY_ACTIONS,
  SocketClientCallData,
  StreamStartData,
  StreamStopData,
  CallInput,
  StreamStartRequest,
  StreamKindsCallData,
  StreamStopRequest,
  CallParticipants,
  CallStatusFromInitiator,
  CallStatusFromReceiver,
  JoinLobbyRequest,
  JoinLobbyResponse,
  LobbyCallEventData,
  ErrorData,
  SendInvitationRequest,
  SendInvitationAcceptedRequest,
  NotificationEventData,
  MakeLobbyCallRequest,
  MakeLobbyCallResponse,
  UserStatusEventData,
  SendRemovedFromContactsRequest,
  ViewerJoinedEventData,
  JoinAsViewerRequest,
  JoinAsViewerResponse,
  ViewerLeftEventData,
  MixerLayoutData,
  CommentEventData,
  SendCommentRequest,
  SendMissedCallNotificationRequest,
  LeaveRecordingCommentsRoomRequest,
  JoinRecordingCommentsRoomRequest,
  AppStatus,
  CallDetectorStatus,
  SelfDisconnectedEventData,
  ParticipantDisconnectedEventData,
  CallFinishedEventData,
  SendAPNDeviceIdRequest,
  APNCallRequest,
  APNCallCancel,
  APNCallTimeout,
  SetCallAvailabilityRequest,
  SetOnlineStatus,
  JoinCallSilent,
} from "../shared/socket";

export interface CallSocket extends SocketIOClient.Socket {
  on(event: "error", listener: (err: any) => void): this
  on(event: "connect", listener: () => void): this
  on(event: "disconnect", listener: () => void): this
  on(event: ACTIONS.JOIN_CALL, listener: (event: SocketClientCallData) => void): this
  on(
    event: CLIENT_ONLY_ACTIONS.VIEWER_JOINED,
    listener: (event: ViewerJoinedEventData) => void
  ): this
  on(event: CLIENT_ONLY_ACTIONS.VIEWER_LEFT, listener: (event: ViewerLeftEventData) => void): this
  on(
    event: ACTIONS.CALL_STATUS_FROM_INITIATOR,
     listener: (event: CallStatusFromInitiator) => void
  ): this
  on(
    event: ACTIONS.CALL_STATUS_FROM_RECEIVER,
    listener: (event: CallStatusFromReceiver) => void
  ): this
  on(
    event: ACTIONS.APP_STATUS,
    listener: (event: AppStatus) => void
  ): this
  on(
    event: ACTIONS.CALL_DETECTOR_STATUS,
    listener: (event: CallDetectorStatus) => void
  ): this
  on(event: ACTIONS.LEAVE_CALL, listener: (event: SocketClientCallData) => void): this
  on(event: CLIENT_ONLY_ACTIONS.LIVE_CALL_ENDED, listener: () => void): this
  on(event: ACTIONS.STREAM_START, listener: (event: StreamStartData) => void): this
  on(event: ACTIONS.STREAM_STOP, listener: (event: StreamStopData) => void): this
  on(event: ACTIONS.STREAM_CHANGE, listener: (event: StreamStartData) => void): this
  on(
    event: CLIENT_ONLY_ACTIONS.LOBBY_CALL,
    listener: (event: LobbyCallEventData) => void
  ): this
  on(
    event: CLIENT_ONLY_ACTIONS.NOTIFICATION,
    listener: (event: NotificationEventData) => void
  ): this
  on(event: CLIENT_ONLY_ACTIONS.USER_STATUS, listener: (event: UserStatusEventData) => void): this
  on(event: CLIENT_ONLY_ACTIONS.COMMENT, listener: (event: CommentEventData) => void): this
  on(
    event: CLIENT_ONLY_ACTIONS.SELF_DISCONNECTED,
    listener: (event: SelfDisconnectedEventData) => void
  ): this
  on(
    event: CLIENT_ONLY_ACTIONS.PARTICIPANT_DISCONNECTED,
    listener: (event: ParticipantDisconnectedEventData) => void
  ): this
  on(
    event: CLIENT_ONLY_ACTIONS.CALL_ALREADY_FINISHED,
    listener: (event: CallFinishedEventData) => void
  ): this
  emit(type: ACTIONS.JOIN_CALL, data: SocketClientCallData, callback: () => void): this
  emit(
    type: ACTIONS.JOIN_CALL_AS_VIEWER,
    data: JoinAsViewerRequest,
    callback: (data: JoinAsViewerResponse | ErrorData) => void
  ): this
  emit(type: ACTIONS.LEAVE_CALL, data: CallInput, callback: () => void): this
  emit(type: ACTIONS.LEAVE_CALL_AS_VIEWER, data: CallInput, callback: () => void): this
  emit(type: ACTIONS.STREAM_START, data: StreamStartRequest, callback: () => void): this
  emit(type: ACTIONS.STREAM_CHANGE, data: StreamKindsCallData, callback: () => void): this
  emit(type: ACTIONS.STREAM_STOP, data: StreamStopRequest, callback: () => void): this
  emit(
    type: ACTIONS.CALL_PARTICIPANTS,
    data: CallInput,
    callback: (data: CallParticipants) => void
  ): this
  emit(
    type: ACTIONS.CALL_STATUS_FROM_INITIATOR,
    data: CallStatusFromInitiator,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.CALL_STATUS_FROM_RECEIVER,
    data: CallStatusFromReceiver,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.APP_STATUS,
    data: AppStatus,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.CALL_DETECTOR_STATUS,
    data: CallDetectorStatus,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.JOIN_LOBBY,
    data: JoinLobbyRequest,
    callback: (data: JoinLobbyResponse) => void): this,
  emit(
    type: ACTIONS.MAKE_LOBBY_CALL,
    data: MakeLobbyCallRequest,
    callback: (data: MakeLobbyCallResponse | ErrorData) => void
  ): this
  emit(
    type: ACTIONS.MAKE_APN_CALL,
    data: APNCallRequest,
    callback: (data: MakeLobbyCallResponse | ErrorData) => void
  ): this
  emit(
    type: ACTIONS.CANCEL_APN_CALL,
    data: APNCallCancel,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.APN_CALL_TIMEOUT,
    data: APNCallTimeout,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SET_CALL_AVAILABILITY,
    data: SetCallAvailabilityRequest,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SET_ONLINE_STATUS,
    data: SetOnlineStatus,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SEND_INVITATION,
    data: SendInvitationRequest,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SEND_INVITATION_ACCEPTED,
    data: SendInvitationAcceptedRequest,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SEND_REMOVED_FROM_CONTACTS,
    data: SendRemovedFromContactsRequest,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SEND_MISSED_CALL_NOTIFICATION,
    data: SendMissedCallNotificationRequest,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.MIXER_LAYOUT,
    data: MixerLayoutData,
    callback: () => void
  ): this
  emit(
    type: ACTIONS.SEND_COMMENT,
    data: SendCommentRequest,
    callback: (comment: Comment) => void,
  ): this
  emit(
    type: ACTIONS.JOIN_RECORDING_COMMENTS_ROOM,
    data: JoinRecordingCommentsRoomRequest,
    callback: () => void,
  ): this
  emit(
    type: ACTIONS.LEAVE_RECORDING_COMMENTS_ROOM,
    data: LeaveRecordingCommentsRoomRequest,
    callback: () => void,
  ): this
  emit(
    type: ACTIONS.SEND_APN_DEVICE_ID,
    data: SendAPNDeviceIdRequest,
    callback: () => void,
  ): this
  emit(
    type: ACTIONS.JOIN_CALL_SILENT,
    data: JoinCallSilent,
    callback: () => void,
  ): this
}
