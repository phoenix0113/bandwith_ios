import { makeObservable, observable } from "mobx";
import { createContext } from "react";
import { AppState } from "react-native";
import CallDetectorManager from "react-native-call-detection";
import { AppStatusType, CallDetectorStatusType } from "../shared/socket";

const MINIMAL_TIME = 100; // in milliseconds

class AppService {
  private callDetector = null;

  @observable callDetectorStatus: CallDetectorStatusType = null;

  @observable appState: AppStatusType = null;

  private lastCallStatusTriggerTime: number = null;

  constructor () {
    makeObservable(this);

    this.appState = AppState.currentState;

    console.log(`> AppState: ${this.appState}`);

    AppState.addEventListener("change", this.handleAppStateChange);

    this.callDetector = new CallDetectorManager(this.handlePhoneCallState, false);
  }

  handleAppStateChange = (nextAppState: AppStatusType): void => {
    if (this.appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
    }

    this.appState = nextAppState;
    console.log(`> AppState: ${this.appState}`);
  }

  handlePhoneCallState = (status: CallDetectorStatusType) => {
    console.log(`> CallManagerStatus: ${status}`);

    // Workaround of problem when "Incoming" status was fired
    // right after the call was "Disconnected"
    if (
      this.callDetectorStatus === "Disconnected"
      && status === "Incoming"
      && Date.now() - this.lastCallStatusTriggerTime < MINIMAL_TIME
      ) {
        console.log("> Skip invalid Incomming status");
    } else {
      this.callDetectorStatus = status;
      this.lastCallStatusTriggerTime = Date.now();
    }
  }

  // TODO: call it when needed
  public destructor = () => {
    console.log("> Releasing AppState listener");
    AppState.removeEventListener("change", this.handleAppStateChange);

    console.log("> Disposing of callDetector");
    this.callDetector.dispose();
  }

}

export const AppServiceInstance = new AppService();

export const AppServiceContext = createContext(AppServiceInstance);
