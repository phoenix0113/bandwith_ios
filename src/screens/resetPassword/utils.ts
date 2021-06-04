import { StyleSheet } from "react-native";
import { COLORS } from "../../components/styled";

export const getPasswordErrorMessage = (password: string, rPassword?: string): string => {
  if (!password) {
    return "Password is required";
  }
  if (rPassword && password !== rPassword) {
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
