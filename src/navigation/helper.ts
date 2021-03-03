import {createRef} from "react";
import { NavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createRef<NavigationContainerRef>();

export const navigateToScreen = (screen: string) => {
  navigationRef.current?.navigate(screen);
};
