const servers = {
  DEV_URL: "https://bandwith.codeda.com",
  PROD_URL: "https://app.bandwwith.com",
  TELEPORT_DEV_URL: "https://teleport-dev.codeda.com",
  LOCAL_DOCKER_URL: "http://localhost:1380",
};

export const SERVER_BASE_URL = servers.TELEPORT_DEV_URL;

console.log(`> Using ${SERVER_BASE_URL} server`);

