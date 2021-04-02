import { createContext } from "react";
import {
  observable, makeObservable, runInAction, action, reaction, toJS,
} from "mobx";
import { Alert } from "react-native";

import { SocketServiceInstance, LobbyCallEventDataExtended } from "./socket";
import { AVCoreCall, CallType } from "./avcoreCall";
import { MediaServiceInstance } from "./media";
import { logger } from "./logger";

import { ACTIONS, CLIENT_ONLY_ACTIONS } from "../shared/socket";
import { CallParticipantData, IncomingCallStatus, OutgoingCallStatus } from "../interfaces/call";
import { navigateToScreen } from "../navigation/helper";

class IncomingCallService extends AVCoreCall {
  @observable status: IncomingCallStatus = null;

  @observable callParticipantData: CallParticipantData;

  constructor() {
    super(CallType.INCOMING);
    makeObservable(this);

    reaction(
      () => SocketServiceInstance.incomingCallData,
      (incomingCallData) => {
        if (incomingCallData) {
          SocketServiceInstance.inCall = true;
          logger.log("info", "incomingCall.ts", `Call is being initialized... Current status: ${this.status}`);
          if (this.status !== IncomingCallStatus.INCOMING) {
            this.status = IncomingCallStatus.INCOMING;
            navigateToScreen("IncomingCall");
            MediaServiceInstance.playRingtone();
            this.initializeCall(incomingCallData);
          }
        } else {
          logger.log("info", "incomingCall.ts", `Can't initialize call. Current service status: ${this.status}`, true, true);
        }
      },
    );

    this.status = IncomingCallStatus.INITIALIZED;
  }

  public initializeCall = (incomingCallData: LobbyCallEventDataExtended) => {
    runInAction(() => {
      console.log("> Call participant data: ", toJS(incomingCallData));
      logger.log("info", "incomingCall.ts", `Call participant data: ${incomingCallData.caller_id}|${incomingCallData.caller_name}`);

      this.callParticipantData = {
        id: incomingCallData.caller_id,
        name: incomingCallData.caller_name,
        image: incomingCallData.caller_image,
        isFriend: incomingCallData.isFriend,
      };
      this.callId = incomingCallData.call_id;
    });

    SocketServiceInstance.socket.emit(
      ACTIONS.JOIN_CALL, { callId: this.callId, socketId: SocketServiceInstance.socket.id }, () => {
        logger.log("info", "incomingCall.ts", `You have joined room (as a receiver) with id ${this.callId}`, true);
      },
    );

    this.initListeners();
  }

  private initListeners = () => {
    SocketServiceInstance.socket.on(ACTIONS.STREAM_START, (data) => {
      logger.log("info", "incomingCall.ts", `STREAM_START event with stream ${data.stream}. Subscribing...`, true);
      this.subscribeToStream(data.kinds, data.stream);
    });

    SocketServiceInstance.socket.on(ACTIONS.STREAM_CHANGE, (data) => {
      logger.log("info", "incomingCall.ts", `STREAM_CHANGE event with stream ${data.stream}. Updating subscription...`, true);
      this.updateSubscribedStream(data.kinds, data.stream);
    });

    SocketServiceInstance.socket.on(ACTIONS.STREAM_STOP, (data) => {
      logger.log("info", "incomingCall.ts", `STREAM_STOP event with stream ${data.stream}. Closing subscription...`, true);
      this.closeSubscribedStream();
    });

    SocketServiceInstance.socket.on(ACTIONS.CALL_STATUS_FROM_INITIATOR, ({ status }) => {
      switch (status) {
        case OutgoingCallStatus.CANCELED:
          logger.log("info", "incomingCall.ts", "Initiator canceled call", true, true);
          this.onInitiatorsCancel();
          break;
        case OutgoingCallStatus.NO_RESPONSE:
          logger.log("info", "incomingCall.ts", "Timeout (15sec) expired. Call was missed", true, true);
          this.onInitiatorsNoResponse();
          break;
        case OutgoingCallStatus.FINISHED:
          logger.log("info", "incomingCall.ts", "Call was finished by initiator", true, true);
          this.onInitiatorsFinished();
          break;
        default:
          throw new Error("> Unexpected call status");
      }
    });

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.PARTICIPANT_DISCONNECTED, ({ userId, callId }) => {
      console.log(`> Participant ${userId} was disconnected from the call ${callId} due to long absence`);
      Alert.alert("Notification", "Participant was disconnected from the call due to long absence");
      this.onInitiatorsFinished();
    });

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.SELF_DISCONNECTED, ({ callId }) => {
      console.log(`> You was disconnected from the call ${callId} due to long absence`);
      Alert.alert("Notification", "You was disconnected from the call due to long absence");

      this.closeSubscribedStream();

      // TODO: check if this is safe to call this function that includes already called on server events in socket.emit
      this.onInitiatorsFinished();
    });

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.CALL_ALREADY_FINISHED, ({ callId }) => {
      console.log(`> Call ${callId} was already finished by another participant`);
      Alert.alert("Notification", "The call was already finished by another participant");

      this.closeSubscribedStream();

      // TODO: check if this is safe to call this function that includes already called on server events in socket.emit
      this.onInitiatorsFinished();
    });
  }

  public resetIncomingCall = () => {
    this.resetService();
  }

  public onAcceptCall = () => {
    MediaServiceInstance.stopRingtone();
    this.setStatusAndNotify(IncomingCallStatus.ACCEPT, async () => {
      logger.log("info", "incomingCall.ts", "You acceped call. Starting a stream and init viewers tracker. ACCEPT status was sent", true, true);
      this.trackViewers();
      this.startAppStatusShare();
      this.startTrackingParticipantAppStatuses();
      this.startStreaming();
    });
  }

  public onRejectCall = () => {
    MediaServiceInstance.stopRingtone();
    this.setStatusAndNotify(IncomingCallStatus.REJECT, () => {
      logger.log("info", "incomingCall.ts", "You rejected call. REJECT status was sent", true, true);
      this.leaveCall(() => {
        this.resetService();
      });
    });
  }

  public endCall = () => {
    this.setStatusAndNotify(IncomingCallStatus.FINISHED, () => {
      logger.log("info", "incomingCall.ts", "Call was finished from your side. FINISHED status was sent", true, true);
      this.stopStreaming(() => {
        this.leaveCall();
      });
    });
  }

  @action private onInitiatorsCancel = () => {
    MediaServiceInstance.stopRingtone();
    this.status = IncomingCallStatus.CANCELED;
    this.leaveCall(() => {
      this.resetService();
    });
  }

  @action private onInitiatorsNoResponse = () => {
    MediaServiceInstance.stopRingtone();
    this.status = IncomingCallStatus.MISSED;
    this.leaveCall(() => {
      this.resetService();
    });
    SocketServiceInstance.sendMissedCallNotification();
  }

  @action private onInitiatorsFinished = () => {
    this.status = IncomingCallStatus.FINISHED;
    this.stopStreaming(() => {
      this.leaveCall();
    });
  }

  @action private setStatusAndNotify = (status: IncomingCallStatus, callback: () => void) => {
    this.status = status;
    SocketServiceInstance.socket.emit(
      ACTIONS.CALL_STATUS_FROM_RECEIVER,
      { status: this.status, socketId: SocketServiceInstance.socket.id, callId: this.callId },
      callback,
    );
  }

  @action private leaveCall = (callback?: () => void) => {
    SocketServiceInstance.socket.emit(ACTIONS.LEAVE_CALL, { callId: this.callId }, () => {
      logger.log("info", "incomingCall.ts", `You left the call room with id ${this.callId}`, true);

      this.stopTrackingViewers();
      this.stopTrackingParticipantAppStatuses();
      this.stopAppStatusShare();
      SocketServiceInstance.socket.off(ACTIONS.STREAM_START);
      SocketServiceInstance.socket.off(ACTIONS.STREAM_CHANGE);
      SocketServiceInstance.socket.off(ACTIONS.STREAM_STOP);
      SocketServiceInstance.socket.off(ACTIONS.CALL_STATUS_FROM_INITIATOR);
      SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.PARTICIPANT_DISCONNECTED);
      SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.SELF_DISCONNECTED);
      SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.CALL_ALREADY_FINISHED);

      SocketServiceInstance.inCall = false;

      logger.log("info", "incomingCall.ts", "All listeners and trackers were cleaned", true);

      if (callback) {
        callback();
      }
    });
  }

  @action private resetService = () => {
    this.status = IncomingCallStatus.INITIALIZED;
    this.callParticipantData = null;
    this.callId = null;

    this.participantAppStatus = null;
    this.participantCallDetectorStatus = null;

    SocketServiceInstance.clearIncomingCallData();
    MediaServiceInstance.resetMedia();

    navigateToScreen("Main");

    logger.log("info", "incomingCall.ts", "IncomingCall service was reset. Redirecting to Main page...", true, true);
  }
}

export const IncomingCallServiceInstance = new IncomingCallService();

export const IncomingCallServiceContext = createContext(IncomingCallServiceInstance);
