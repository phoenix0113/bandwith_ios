import { format } from "date-fns";

import { UserServiceInstance } from "./user";
import { AppServiceInstance } from "./app";

import { logOnServerRequest, sendLogsRequest } from "../axios/routes/logs";
import { SEND_LOGS_THRESHOLD } from "../utils/constants";
import { showUnexpectedErrorAlert } from "../utils/notifications";

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

    const fullLog = `[${type}] ${formatedDate} ${file}: ${message} \n`;

    if (shouldConsole) {
      if (type === "error") {
        console.error(`> ${message}`);
      }
      console.log(`> ${message}`);
    }

    // if (shouldShowUser) {
    //   if (type === "error") {
    //     Alert.alert("Notification", message);
    //   }
    //   Alert.alert("Notification", message);
    // }

    this.stringifiedLogs = `${this.stringifiedLogs}${fullLog}`;

    // if (this.logs.length >= SEND_LOGS_THRESHOLD || forceSend) {
    //   console.log("> Sending logs: ", this.logs);

    //   if (AppServiceInstance.hasNetworkProblems() !== true) {
    //     this.send(this.stringifiedLogs);

    //     this.logs = [];
    //     this.stringifiedLogs = "";
    //   }
    // }
  }

  private send = async (logs: string): Promise<void> => {
    try {
      await sendLogsRequest({
        userId: `${UserServiceInstance.profile.name.replace(" ", "")}|${UserServiceInstance.profile._id.substr(0, 8)}`,
        logs,
      });
    } catch (err) {
      showUnexpectedErrorAlert("logger.send()", err.message);
    }
  }

  public logOnServer = async (message: string): Promise<void> => {
    try {
      await logOnServerRequest({
        log: message,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export const logger = new LoggerService();
