import { action, makeAutoObservable, observable, runInAction, toJS, reaction } from "mobx";
import { createContext } from "react";
import { getRecordingById, getRecordingsList, sendRecordingReport, getRecordingsByUserID } from "../axios/routes/feed";
import { GetRecordResponse } from "../shared/interfaces";
import { LOAD_MORE_RECORDINGS_THRESHOLD, RECORDINGS_LOAD_LIMIT } from "../utils/constants";
import { showUnexpectedErrorAlert, showGeneralErrorAlert } from "../utils/notifications";
import { SocketServiceInstance } from "./socket";
import { UserServiceInstance } from "./user";

class FeedMobxService {
  @observable currentRecording: GetRecordResponse = null;

  @observable sharedRecording: GetRecordResponse = null;

  @observable recordings: Array<GetRecordResponse> = [];

  @observable filterRecordings: Array<GetRecordResponse> = [];

  @observable allRecordingsLoaded = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile) {
          this.loadRecordings();
        }
      }
    );
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
        console.log("> All stored recordings were loaded");
      }
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert("Load Recordings Error");
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
      console.log(err.message);
      showGeneralErrorAlert("Fetch Shared Recording Error");
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

  public sendReport = async (id: string, email: string, title: string, body: string) => {
    try {
      const code = await sendRecordingReport({
        id: id,
        email: email,
        title: title,
        body: body,
      });
      console.log("> Report recording: ", code);
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert("Report Recording Error");
    }
  }

  public getRecordingsByUserID = async (id: string) => {
    try {
      const { recordings } = await getRecordingsByUserID(id);

      runInAction(() => {
        this.filterRecordings = [];
        this.filterRecordings.push(...recordings);
        if (!this.filterRecordings.length && recordings.length) {
          this.currentRecording = recordings[0];
          this.setCurrentRecording(recordings[0]._id);
        }
      });

      if (recordings.length < RECORDINGS_LOAD_LIMIT) {
        console.log("> All stored recordings were loaded");
      }
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert("Load Recordings Error");
    }
  }
}

export const FeedStorage = new FeedMobxService();

export const FeedStorageContext = createContext(FeedStorage);
