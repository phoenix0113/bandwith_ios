import { observable, action, makeObservable, reaction, runInAction } from "mobx";
import { API_OPERATION } from "avcore";
import { ConferenceApi } from "avcore/client";
import { v4 as uuid } from "uuid";
import { xor } from "lodash";
import { MediaStream, MediaStreamTrack, mediaDevices } from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";

import { SocketServiceInstance } from "./socket";
import { MediaServiceInstance } from "./media";
import { logger } from "./logger";
import { UserServiceInstance } from "./user";
import { AppServiceInstance } from "./app";

import {
  ACTIONS, AppStatus, AppStatusType, CallDetectorStatus,
  CallDetectorStatusType, CLIENT_ONLY_ACTIONS, Kinds, LAYOUT, MixerLayoutData,
} from "../shared/socket";

export enum CallType {
  OUTGOING,
  INCOMING,
}

interface TrackEvent {
  track: MediaStreamTrack;
}

export class AVCoreCall {
  protected callType: CallType = null;

  public callId: string = null;

  private capture: ConferenceApi = null;

  @observable playback: ConferenceApi = null;

  private streamingKinds: Kinds = null;

  @observable videoStream: MediaStream = null;

  private audioStream: MediaStream = null;

  protected localStreamId: string = null;

  private localStream: MediaStream = null;

  protected remoteStreamId: string = null;

  private remoteStream: MediaStream = null;

  @observable remoteVideoStream: MediaStream = null;

  private oldAudioTracks: Array<MediaStreamTrack> = [];

  private shouldShareAppStatus = false;

  @observable participantAppStatus: AppStatusType = null;

  @observable participantCallDetectorStatus: CallDetectorStatusType = null;

  constructor(type: CallType) {
    this.callType = type;

    makeObservable(this);

    /**
     * Tracks changes in `kinds` inside the GlobalStorage and
     * initiates streaming update if it was published
     */
    reaction(
      () => MediaServiceInstance.kinds,
      (kinds) => {
        if (this.capture && this.localStream && this.localStreamId) {
          this.updateStreaming(kinds);
        }
      },
    );

    reaction(
      () => MediaServiceInstance.cameraMode,
      () => {
        if (this.capture && this.videoStream) {
          this.updateStreamingCameraMode();
        }
      },
    );

    reaction(
      () => MediaServiceInstance.volume,
      (volume) => {
        this.toggleVolume(volume);
      }
    );

    reaction(
      () => AppServiceInstance.appState,
      () => {
        if (this.shouldShareAppStatus) {
          this.shareAppStatus();
        }
      }
    );

    reaction(
      () => AppServiceInstance.callDetectorStatus,
      () => {
        if (this.shouldShareAppStatus) {
          this.shareCallDetectorStatus();
        }
      }
    );
  }

  protected trackViewers = (): void => {
    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.VIEWER_JOINED, ({ participant_name }) => {
      console.log(`Viewer ${participant_name} joined the call`);
    });

    SocketServiceInstance.socket.on(CLIENT_ONLY_ACTIONS.VIEWER_LEFT, ({ participant_name }) => {
      console.log(`Viewer ${participant_name} left the call`);
    });
  }

  protected stopTrackingViewers = (): void => {
    SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.VIEWER_JOINED);
    SocketServiceInstance.socket.off(CLIENT_ONLY_ACTIONS.VIEWER_LEFT);
  }

  protected startStreaming = async (): Promise<void> => {
    try {
      const kinds = MediaServiceInstance.generateKindsFromMedia();

      logger.log("info", "avcoreCall.ts", "createMediaStreams call", true);

      await this.createMediaStreams(kinds);

      logger.log("info", "avcoreCall.ts", "createMediaStreams finished", true);

      logger.log("info", "avcoreCall.ts", `avcoreCloudClient.create(PUBLISH, localstream id = ${this.localStreamId})`, true);

      const capture = await UserServiceInstance.avcoreCloudClient.create(
        API_OPERATION.PUBLISH,
        this.localStreamId,
        {
          kinds,
          simulcast: true,
          maxIncomingBitrate: 400000,
          // @ts-ignore
          deviceHandlerName: "ReactNative",
        },
      );

      logger.log("info", "avcoreCall.ts", "capture.publish call", true);

      await capture.publish(this.localStream);

      logger.log("info", "avcoreCall.ts", "capture.publish finished", true);

      runInAction(() => {
        this.capture = capture;
        this.streamingKinds = kinds;
      });

      logger.log("info", "avcoreCall.ts", "emiting ACTIONS.STREAM_START", true);

      SocketServiceInstance.socket.emit(ACTIONS.STREAM_START, {
        callId: this.callId,
        stream: this.localStreamId,
        kinds,
      }, () => {
        logger.log("info", "avcoreCall.ts", `You've published stream with id ${this.localStreamId}. Playing: [${kinds}]. Room participants was notified`, true, true);

        if (this.callType === CallType.OUTGOING) {
          this.sendMixerLayout();
        }
      });
    } catch (err) {
      logger.log("error", "avcoreCall.ts", err.message, true, true, true);
    }
  }

  @action protected stopStreaming = (callback?: () => void): void => {
    if (this.capture) {
      this.capture.close();
    }
    this.capture = null;

    logger.log("info", "avcoreCall.ts", "Capture was closed. Emiting STREAM_STOP", true);

    SocketServiceInstance.socket.emit(ACTIONS.STREAM_STOP, {
      callId: this.callId,
      stream: this.localStreamId,
    }, () => {
      logger.log("info", "avcoreCall.ts", `You've stopped streaming of ${this.localStreamId}`, true, true);

      this.localStreamId = null;

      if (this.callType === CallType.OUTGOING) {
        this.sendMixerLayout();
      }
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    this.localStream = null;

    if (this.audioStream) {
      this.audioStream.getAudioTracks().forEach((track) => track.stop());
    }
    this.audioStream = null;

    if (this.videoStream) {
      this.videoStream.getVideoTracks().forEach((track) => track.stop());
    }
    this.videoStream = null;

    this.stopOldAudioTracks();

    if (callback) {
      callback();
    }
  }

  private updateStreaming = async (kinds: Kinds) => {
    try {
      logger.log("info", "avcoreCall.ts", `You've changed kinds to [${kinds}]. Updating capture, notifying sockets...`, true, true);

      const difference = xor(this.streamingKinds, kinds)[0];
      if (this.streamingKinds.length > kinds.length) {
        if (difference === "video") {
          this.videoStream.getVideoTracks().forEach((track) => track.stop());
          this.videoStream = null;

          this.localStream.getVideoTracks().forEach((track) => {
            track.stop();
            this.localStream.removeTrack(track);
            this.capture.removeTrack(track);
          });
        } else if (difference === "audio") {
          this.oldAudioTracks.push(...this.audioStream.getAudioTracks());
          this.audioStream = null;

          this.localStream.getAudioTracks().forEach((track) => {
            this.capture.removeTrack(track);
            this.oldAudioTracks.push(track);
          });
        }
      } else if (this.streamingKinds.length < kinds.length) {
        await this.createMediaStreams(kinds);

        const newTracks = difference === "video" ? this.localStream.getVideoTracks() : this.localStream.getAudioTracks();

        newTracks.forEach((track) => {
          this.capture.addTrack(track);
        });
      }

      this.streamingKinds = kinds;

      SocketServiceInstance.socket.emit(ACTIONS.STREAM_CHANGE, {
        callId: this.callId,
        stream: this.localStreamId,
        kinds,
      }, () => {
        logger.log("info", "avcoreCall.ts", `You've changed published stream with id ${this.localStreamId}. Playing: [${kinds}]. Room participants was notified`, true, true);

        if (this.callType === CallType.OUTGOING) {
          this.sendMixerLayout();
        }
      });
    } catch (err) {
      logger.log("error", "avcoreCall.ts", err.message, true, true, true);
    }
  }

  private updateStreamingCameraMode = async () => {
    try {
      logger.log("info", "avcoreCall.ts", "Changing camera", true, true);
      this.videoStream.getVideoTracks().forEach((track) => {
       // @ts-ignore
        track._switchCamera();
      });
    } catch (err) {
      logger.log("error", "avcoreCall.ts", err.message, true, true, true);
    }
  }

  private onAddTrack = ({ track }: TrackEvent): void => {
    logger.log("info", "avcoreCall.ts", "[onAddTrack] adding track to the remote stream", true);

    if (track.kind === "audio") {
      logger.log("info", "avcoreCall.ts", `[onAddTrack] Received new audio track. Setting 'enabled' to ${MediaServiceInstance.volume}`, true);
      track.enabled = MediaServiceInstance.volume;
    }

    this.remoteStream.addTrack(track);

    this.remoteStream = new MediaStream(this.remoteStream.getTracks());

    InCallManager.setForceSpeakerphoneOn(true);

    const videoTracks = this.remoteStream.getVideoTracks();
    if (videoTracks.length) {
      logger.log("info", "avcoreCall.ts", "[onAddTrack] video tracks are present. Updating remote video stream", true);
      this.remoteVideoStream = new MediaStream(videoTracks);
    }
  }

  private onRemoveTrack = ({ track }: TrackEvent): void => {
    logger.log("info", "avcoreCall.ts", "[onRemoveTrack] removing track from the remote stream", true);

    this.remoteStream.removeTrack(track);

    const videoTracks = this.remoteStream.getVideoTracks();
    if (!videoTracks.length) {
      logger.log("info", "avcoreCall.ts", "[onRemoveTrack] all video tracks were removed. Setting remote video stream to 'null'", true);
      this.remoteVideoStream = null;
    }
  }

  protected subscribeToStream = async (kinds: Kinds, streamId: string): Promise<void> => {
    try {
      logger.log("info", "avcoreCall.ts", `Trying to subscribe to stream ${streamId} with kinds [${kinds}]`, true);

      logger.log("info", "avcoreCall.ts", "Calling avcoreCloudClient.create with SUBSCRIBE operation", true);

      const playback = await UserServiceInstance.avcoreCloudClient.create(
        API_OPERATION.SUBSCRIBE,
        streamId,
        {
          kinds,
          // @ts-ignore
          deviceHandlerName: "ReactNative",
        },
      );

      logger.log("info", "avcoreCall.ts", "Calling await playback.subscribe()", true);

      playback
        .on("addtrack", this.onAddTrack)
        .on("removetrack", this.onRemoveTrack);

      const stream = await playback.subscribe() as MediaStream;

      runInAction(() => {
        this.remoteStream = stream;
        this.remoteStreamId = streamId;
        this.playback = playback;
      });

      logger.log("info", "avcoreCall.ts", `You've subscribed to the stream with id ${streamId}. Playing: [${kinds}]`, true);

      if (this.callType === CallType.OUTGOING) {
        this.sendMixerLayout();
      }
    } catch (err) {
      logger.log("error", "avcoreCall.ts", err.message, true, true, true);
    }
  }

  protected updateSubscribedStream = (kinds: Kinds, streamId: string): void => {
    if (this.playback) {
      this.playback.updateKinds(kinds);
      logger.log("info", "avcoreCall.ts", `You've updated subscribed stream with id ${streamId}. Playing: [${kinds}]`, true, true);

      if (this.remoteStreamId !== streamId) {
        this.remoteStreamId = streamId;
      }
      if (this.callType === CallType.OUTGOING) {
        this.sendMixerLayout();
      }
    }
  }

  protected closeSubscribedStream = (): void => {
    logger.log("info", "avcoreCall.ts", `Closing subscribed stream ${this.remoteStreamId}`, true, true);

    this.remoteStreamId = null;
    this.remoteStream = null;
    if (this.playback) {
      this.playback.close();
      this.playback = null;
    }
    if (this.callType === CallType.OUTGOING) {
      this.sendMixerLayout();
    }
  }

  private toggleVolume = (volume: boolean) => {
    if (!this.remoteStream) {
      return;
    }

    logger.log("info", "avcoreCall.ts", `Switching remote stream's volume to ${volume}`, true);

    this.remoteStream.getAudioTracks().forEach((track) => {
      track.enabled = volume;
    });
  }

  /**
   * `localStream` exists throughout the call's lifetime
   *
   * `videoStream` and `audioStream` and their tracks
   *  are created and removed according to current `kinds`,
   *  that leads to adding new tracks or removing existing ones from `localStream`
   *
   *  The `localSteam` (and its tracks) is used in both `avcore` publishing and local streaming
   * `videoStream` and `audioStream`  are used to seamlessly toggle media on both sides
   *  and to get rid of old tracks
   */
  private createMediaStreams = async (kinds: Kinds) => {
    logger.log("info", "avcoreCall.ts", `Creating mediaStreams for kinds [${kinds}]`, true);
    try {
      if (!this.localStreamId) {
        this.localStreamId = uuid();
        logger.log("info", "avcoreCall.ts", `New stream id was generated: ${this.localStreamId}`, true);
      }

      if (!this.audioStream && kinds.includes("audio")) {
        this.audioStream = await mediaDevices.getUserMedia({ audio: true }) as MediaStream;
        if (!this.localStream) {
          // @ts-ignore
          this.localStream = new MediaStream();
        }
        this.audioStream.getAudioTracks().forEach((track) => this.localStream.addTrack(track));
        this.localStream = new MediaStream(this.localStream.getTracks());
        logger.log("info", "avcoreCall.ts", "Audio stream was initialized. Tracks added to localStream", true);
      }

      if (!this.videoStream && kinds.includes("video")) {
        this.videoStream = await mediaDevices.getUserMedia({
          // @ts-ignore
          video: {
            facingMode: MediaServiceInstance.cameraMode,
            mandatory: {
              minWidth: 640,
              minHeight: 480,
              minFrameRate: 30,
            },
          },
        }) as MediaStream;

        if (!this.localStream) {
          // @ts-ignore
          this.localStream = new MediaStream();
        }
        this.videoStream.getVideoTracks().forEach((track) => this.localStream.addTrack(track));
        this.localStream = new MediaStream(this.localStream.getTracks());
        logger.log("info", "avcoreCall.ts", "Video stream was initialized. Tracks added to localStream", true);
      }
      logger.log("info", "avcoreCall.ts", "All necessary streams were initialized", true, true);
    } catch (err) {
      logger.log("error", "avcoreCall.ts", err.message, true, true, true);
    }
  }

  private stopOldAudioTracks = () => {
    this.oldAudioTracks.forEach((track) => track.stop());
    this.oldAudioTracks = [];
  }

  private sendMixerLayout = () => {
    const streamsMap = {};

    if (this.localStreamId) {streamsMap[this.localStreamId] = 0;}
    if (this.remoteStreamId) {streamsMap[this.remoteStreamId] = 1;}

    const layoutData: MixerLayoutData = {
      callId: this.callId,
      layout: this.remoteStreamId ? LAYOUT.GRID_2 : LAYOUT.GRID_1,
      streamsMap,
    };

    SocketServiceInstance.socket.emit(ACTIONS.MIXER_LAYOUT, layoutData, () => {
      logger.log("info", "avcoreCall.ts", `Mixer layout has been sent: ${JSON.stringify(layoutData)}`, true);
    });
  }

  protected startAppStatusShare = () => {
    console.log("> Started app status share");
    this.shouldShareAppStatus = true;
  }

  protected stopAppStatusShare = () => {
    console.log("> Stopped app status share");
    this.shouldShareAppStatus = false;
  }

  private shareAppStatus = () => {
    if (AppServiceInstance.appState === "active") {
      // app returned from background, need to update remote audio tracks volume
      this.toggleVolume(MediaServiceInstance.volume);
    }

    const eventData: AppStatus = {
      appStatus: AppServiceInstance.appState,
      callId: this.callId,
    };

    SocketServiceInstance.socket.emit(ACTIONS.APP_STATUS, eventData, () => {
      console.log(`> Shared AppStatus ${eventData.appStatus}`);
    });
  }

  private shareCallDetectorStatus = () => {
    const eventData: CallDetectorStatus = {
      callDetectorStatus: AppServiceInstance.callDetectorStatus,
      callId: this.callId,
    };

    SocketServiceInstance.socket.emit(ACTIONS.CALL_DETECTOR_STATUS, eventData, () => {
      console.log(`> Shared CallDetectorStatus: ${eventData.callDetectorStatus}`);
    });
  }

  protected startTrackingParticipantAppStatuses = (): void => {
    console.log("> Started tracking participant's app status");

    SocketServiceInstance.socket.on(ACTIONS.APP_STATUS, ({ appStatus }) => {
      logger.log("info", "avcoreCall.ts", `> APP_STATUS event: ${appStatus}`, true);
      this.participantAppStatus = appStatus;
    });

    SocketServiceInstance.socket.on(ACTIONS.CALL_DETECTOR_STATUS, ({ callDetectorStatus }) => {
      logger.log("info", "avcoreCall.ts", `> CALL_DETECTOR_STATUS event: ${callDetectorStatus}`, true);
      this.participantCallDetectorStatus = callDetectorStatus;
    });
  }

  protected stopTrackingParticipantAppStatuses = (): void => {
    console.log("> Stopped tracking participant's app status");

    SocketServiceInstance.socket.off(ACTIONS.APP_STATUS);
    SocketServiceInstance.socket.off(ACTIONS.CALL_DETECTOR_STATUS);
  }
}
