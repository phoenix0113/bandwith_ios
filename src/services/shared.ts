import { observable, makeAutoObservable } from "mobx";
import { createContext } from "react";
import { getSharedRecordingById } from "../axios/routes/feed";
import { GetRecordResponse } from "../shared/interfaces";
import { showGeneralErrorAlert } from "../utils/notifications";

class SharedMobxService {
  @observable sharedRecording: GetRecordResponse = null;

  @observable sharedRecordingID: string = null;

  constructor() {
    makeAutoObservable(this);
  }

  public setShareCurrentRecordingID = async (id: string) => {
    try {
      if (id === "") {
        this.sharedRecordingID = null;
        this.sharedRecording = null;
      } else {
        this.sharedRecordingID = id;
        this.setShareCurrentRecording(this.sharedRecordingID);
      }
    } catch (err) {
      showGeneralErrorAlert(err.message);
    }
  }

  public setShareCurrentRecording = async (id: string) => {
    try {
      const recording = await getSharedRecordingById(id);

      this.sharedRecording = recording;
    } catch (err) {
      showGeneralErrorAlert(err.message);
    }
  }
}

export const SharedStorage = new SharedMobxService();

export const SharedStorageContext = createContext(SharedStorage);
