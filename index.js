import { AppRegistry } from "react-native";
import { registerGlobals, MediaStreamTrack } from "react-native-webrtc";
import "./src/services/APNs";

registerGlobals();

class MediaStreamTrackEvent {
  type: string;
  track: MediaStreamTrack;
  constructor(type, eventInitDict) {
    this.type = type.toString();
    Object.assign(this, eventInitDict);
  }
}

global.MediaStreamTrackEvent = MediaStreamTrackEvent;

import App from "./src/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
