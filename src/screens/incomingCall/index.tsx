import React, { useContext } from "react";
import { observer } from "mobx-react";

import { IncomingCallComponent } from "../../components/Call/Incoming";
import { CallEndedComponent } from "../../components/Call/Ended";
import { OngoingCallComponent } from "../../components/Call/Ongoing";

import { IncomingCallServiceContext } from "../../services/incomingCall";

import { IncomingCallStatus } from "../../interfaces/call";


export const IncomingCallScreen = observer((): JSX.Element => {
  const {
    status,
    endCall,
    localStream,
    remoteStream,
    callParticipantData,
    playback,
    callId,
    resetIncomingCall,
  } = useContext(IncomingCallServiceContext);

  switch (status) {
    case IncomingCallStatus.INITIALIZED:
    case IncomingCallStatus.CANCELED:
    case IncomingCallStatus.MISSED:
    case IncomingCallStatus.REJECT:
    case IncomingCallStatus.INCOMING:
      return <IncomingCallComponent callParticipantData={callParticipantData}/>;
    case IncomingCallStatus.FINISHED:
      return (
        <CallEndedComponent
          callParticipantData={callParticipantData}
          resetHandler={resetIncomingCall}
          callId={callId}
        />
      );
    case IncomingCallStatus.ACCEPT:
      return (
        <OngoingCallComponent
          endCallHandler={endCall}
          localStream={localStream}
          remoteStream={remoteStream}
          type="Incoming"
          callParticipantData={callParticipantData}
          callId={callId}
          playback={playback}
        />
      );
    default:
      break;
  }
});
