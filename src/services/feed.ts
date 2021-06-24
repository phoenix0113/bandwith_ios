import { action, makeAutoObservable, observable, runInAction, toJS } from "mobx";
import { createContext } from "react";
import { getRecordingById, getRecordingsList, sendRecordingReport } from "../axios/routes/feed";
import { GetRecordResponse } from "../shared/interfaces";
import { LOAD_MORE_RECORDINGS_THRESHOLD, RECORDINGS_LOAD_LIMIT } from "../utils/constants";
import { showUnexpectedErrorAlert } from "../utils/notifications";
import { SocketServiceInstance } from "./socket";

class FeedMobxService {
  @observable currentRecording: GetRecordResponse = null;

  @observable sharedRecording: GetRecordResponse = null;

  @observable recordings: Array<GetRecordResponse> = [];

  @observable allRecordingsLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  public loadRecordings = async () => {
    try {
      const { recordings } = await getRecordingsList({
        limit: RECORDINGS_LOAD_LIMIT, offset: this.recordings.length,
      });

      runInAction(() => {
        this.recordings.push(...recordings);
        if (!this.recordings.length && recordings.length) {
          this.currentRecording = recordings[0];
          this.setCurrentRecording(recordings[0]._id);
        }
      });

      if (recordings.length < RECORDINGS_LOAD_LIMIT) {
        this.allRecordingsLoaded = true;
        console.log("> All stored recordings were loaded");
      }
    } catch (err) {
      showUnexpectedErrorAlert("Load Recordings", err.message);
    }
  }

  public fetchSharedRecording = async (id: string) => {
    console.log("> Trying to fetch shared recording");
    try {
      const recording = await getRecordingById(id);
      console.log("> Shared recording: ", recording);

      this.sharedRecording = recording;
      this.currentRecording = recording;
      if (SocketServiceInstance.currentCommentRoomSubscribtion) {
        SocketServiceInstance.leaveRecordingCommentsRoom(this.currentRecording._id);
      }
      SocketServiceInstance.joinRecordingCommentsRoom(recording._id);
    } catch (err) {
      showUnexpectedErrorAlert("Fetch Shared Recording", err.message);
    }
  }

  @action public cleanSharedRecording = () => {
    this.sharedRecording = null;
    if (SocketServiceInstance.currentCommentRoomSubscribtion) {
      SocketServiceInstance.leaveRecordingCommentsRoom(this.currentRecording._id);
    }
    if (this.recordings.length) {
      this.currentRecording = this.recordings[0];
      SocketServiceInstance.joinRecordingCommentsRoom(this.currentRecording._id);
    }
  }

  @action public setCurrentRecording = (_id: string) => {
    if (SocketServiceInstance.currentCommentRoomSubscribtion) {
      SocketServiceInstance.leaveRecordingCommentsRoom(this.currentRecording._id);
    }

    const currentIndex = this.recordings.findIndex((r) => r._id === _id);
    console.log(`> Current recording (index: ${currentIndex}):`, toJS(this.recordings[currentIndex]));
    this.currentRecording = this.recordings[currentIndex];

    SocketServiceInstance.joinRecordingCommentsRoom(this.currentRecording._id);

    if (
      currentIndex + LOAD_MORE_RECORDINGS_THRESHOLD >= this.recordings.length
       && !this.allRecordingsLoaded) {
      console.log("> Loading more recordings due to threshold");
      this.loadRecordings();
    }
  }

  public sendReport = async (id: string) => {
    try {
      const code = await sendRecordingReport(id);
      console.log("> Report recording: ", code);
    } catch (err) {
      showUnexpectedErrorAlert("Report Recording", err.message);
    }
  }
}

export const FeedStorage = new FeedMobxService();

export const FeedStorageContext = createContext(FeedStorage);
