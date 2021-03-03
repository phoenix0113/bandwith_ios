export const emailErrorMessage = (email: string): string => {
  if (!email) {
    return "Email is required";
  }
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return "Enter a valid email";
  }
  return "";
};


export const passwordErrorMessage = (password: string): string => {
  if (!password) {
    return "Password is required";
  }
  return "";
};
