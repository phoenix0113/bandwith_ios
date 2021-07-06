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

export const COMMENTS_LOAD_LIMIT = 20;

export const RECORDINGS_LOAD_LIMIT = 5;

export const LOAD_MORE_RECORDINGS_THRESHOLD = 3;

export const ADMIN_EMAIL = "phil@bandwwith.com";

export const TERMS_CONDITIONS_URL = "https://www.privacypolicies.com/live/d97e40ef-850d-4ebe-848d-154ee1965d1f";

export const APPROVED_STATUS = "approved";

export const INVITED_STATUS = "invited";

export const NAVIGATOR_SHARE_ERROR = "Your browser doesn't support Social Share.";

export const REMOVE_FROM_FRIEND_LIST_ERROR = "Something went wrong while deleting a user from your friend list.";

export const USER_STATUS_ERROR = "User is offline or busy at the moment";

export const REPORT_SUCCESS = "Your report sent successfully!";

export const REPORT_ERROR = "Something went wrong while sending the report.";

export const FETCH_COMMENTS_ERROR = "Something went wrong while getting comments data.";

export const LOADING_RECORDINGS_ERROR = "Something went wrong while getting recordings data.";

export const LOADING_RECORDING_ERROR = "Something went wrong while getting recording data.";

export const FETCH_SHARED_RECORDING_ERROR = "Something went wrong while getting shared recording data.";

export const CONTACT_REMOVE_ERROR= "Something went wrong while deleting a contact.";

export const FETCH_USER_DATA_ERROR = "Something went wrong while getting user's data.";

export const EMAIL_PASSWORD_INCORRECT_ERROR = "Your email or password incorrect.";

export const EMAIL_INCORRECT_ERROR = "Please check your email address again.";

export const RESET_PASSWORD_ERROR = "Please check your new password again.";

export const EMAIL_EXIST_ERROR = "Already used this email by another user.";

export const INITIALIZE_AVCOR_ERROR = "Initialize Avcor eCloud Client Error";

export const VERIFY_SMS_ERROR = "Something went wrong while sending verification SMS.";

export const VERIFY_SMS_CODE_ERROR = "Please check your SMS code again.";

export const PHONE_NUMBER_UPDATE_ERROR = "Please check your phone number again.";

export const CONTACT_DELETE_ERROR = "Something went wrong while deleting contact.";

export const IMPORT_USER_CONTACT_ERROR = "Import user's contact.";

export const FETCH_USER_CONTACT_ERROR = "Something went wrong while getting user's contact.";

export const INVITE_REQUEST_ERROR = "Something went wrong while sending invite request.";

export const REQUEST_MEDIA_PERMISSION_ERROR = "Permission denied for request media.";

export const LOGGER_SEND_ERROR = "Something went wrong while sending logger.";

export const FETCH_USER_NOTIFICATION = "Something went wrong while getting user's notification.";

export const DELETE_USER_NOTIFICATION = "Something went wrong while deleting user's notification.";

export const CHECK_NOTIFICATION_STATUS = "Something went wrong while checking notification.";

export const UPDATE_HINT_PROFILE_ERROR = "Something went wrong while updating hint and profile.";

export const ADD_CONTACT_AND_NOTIFY_ERROR = "Something went wrong while adding contact and notify.";

export const DELETE_CONTACT_AND_NOTIFY_ERROR = "Something went wrong while deleting contact and notify.";

export const REFETCH_CONTACT_ERROR = "Something went wrong while refetching contact.";