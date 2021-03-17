import { makeObservable, observable } from "mobx";
import { createContext } from "react";
import { AppState } from "react-native";
import CallDetectorManager from "react-native-call-detection";
import { AppStatusType, CallDetectorStatusType } from "../shared/socket";


class AppService {
  private callDetector = null;

  @observable callDetectorStatus: CallDetectorStatusType = null;

  @observable appState: AppStatusType = null;

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
    this.callDetectorStatus = status;
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
