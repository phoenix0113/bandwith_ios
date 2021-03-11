import { AppRegistry } from "react-native";
import { registerGlobals } from "react-native-webrtc";

registerGlobals();

import App from "./src/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
