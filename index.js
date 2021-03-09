import { AppRegistry } from "react-native";
import { RTCPeerConnection, MediaStream } from "react-native-webrtc";

// @ts-ignore
global.MediaStream = MediaStream;
// @ts-ignore
global.RTCPeerConnection = RTCPeerConnection;

import App from "./src/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
