import { createContext } from "react";
import { v4 as uuid } from "uuid";
import { observable, makeObservable, action, runInAction, toJS } from "mobx";

import { AVCoreCall, CallType } from "./avcoreCall";
import { LobbyCallResponse, SocketServiceInstance } from "./socket";
import { MediaServiceInstance } from "./media";
import { logger } from "./logger";

import { ACTIONS, ErrorData } from "../shared/socket";
import { CallParticipantData, IncomingCallStatus, OutgoingCallStatus } from "../interfaces/call";

class OutgoingCallMobxService extends AVCoreCall {
  @observable status: OutgoingCallStatus = null;

  @observable callParticipantData: CallParticipantData = null;

  constructor() {
    super(CallType.OUTGOING);
    makeObservable(this);
    this.status = OutgoingCallStatus.INITIALIZED;

    setTimeout(() => {
      // this.makeCall();
    }, 5000);
  }

  public makeCall = (userId: string = null) => {
    const callId = uuid();

    SocketServiceInstance.socket.emit(
      ACTIONS.JOIN_CALL,
      { callId, socketId: SocketServiceInstance.socket.id },
      async () => {
        console.log(`> You have joined room (as an initiator) with id ${callId}`);

        if (userId) {
          SocketServiceInstance.callSpecificUser(callId, userId, (data) => {
            this.handleCallCallback(data);
          });
        } else {
          SocketServiceInstance.callRandomUser(callId, (data, error) => {
            if (error) {
              this.resetService();
            }
            this.handleCallCallback(data);
          });
        }

        runInAction(() => {
          this.callId = callId;
          MediaServiceInstance.playRingtone();
          this.status = OutgoingCallStatus.WAITING_FOR_PARTICIPANT;
        });
      },
    );

    SocketServiceInstance.socket.on(ACTIONS.JOIN_CALL, async (data) => {
      console.log(`> Socket ${data.socketId} joined ${data.callId} (receiver)`);
      logger.log("info", "outgoingCall.ts", `Socket ${data.socketId} joined ${data.callId} (receiver)`, true);
    });

    SocketServiceInstance.socket.on(ACTIONS.STREAM_START, (data) => {
      this.remoteStreamId = data.stream;
      logger.log("info", "outgoingCall.ts", `STREAM_START event with stream ${data.stream}. Subscribing...`, true);
      this.subscribeToStream(data.kinds, data.stream);
    });

    SocketServiceInstance.socket.on(ACTIONS.STREAM_CHANGE, (data) => {
      logger.log("info", "outgoingCall.ts", `STREAM_CHANGE event with stream ${data.stream}. Updating subscription...`, true);
      this.updateSubscribedStream(data.kinds, data.stream);
    });

    SocketServiceInstance.socket.on(ACTIONS.STREAM_STOP, (data) => {
      logger.log("info", "outgoingCall.ts", `STREAM_STOP event with stream ${data.stream}. Closing subscription...`, true);
      this.closeSubscribedStream();
    });

    SocketServiceInstance.socket.on(ACTIONS.CALL_STATUS_FROM_RECEIVER, ({ status }) => {
      switch (status) {
        case IncomingCallStatus.ACCEPT:
          logger.log("info", "outgoingCall.ts", "Call was accepted by receiver", true, true);
          this.onReceiversAccept();
          break;
        case IncomingCallStatus.REJECT:
          logger.log("info", "outgoingCall.ts", "Call was rejected by receiver", true, true, true);
          this.onReceiversReject();
          break;
        case IncomingCallStatus.FINISHED:
          logger.log("info", "outgoingCall.ts", "Call was finished by receiver", true, true);
          this.onReceiversFinish();
          break;
        default:
          throw new Error("> Unexpected call status");
      }
    });
  }

  private handleCallCallback = (data: LobbyCallResponse | ErrorData) => {
    if (!data || "errorId" in data) {
      this.leaveCall(() => {
        this.resetService();
      });
    } else {
      console.log("> Call participant data: ", toJS(data));
      this.callParticipantData = {
        id: data.participant_id,
        name: data.participant_name,
        image: data.participant_image,
        socketId: data.participant_socket,
        isFriend: data.isFriend,
      };
    }
  }

  public resetOutgoingCall = () => {
    this.resetService();
  }

  public noResponseHandler = () => {
    MediaServiceInstance.stopRingtone();
    logger.log("info", "outgoingCall.ts", "Receiver didn't respond", true, true, true);
    this.setStatusAndNotify(OutgoingCallStatus.NO_RESPONSE, () => {
      this.leaveCall(() => {
        this.resetService();
      });
    });
  }

  public cancelCallHandler = () => {
    MediaServiceInstance.stopRingtone();
    logger.log("info", "outgoingCall.ts", "You canceled the call", true, true);
    this.setStatusAndNotify(OutgoingCallStatus.CANCELED, () => {
      this.leaveCall(() => {
        this.resetService();
      });
    });
  }

  public endCallHandler = () => {
    this.setStatusAndNotify(OutgoingCallStatus.FINISHED, () => {
      logger.log("info", "outgoingCall.ts", "Call was finished from your side", true, true);
      this.stopStreaming(() => {
        this.leaveCall();
      });
    });
  }

  @action private onReceiversAccept = () => {
    MediaServiceInstance.stopRingtone();

    this.status = OutgoingCallStatus.ANSWERED_BY_PARTICIPANT;

    this.trackViewers();
    this.startStreaming();
  }

  @action private onReceiversReject = () => {
    MediaServiceInstance.stopRingtone();

    this.status = OutgoingCallStatus.REJECTED_BY_PARTICIPANT;
    this.leaveCall(() => {
      this.resetService();
    });
  }

  @action private onReceiversFinish = () => {
    this.status = OutgoingCallStatus.FINISHED;
    this.stopStreaming(() => {
      this.leaveCall();
    });
  }

  @action private setStatusAndNotify = (status: OutgoingCallStatus, callback: () => void) => {
    this.status = status;
    SocketServiceInstance.socket.emit(
      ACTIONS.CALL_STATUS_FROM_INITIATOR,
      { status: this.status, socketId: SocketServiceInstance.socket.id, callId: this.callId },
      callback,
    );
  }

  @action private leaveCall = (callback?: () => void) => {
    SocketServiceInstance.socket.emit(ACTIONS.LEAVE_CALL, { callId: this.callId }, () => {
      logger.log("info", "outgoingCall.ts", `You left the call room with id ${this.callId}`, true);

      this.stopTrackingViewers();
      SocketServiceInstance.socket.off(ACTIONS.STREAM_START);
      SocketServiceInstance.socket.off(ACTIONS.STREAM_CHANGE);
      SocketServiceInstance.socket.off(ACTIONS.JOIN_CALL);
      SocketServiceInstance.socket.off(ACTIONS.CALL_STATUS_FROM_RECEIVER);

      logger.log("info", "outgoingCall.ts", "All listeners and trackers were cleaned", true, true);

      if (callback) {
        callback();
      }
    });
  }

  @action private resetService = () => {
    this.status = OutgoingCallStatus.INITIALIZED;
    this.callParticipantData = null;
    this.callId = null;

    MediaServiceInstance.resetMedia();

    logger.log("info", "outgoingCall.ts", "OutgoingCall service was reset. Redirecting to Home page...", true, true);
  }
}

export const OutgoingCallStorage = new OutgoingCallMobxService();

export const OutgoingCallStorageContext = createContext(OutgoingCallStorage);
