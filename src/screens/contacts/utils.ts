
import { COLORS } from "../../components/styled";
import { UserStatus } from "../../shared/socket";

export const getContactNumber = (index: number) => `0${index + 1}`.slice(-2);

export const getColor = (status: UserStatus): string => {
  switch (status) {
    case "online":
      return COLORS.ALTERNATIVE;
    case "offline":
      return COLORS.GREY;
    case "busy":
      return COLORS.ORANGE;
    default:
      return COLORS.GREY;
  }
};
