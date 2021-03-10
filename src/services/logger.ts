import { format } from "date-fns";
import { Alert } from "react-native";

import { UserServiceInstance } from "./user";

import { sendLogsRequest } from "../axios/routes/logs";
import { SEND_LOGS_THRESHOLD } from "../utils/constants";

interface LogItem {
  date: string;
  file: string;
  message: string;
  type: string;
}

class LoggerService {
  private logs: Array<LogItem> = [];

  private stringifiedLogs = "";

  public log = (
    type: "error"|"info",
    file: string,
    message: string,
    shouldConsole?: boolean,
    forceSend?: boolean,
    shouldShowUser?: boolean,
  ): void => {
    const formatedDate = format(new Date(), "yyyy.MM.dd HH:mm:ss.SSSSSS");

    this.logs.push({
      date: formatedDate,
      file,
      message,
      type,
    });

    const minifiedLog = `${file}: ${message}`;
    const fullLog = `[${type}] ${formatedDate} ${minifiedLog} \n`;

    if (shouldConsole) {
      if (type === "error") {
        console.error(`> ${minifiedLog}`);
      }
      console.log(`> ${minifiedLog}`);
    }

    if (shouldShowUser) {
      const minified = `${file}: ${message}`;
      if (type === "error") {
        Alert.alert("Notification", minified);
      }
      Alert.alert("Notification", minified);
    }

    this.stringifiedLogs = `${this.stringifiedLogs}${fullLog}`;

    if (this.logs.length >= SEND_LOGS_THRESHOLD || forceSend) {
      console.log("> Sending logs: ", this.logs);

      this.send(this.stringifiedLogs);

      this.logs = [];
      this.stringifiedLogs = "";
    }
  }

  private send = async (logs: string): Promise<void> => {
    try {
      await sendLogsRequest({
        userId: `${UserServiceInstance.profile.name.replace(" ", "")}|${UserServiceInstance.profile._id.substr(0, 8)}`,
        logs,
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Notification", err.message);
    }
  }
}

export const logger = new LoggerService();
