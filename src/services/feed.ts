import { action, makeAutoObservable, observable, runInAction, toJS, reaction } from "mobx";
import { createContext } from "react";
import {
  getRecordingById, getRecordingsList, sendRecordingReport, getRecordingsByUserID, getAllRecordingsList
} from "../axios/routes/feed";
import { GetRecordResponse } from "../shared/interfaces";
import {
  RECORDINGS_LOAD_LIMIT, LOADING_RECORDING_ERROR, FETCH_SHARED_RECORDING_ERROR,
  LOADING_RECORDINGS_ERROR, REPORT_ERROR, LOADING_ALL_RECORDINGS_ERROR,
} from "../utils/constants";
import { showGeneralErrorAlert } from "../utils/notifications";
import { SocketServiceInstance } from "./socket";
import { UserServiceInstance } from "./user";

class FeedMobxService {
  @observable currentRecording: GetRecordResponse = null;

  @observable sharedRecording: GetRecordResponse = null;

  @observable recordings: Array<GetRecordResponse> = [];

  @observable filterRecordings: Array<GetRecordResponse> = [];

  @observable allRecordingsLoaded = false;

  @observable allRecordingsList: Array<String> = [];

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile) {
          this.loadRecordings();
          this.loadRecordingList();
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
        if (this.recordings.length <= RECORDINGS_LOAD_LIMIT && recordings.length) {
          this.currentRecording = recordings[0];
          this.setCurrentRecording(recordings[0]._id);
        }
      });

      if (recordings.length < RECORDINGS_LOAD_LIMIT) {
        console.log("> All stored recordings were loaded");
      }
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(LOADING_RECORDINGS_ERROR);
    }
  }

  public loadRecordingList = async () => {
    try {
      const { ids } = await getAllRecordingsList();

      runInAction(() => {
        this.allRecordingsList.push(...ids);
      });

    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(LOADING_ALL_RECORDINGS_ERROR);
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
      showGeneralErrorAlert(FETCH_SHARED_RECORDING_ERROR);
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

  // @action public setCurrentRecording = (_id: string) => {
  //   if (SocketServiceInstance.currentCommentRoomSubscribtion) {
  //     SocketServiceInstance.leaveRecordingCommentsRoom(this.currentRecording._id);
  //   }

  //   const currentIndex = this.recordings.findIndex((r) => r._id === _id);
  //   console.log(`> Current recording (index: ${currentIndex}):`, toJS(this.recordings[currentIndex]));
  //   this.currentRecording = this.recordings[currentIndex];

  //   SocketServiceInstance.joinRecordingCommentsRoom(this.currentRecording._id);

  //   if (
  //     currentIndex + LOAD_MORE_RECORDINGS_THRESHOLD >= this.recordings.length
  //      && !this.allRecordingsLoaded) {
  //     console.log("> Loading more recordings due to threshold");
  //     this.loadRecordings();
  //   }
  // }

  public setCurrentRecording = (_id: string) => {
    this.recordings.forEach((recording) => {
      if (recording?._id === _id) {
        this.currentRecording = recording;
      }
    });
    console.log(">  Current Recording ", _id);
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
      showGeneralErrorAlert(REPORT_ERROR);
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
      showGeneralErrorAlert(LOADING_RECORDING_ERROR);
    }
  }
}

export const FeedStorage = new FeedMobxService();

export const FeedStorageContext = createContext(FeedStorage);
