import { StyleSheet } from "react-native";
import { COLORS } from "../../components/styled";

export const getVerifyCodeErrorMessage = (code: string, verifyStatus: string, rCode?: string): string => {
  if (!code) {
    return "Password is required";
  }
  if (verifyStatus !== "VERIFY_STATUS") {
    return verifyStatus;
  }
  if (rCode && code !== rCode) {
    return "Password must match";
  }
  return "";
};

export const inputStyles = StyleSheet.create({
  inputText: {
    color: COLORS.WHITE,
    fontFamily: "Kefa",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0.80,
    textAlign: "left",

  },
  inputContainer: {
    borderWidth: 0,
    paddingHorizontal: 0,
  },
});
