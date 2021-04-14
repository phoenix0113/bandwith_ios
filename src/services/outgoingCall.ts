import { createContext } from "react";
import { v4 as uuid } from "uuid";
import {observable, makeObservable, action, runInAction, toJS} from "mobx";
import { Alert } from "react-native";
import KeepAwake from "react-native-keep-awake";

import { AVCoreCall, CallType } from "./avcoreCall";
import { LobbyCallResponse, SocketServiceInstance } from "./socket";
import { MediaServiceInstance } from "./media";
import { logger } from "./logger";

import { ACTIONS, ErrorData, CLIENT_ONLY_ACTIONS } from "../shared/socket";
import { CallParticipantData, IncomingCallStatus, OutgoingCallStatus } from "../interfaces/call";
import { navigateToScreen } from "../navigation/helper";

class OutgoingCallService extends AVCoreCall {
  @observable status: OutgoingCallStatus = null;

  @observable callParticipantData: CallParticipantData = null;

  constructor() {
    super(CallType.OUTGOING);
    makeObservable(this);
    this.status = OutgoingCallStatus.INITIALIZED;
  }

  public makeCall = (userId: string = null) => {
    const callId = uuid();
    SocketServiceInstance.inCall = true;
    KeepAwake.activate();

    SocketServiceInstance.socket.emit(
      ACTIONS.JOIN_CALL,
      { callId, socketId: SocketServiceInstance.socket.id },
      async () => {
        console.log(`> You have joined room (as an initiator) with id ${callId}`);

        if (userId) {
          SocketServiceInstance.callSpecificUser(callId, userId, (data, error) => {
            if (error) {
              this.leaveCall(() => {
                this.resetService();
              });
            } else {
              this.handleCallCallback(data);
              runInAction(() => {
                this.callId = callId;
                MediaServiceInstance.playRingtone();
                navigateToScreen("OutgoingCall");
                this.status = OutgoingCallStatus.WAITING_FOR_PARTICIPANT;
              });
            }
          });
        } else {
          SocketServiceInstance.callRandomUser(callId, (data, error) => {
            if (error) {
              this.leaveCall(() => {
                this.resetService();
              });
            } else {
              this.handleCallCallback(data);
              runInAction(() => {
                this.callId = callId;
                MediaServiceInstance.playRingtone();
                navigateToScreen("OutgoingCall");
                this.status = OutgoingCallStatus.WAITING_FOR_PARTICIPANT;
              });
            }
          });
        }
      },
    );
    this.initListeners();
  }

  private initListeners = () => {
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

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.PARTICIPANT_DISCONNECTED, (data) => {
      console.log(`> Participant ${data.userId} was disconnected from the call ${data.callId} due to long absence`);
      Alert.alert("Notification", "Participant was disconnected from the call due to long absence");
      this.closeSubscribedStream();
      this.onReceiversFinish();
    });

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.SELF_DISCONNECTED, (data) => {
      console.log(`> You was disconnected from the call ${data.callId} due to long absence`);
      Alert.alert("Notification", "You was disconnected from the call due to long absence");

      this.closeSubscribedStream();

      // TODO: check if this is safe to call this function that includes already called on server events in socket.emit
      this.onReceiversFinish();
    });

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.CALL_ALREADY_FINISHED, (data) => {
      console.log(`> Call ${data.callId} was already finished by another participant`);
      Alert.alert("Notification", "The call was already finished by another participant");

      this.closeSubscribedStream();

      // TODO: check if this is safe to call this function that includes already called on server events in socket.emit
      this.onReceiversFinish();
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
        isFriend: data.isFriend,
        onCancelHandler: data.onCancelHandler,
        onTimeoutHandler: data.onTimeoutHandler,
      };
    }
  }

  public resetOutgoingCall = () => {
    this.resetService();
  }

  public noResponseHandler = () => {
    MediaServiceInstance.stopRingtone();

    if (this.callParticipantData && this.callParticipantData.onTimeoutHandler) {
      this.callParticipantData.onTimeoutHandler(this.callId, this.callParticipantData.id);
    }

    logger.log("info", "outgoingCall.ts", "Receiver didn't respond", true, true, true);
    this.setStatusAndNotify(OutgoingCallStatus.NO_RESPONSE, () => {
      this.leaveCall(() => {
        this.resetService();
      });
    });
  }

  public cancelCallHandler = () => {
    MediaServiceInstance.stopRingtone();

    if (this.callParticipantData && this.callParticipantData.onCancelHandler) {
      this.callParticipantData.onCancelHandler(this.callId, this.callParticipantData.id);
    }

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
    this.startAppStatusShare();
    this.startTrackingParticipantAppStatuses();
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
      this.stopTrackingParticipantAppStatuses();
      this.stopAppStatusShare();
      SocketServiceInstance.socket.off(ACTIONS.STREAM_START);
      SocketServiceInstance.socket.off(ACTIONS.STREAM_CHANGE);
      SocketServiceInstance.socket.off(ACTIONS.STREAM_STOP);
      SocketServiceInstance.socket.off(ACTIONS.JOIN_CALL);
      SocketServiceInstance.socket.off(ACTIONS.CALL_STATUS_FROM_RECEIVER);
      SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.PARTICIPANT_DISCONNECTED);
      SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.SELF_DISCONNECTED);
      SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.CALL_ALREADY_FINISHED);

      SocketServiceInstance.inCall = false;
      KeepAwake.deactivate();

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

    this.participantAppStatus = null;
    this.participantCallDetectorStatus = null;

    MediaServiceInstance.resetMedia();

    navigateToScreen("Main");

    logger.log("info", "outgoingCall.ts", "OutgoingCall service was reset. Redirecting to Main page...", true, true);
  }
}

export const OutgoingCallServiceInstance = new OutgoingCallService();

export const OutgoingCallServiceContext = createContext(OutgoingCallServiceInstance);
