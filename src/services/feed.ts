import { action, makeAutoObservable, observable, runInAction, toJS, reaction } from "mobx";
import { createContext } from "react";
import {
  getRecordingById, sendRecordingReport, getRecordingsByUserID, updateFeatured, checkFeatured, getFeaturedStatus, loadAvailableRecordings,
} from "../axios/routes/feed";
import { GetRecordResponse } from "../shared/interfaces";
import {
  RECORDINGS_LOAD_LIMIT, LOADING_RECORDING_ERROR, FETCH_SHARED_RECORDING_ERROR, CHECK_FEATURED_ERROR,
  LOADING_RECORDINGS_ERROR, REPORT_ERROR, LOADING_ALL_RECORDINGS_ERROR, UPDATE_FEATURED_ERROR
} from "../utils/constants";
import { showGeneralErrorAlert } from "../utils/notifications";
import { SocketServiceInstance } from "./socket";
import { UserServiceInstance } from "./user";

class FeedMobxService {
  @observable currentRecording: GetRecordResponse = null;

  @observable featuredStatus = false;

  @observable featuredCount = 0;

  @observable userID = "";

  @observable sharedRecording: GetRecordResponse = null;

  @observable recordings: Array<GetRecordResponse> = [];

  @observable recordingsCount = -1;

  @observable filterRecordings: Array<GetRecordResponse> = [];

  @observable currentFilterRecording: GetRecordResponse = null;

  @observable onLoaded = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => UserServiceInstance.profile,
      (profile) => {
        if (profile) {
          this.userID = profile._id;
          this.loadRecordings();
        }
      }
    );
  }

  public loadRecordings = async () => {
    try {
      if (this.recordingsCount !== this.recordings.length) {
        this.onLoaded = false;
        const { recordings, amount } = await loadAvailableRecordings({
          limit: RECORDINGS_LOAD_LIMIT, offset: this.recordings.length,
        });

        runInAction(() => {
          this.recordings.push(...recordings);
          this.recordingsCount = amount;
          if (this.recordings.length <= RECORDINGS_LOAD_LIMIT && recordings.length) {
            this.currentRecording = recordings[0];
            this.setCurrentRecording(recordings[0]._id);
          }
        });

        if (recordings.length < RECORDINGS_LOAD_LIMIT) {
          console.log("> All stored recordings were loaded");
        }
        this.onLoaded = true;
      }
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(LOADING_RECORDINGS_ERROR);
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

  public setCurrentRecording = (_id: string) => {
    this.recordings.forEach((recording) => {
      if (recording?._id === _id) {
        this.currentRecording = recording;
      }
    });
    this.checkFeatured(this.currentRecording._id);
    this.getFeaturedStatus(this.currentRecording._id);
    console.log(">  Current Recording ", _id);
  }

  public setCurrentFilterRecording = (_id: string) => {
    this.recordings.forEach((recording) => {
      if (recording?._id === _id) {
        this.currentFilterRecording = recording;
      }
    });
    console.log(">  Current Filter Recording ", _id);
    this.checkFeatured(this.currentFilterRecording._id);
    this.getFeaturedStatus(this.currentFilterRecording._id);
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

  public updateFeatured = async (userID: string, callrecordingID: string) => {
    try {
      const { success } = await updateFeatured({
        user: userID,
        callrecording: callrecordingID,
      });

      this.featuredStatus = success;
      console.log("> Update Featured of Recording: ", success);
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(UPDATE_FEATURED_ERROR);
    }
  }

  public checkFeatured = async (callrecordingID: string) => {
    try {
      const { code } = await checkFeatured(callrecordingID);

      this.featuredCount = code;
      console.log("> Check Featured of Recording: ", code);
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(CHECK_FEATURED_ERROR);
    }
  }

  public getFeaturedStatus = async (callrecordingID: string) => {
    try {
      const { success } = await getFeaturedStatus({
        user: this.userID,
        callrecording: callrecordingID
      });

      this.featuredStatus = success;
      console.log("> Featured status of Recording: ", success);
    } catch (err) {
      console.log(err.message);
      showGeneralErrorAlert(CHECK_FEATURED_ERROR);
    }
  }
}

export const FeedStorage = new FeedMobxService();

export const FeedStorageContext = createContext(FeedStorage);
