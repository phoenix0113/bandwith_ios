const servers = {
  DEV_URL: "https://bandwith.codeda.com",
  PROD_URL: "https://app.bandwwith.com",
  TELEPORT_DEV_URL: "https://teleport-dev.codeda.com",
  LOCAL_DOCKER_URL: "http://localhost:1380",
};

export const SERVER_BASE_URL = servers.DEV_URL;

console.log(`> Using ${SERVER_BASE_URL} server`);

export const SEND_LOGS_THRESHOLD = 5;

export const TOKEN_STORAGE_KEY = "TOKEN";

export const CALL_FINISHED_REDIRECT_TIMER = 59;

export const OUTGOING_CALL_SECONDS = 14;
