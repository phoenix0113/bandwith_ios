import { Alert } from "react-native";

export const showNetworkErrorAlert = (): void => {
  Alert.alert("Network error", "Action wasn't complete because app couldn'd get an access to the internet. Please, try again.");
};

export const showUnexpectedErrorAlert = (source: string, message: string): void => {
  const errorContent = `Error occured while calling '${source}'. Message: ${message}.`;

  console.error(`>> ${errorContent}`);
  Alert.alert("Unexpected error", `${errorContent}. Please, contact devs.`);
};
