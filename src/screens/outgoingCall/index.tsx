import React, { useContext } from "react";
import { observer } from "mobx-react";

import { OutgoingCallComponent } from "../../components/Call/Outgoing";
import { CallEndedComponent } from "../../components/Call/Ended";
import { OngoingCallComponent } from "../../components/Call/Ongoing";

import { OutgoingCallServiceContext } from "../../services/outgoingCall";

import { OutgoingCallStatus } from "../../interfaces/call";


export const OutgoingCallPage = observer((): JSX.Element => {
  const {
    status,
    endCallHandler,
    localStream,
    remoteStream,
    callParticipantData,
    playback,
    callId,
    resetOutgoingCall,
  } = useContext(OutgoingCallServiceContext);

  switch (status) {
    case OutgoingCallStatus.INITIALIZED:
    case OutgoingCallStatus.CANCELED:
    case OutgoingCallStatus.NO_RESPONSE:
    case OutgoingCallStatus.REJECTED_BY_PARTICIPANT:
    case OutgoingCallStatus.WAITING_FOR_PARTICIPANT:
      return <OutgoingCallComponent callParticipantData={callParticipantData} />;
    case OutgoingCallStatus.FINISHED:
      return (
        <CallEndedComponent
          callParticipantData={callParticipantData}
          resetHandler={resetOutgoingCall}
          callId={callId}
        />
      );
    case OutgoingCallStatus.ANSWERED_BY_PARTICIPANT:
      return (
        <OngoingCallComponent
          endCallHandler={endCallHandler}
          localStream={localStream}
          remoteStream={remoteStream}
          type="Outgoing"
          callParticipantData={callParticipantData}
          playback={playback}
          callId={callId}
        />
      );
    default:
      break;
  }
});
