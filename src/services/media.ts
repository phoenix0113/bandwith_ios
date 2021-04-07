import { observable, makeObservable, action, computed, runInAction } from "mobx";
import { createContext } from "react";
import { mediaDevices, MediaStream } from "react-native-webrtc";
import Sound from "react-native-sound";
import { Alert } from "react-native";

import { MediaType } from "../interfaces/global";
import { Kinds } from "../shared/socket";
import { showUnexpectedErrorAlert } from "../utils/notifications";

class MediaService {
  private ringtone: Sound = null;

  private videoPermissions = false;

  private audioPermissions = false;

  @observable camera = true;

  @observable micro = true;

  @observable volume = true;

  @observable cameraMode: "user"|"environment" = "user";

  constructor() {
    makeObservable(this);

    Sound.setCategory("Playback");

    this.ringtone = new Sound("ringtone.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error(">> failed to load the sound", error.message);
        return;
      }
      console.log(`> Ringtone is preloaded (${this.ringtone.getDuration().toFixed(2)} seconds long)`);
    });

    this.initializeMedia();
  }

  @action public toggleCameraMode = (): void => {
    if (this.cameraMode === "environment") {
      this.cameraMode = "user";
    } else {
      this.cameraMode = "environment";
    }
  }

  @action public toggleMedia = (type: MediaType): void => {
    switch (type) {
      case MediaType.CAMERA:
        this.camera = !this.camera;
        break;
      case MediaType.MICRO:
        this.micro = !this.micro;
        break;
      case MediaType.VOLUME:
        this.volume = !this.volume;
        break;
      default:
        break;
    }
  }

  @computed get kinds() {
    return this.generateKindsFromMedia();
  }

  public generateKindsFromMedia = (): Kinds => {
    const kinds: Kinds = [];
    if (this.camera) {kinds.push("video");}
    if (this.micro) {kinds.push("audio");}
    return kinds;
  }

  @action resetMedia = () => {
    this.micro = true;
    this.camera = true;
    this.volume = true;
  }

  private initializeMedia = async () => {
    await this.providedPermissions();

    if (!this.videoPermissions && !this.audioPermissions) {
      const videoPermissionsPromise = this.requestMediaPermissions(true, false);
      const audioPermissionsPromise = this.requestMediaPermissions(false, true);

      const videoPermissions = await videoPermissionsPromise;
      const audioPermissions = await audioPermissionsPromise;

      runInAction(() => {
        this.videoPermissions = videoPermissions;
        this.camera = videoPermissions;

        this.audioPermissions = audioPermissions;
        this.micro = audioPermissions;
      });
    }

    console.log("> Media has been initialized!");
  }


  /**
   * Returns available permissions based on the devices availability
   * If there's a device with id for a specific kind than the permission for this kind was provided
   * @returns Promise
   */
   private providedPermissions = async () => {
      const devices = await mediaDevices.enumerateDevices();

      devices.forEach((device) => {
        if (device.kind === "videoinput" && device.deviceId) {
          runInAction(() => {
            this.videoPermissions = true;
            this.camera = true;
          });
        } else if (device.kind === "audioinput" && device.deviceId) {
          runInAction(() => {
            this.audioPermissions = true;
            this.micro = true;
          });
        }
      });
  }

  private requestMediaPermissions = async (video: boolean, audio: boolean): Promise<boolean> => {
    try {
      const temporaryStream = await mediaDevices.getUserMedia({ audio, video }) as MediaStream;
      temporaryStream.getTracks().forEach((t) => t.stop());

      return true;
    } catch (err) {
      // TODO: success handler for "permission denied"
      showUnexpectedErrorAlert("requestMediaPermissions()", err.message);
      return false;
    }
  };


  public playRingtone = () => {
    this.ringtone.play((success) => {
      if (success) {
        console.log("> successfully finished playing");
      } else {
        console.log("> playback failed due to audio decoding errors");
      }
    });
  }

  public stopRingtone = () => {
    this.ringtone.stop(() => {
      this.ringtone.setCurrentTime(0);
    });
  }
}

export const MediaServiceInstance = new MediaService();

export const MediaServiceContext = createContext(MediaServiceInstance);

