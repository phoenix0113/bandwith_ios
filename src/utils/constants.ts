const servers = {
  DEV_URL: "https://bandwith.codeda.com",
  PROD_URL: "https://app.bandwwith.com",
  TELEPORT_DEV_URL: "https://teleport-dev.codeda.com",
  LOCAL_DOCKER_URL: "http://localhost:1380",
};

export const SERVER_BASE_URL = servers.PROD_URL;

console.log(`> Using ${SERVER_BASE_URL} server`);

export const SEND_LOGS_THRESHOLD = 5;

export const TOKEN_STORAGE_KEY = "TOKEN";

export const VERIFY_CODE = "VERIFY_CODE";

export const VERIFY_STATUS = "VERIFY_STATUS";

export const EMAIL = "EMAIL";

export const RESET_PASSWORD_STATUS = "RESET_PASSWORD_STATUS";

export const SMS_REQUEST_ID = "SMS_REQUEST_ID";

export const SMS_PHONE = "SMS_PHONE";

export const COUNTRY_CODE = "COUNTRY_CODE";

export const GOOGLE_CLIENT_ID = "145536000163-qjfeu4edovl197fsv86kor0li68uhdl0.apps.googleusercontent.com";

export const CALL_FINISHED_REDIRECT_TIMER = 59;

export const OUTGOING_CALL_SECONDS = 30;

export const NAVIGATOR_SHARE_ERROR = "Your browser doesn't support Social Share";

export const COMMENTS_LOAD_LIMIT = 20;

export const RECORDINGS_LOAD_LIMIT = 5;

export const LOAD_MORE_RECORDINGS_THRESHOLD = 3;
