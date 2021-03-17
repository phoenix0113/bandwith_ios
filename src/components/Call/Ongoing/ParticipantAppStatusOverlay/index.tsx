import React from "react";

import { AppStatusType, CallDetectorStatusType } from "../../../../shared/socket";
import { ParticipantStatusOverlay } from "../styled";
import { BasicText } from "../../../styled";

interface IProps {
  participantAppStatus: AppStatusType;
  participantCallStatus: CallDetectorStatusType;
}

const getOverlayText = (
  participantAppStatus: AppStatusType,
  participantCallStatus: CallDetectorStatusType,
): string => {
  if (participantAppStatus === "background" || participantAppStatus === "inactive") {
    return "Participant minimized an app";
  }

  if (participantCallStatus === "Incoming" || participantCallStatus === "Connected") {
    return "Participats audio is taken by incoming call";
  }

  return "Participant's app send unexpected status";
};

export const PartipantAppStatusComponent = ({
  participantAppStatus, participantCallStatus,
}: IProps): JSX.Element => {
  if (!participantAppStatus && !participantCallStatus) {
    return null;
  }

  if (!participantAppStatus && participantCallStatus !== "Incoming" && participantCallStatus !== "Connected") {
    return null;
  }

  if (participantAppStatus === "active" && participantCallStatus !== "Incoming" && participantCallStatus !== "Connected") {
    return null;
  }

  return (
    <ParticipantStatusOverlay>
      <BasicText fontSize="16px" fontWeight="500">
        {getOverlayText(participantAppStatus, participantCallStatus)}
      </BasicText>
    </ParticipantStatusOverlay>
  );
};
