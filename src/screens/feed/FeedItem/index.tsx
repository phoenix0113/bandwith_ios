import React, { useContext, useState } from "react";
import { View } from "react-native";

import { observer } from "mobx-react";
import { VideoWrapper } from "../styled";

import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";

import { FeedStorageContext } from "../../../services/feed";

import { FeedVideoComponent } from "../FeedVideo";

interface IProps {
  recording: GetRecordResponse;
  showReport: (id: string) => void;
  showUserProfile: (id: string) => void;
  showComments: () => void;
  shareCall: (recording: GetRecordResponse) => void;
  openRecordUser: (user: RecordUser) => void;
  paused: boolean;
}

export const FeedItemComponent  = observer((
  { recording, openRecordUser, shareCall, showComments, paused, showUserProfile, showReport }: IProps) => {
  
  const [itemRef, setItemRef] = useState<View>(null);

  const { currentRecording } = useContext(FeedStorageContext);

  return (
    <VideoWrapper key={recording?._id} ref={setItemRef}>
      <FeedVideoComponent
        recording={recording}
        showReport={showReport}
        showUserProfile={showUserProfile}
        showComments={showComments}
        shareCall={shareCall}
        openRecordUser={openRecordUser}
        currentRecording={currentRecording}
        paused={paused}
      />
    </VideoWrapper>
  )
});