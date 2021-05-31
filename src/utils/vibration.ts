import { Vibration } from "react-native";
export type VIBRATION_TYPE = "click"|"call"

const CALL_VIBRATION_PATTERN = [
  400, 600, 400, 600, 400, 600, 400, 600, 400, 600,
  400, 600, 400, 600, 400, 600, 400, 600, 400, 600,
  400, 600, 400, 600, 400, 600, 400, 600, 200, 100, 200,
];

const CLICK_VIBRATION_PATTERN = [40];

export const vibrate = (type: VIBRATION_TYPE): void => {
  if (!Vibration.vibrate) {
    console.log("> Vibration is not supported by your device");
    return;
  }

  if (type === "call") {
    Vibration.vibrate(CALL_VIBRATION_PATTERN);
  } else if (type === "click") {
    Vibration.vibrate(CLICK_VIBRATION_PATTERN);
  }
};

export const cancelVibration = (): void => {
  if (Vibration.vibrate) {
    Vibration.vibrate(0);
  }
};
