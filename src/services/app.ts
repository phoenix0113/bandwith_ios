import { makeObservable, observable, action } from "mobx";
import { createContext } from "react";
import { Alert, AppState } from "react-native";
import CallDetectorManager from "react-native-call-detection";
import NetInfo, { NetInfoState, NetInfoStateType } from "@react-native-community/netinfo";

import { AppStatusType, CallDetectorStatusType } from "../shared/socket";

const MINIMAL_TIME = 100; // in milliseconds

class AppService {
  private callDetector = null;

  @observable callDetectorStatus: CallDetectorStatusType = null;

  @observable appState: AppStatusType = null;

  @observable netConnected: boolean = null;

  @observable netAccessible: boolean = null;

  @observable netOldType: NetInfoStateType = null;

  @observable netCurrentType: NetInfoStateType = null;

  @observable canReconnect: boolean = null;

  @observable callConnectionLostTimestamp: number = null;

  private lastCallStatusTriggerTime: number = null;

  constructor () {
    makeObservable(this);

    this.appState = AppState.currentState;

    console.log(`> AppState: ${this.appState}`);

    AppState.addEventListener("change", this.handleAppStateChange);

    this.callDetector = new CallDetectorManager(this.handlePhoneCallState, false);

    NetInfo.addEventListener(this.handleNetworkChange);
  }

  private handleAppStateChange = (nextAppState: AppStatusType): void => {
    if (this.appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
    }

    this.appState = nextAppState;
    console.log(`> AppState: ${this.appState}`);
  }

  private handlePhoneCallState = (status: CallDetectorStatusType) => {
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

  @action handleNetworkChange = (state: NetInfoState) => {
    this.netAccessible = state.isInternetReachable;
    this.netConnected = state.isConnected;

    this.netOldType = this.netCurrentType;
    this.netCurrentType = state.type;

    this.canReconnect = this.checkReconnect();

    if (state.isInternetReachable === false || this.netOldType !== this.netCurrentType) {
      this.callConnectionLostTimestamp = Date.now();
    }
  }

  public clearCallTimestamp = () => {
    this.callConnectionLostTimestamp = null;
  }

  private checkReconnect = (): boolean => {
    return !!this.netConnected && !!this.netAccessible &&
      (this.netCurrentType === NetInfoStateType.cellular || this.netCurrentType === NetInfoStateType.wifi);
  }

  public hasNetworkProblems = () => {
    return !this.netConnected || !this.netAccessible ||
      (this.netCurrentType !== NetInfoStateType.cellular && this.netCurrentType !== NetInfoStateType.wifi);
  }

  public showNetworkStats = () => {
    Alert.alert("Network stats", `Connected: ${this.netConnected}.\nAccessible: ${this.netAccessible}.\nType: ${this.netCurrentType}\nCan reconnect: ${this.canReconnect}`);
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
