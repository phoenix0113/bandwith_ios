export enum MediaType {
  CAMERA,
  MICRO,
  VOLUME,
}

export enum ServiceStatus {
  IDLE,
  INITIALIZING,
  INITIALIZED,
  ERROR,
}

export type ActionStatus = "pending"|"success"|"error";

export enum GlobalServiceStatus {
  IDLE,
  AUTHENTICATING,
  SETTING_UP,
  INITIALIZED,
}