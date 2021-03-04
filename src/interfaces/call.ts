export interface CallParticipantData {
  name: string;
  id: string;
  image: string | null;
  socketId: string;
  isFriend: boolean;
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

export enum IncommingCallStatus {
  INITIALIZED,
  INCOMMING,
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
