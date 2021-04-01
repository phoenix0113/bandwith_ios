export interface CallParticipantData {
  name: string;
  id: string;
  image: string | null;
  isFriend: boolean;
  onCancelHandler?: (callId: string, userId: string) => void;
  onTimeoutHandler?: (callId: string, userId: string) => void;
}

export enum OutgoingCallStatus {
  INITIALIZED,
  WAITING_FOR_PARTICIPANT,
  ANSWERED_BY_PARTICIPANT,
  REJECTED_BY_PARTICIPANT,
  NO_RESPONSE,
  CANCELED,
  FINISHED,
}

export enum IncomingCallStatus {
  INITIALIZED,
  INCOMING,
  ACCEPT,
  REJECT,
  MISSED,
  CANCELED,
  FINISHED,
}

export enum LiveCallStatus {
  INITIALIZED,
  MISSED,
  FINISHED,
  IN_PROGRESS,
}
