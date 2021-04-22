import { StyleSheet } from "react-native";

import { COLORS } from "../../components/styled";

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    color: COLORS.WHITE,
  },
  tabText: {
    color: COLORS.WHITE,
    fontSize: 15,
  },
});
