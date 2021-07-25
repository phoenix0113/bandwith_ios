import { StyleSheet } from "react-native";
import { COLORS } from "../../components/styled";

export const getEmailErrorMessage = (email: string): string => {
  if (!email) {
    return "Email is required";
  }
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return "Enter a valid email";
  }
  return "";
};


export const getPasswordErrorMessage = (password: string, rPassword?: string): string => {
  if (!password) {
    return "Password is required";
  }
  if (rPassword && password !== rPassword) {
    return "Password must match";
  }
  return "";
};

export const getUsernameErrorMessage = (username: string): string => {
  if (!username) {
    return "Username is required";
  }
  return "";
};

export const inputStyles = StyleSheet.create({
  inputText: {
    color: COLORS.WHITE,
    fontFamily: "Kefa",
    fontSize: 20,
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
