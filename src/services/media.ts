import { observable, makeObservable, action, computed, runInAction } from "mobx";
import { createContext } from "react";
import { MediaType } from "../interfaces/global";
import { Kinds } from "../shared/socket";

class MediaService {
  private videoPermissions = false;

  private audioPermissions = false;

  @observable camera = true;

  @observable micro = true;

  @observable volume = true;

  @observable cameraMode: "user"|"environment" = "user";

  constructor() {
    makeObservable(this);
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
    // TODO: find a workaround for Safari requesting permissions every time
    // if (Utils.isSafari) {
    //   this.camera = true;
    //   this.videoPermissions = true;
    //   this.volume = true;
    //   this.audioPermissions = true;

    //   return;
    // }

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
    // if (navigator.mediaDevices?.enumerateDevices) {
    //   const devices = await navigator.mediaDevices.enumerateDevices();
    //   devices.forEach((device) => {
    //     if (device.kind === "videoinput" && device.deviceId) {
    //       runInAction(() => {
    //         this.videoPermissions = true;
    //         this.camera = true;
    //       });
    //     } else if (device.kind === "audioinput" && device.deviceId) {
    //       runInAction(() => {
    //         this.audioPermissions = true;
    //         this.micro = true;
    //       });
    //     }
    //   });
    // }
  }

  private requestMediaPermissions = async (video: boolean, audio: boolean): Promise<boolean> => {
    // try {
    //   const temporaryStream = await Utils.getUserMedia({ audio, video });
    //   temporaryStream.getTracks().forEach((t) => t.stop());

    //   return true;
    // } catch (err) {
    // // TODO: success handler for "permission denied"
    //   Alert.alert("Notification", err.message);
    //   return false;
    // }
    return true;
  };



  /**
   * Ringtone control
   */
  // private player: HTMLAudioElement = null;

  // public setSafariPlayer = (player: HTMLAudioElement) => {
  //   this.player = player;
  // }

  // public playAudio = () => {
  //   if (Utils.isSafari) {
  //     this.player.src = ringtone;
  //     this.player.muted = false;
  //     this.player.play();
  //   } else {
  //     audioPlayer.play();
  //   }
  // }

  // public stopAudio = () => {
  //   if (Utils.isSafari) {
  //     this.player.muted = true;
  //     this.player.pause();
  //     this.player.currentTime = 0;
  //   } else {
  //     audioPlayer.pause();
  //     audioPlayer.currentTime = 0;
  //   }
  // }
}

export const MediaServiceInstance = new MediaService();

export const MediaServiceContext = createContext(MediaServiceInstance);

