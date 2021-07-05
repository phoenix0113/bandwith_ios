import React, { useContext, useMemo } from "react";

import { observer } from "mobx-react";
import { VideoWrapper } from "../styled";

import { FeedStorageContext } from "../../../services/feed";
import { GetRecordResponse } from "../../../shared/interfaces";

import { FeedVideoComponent } from "../FeedVideo";

interface IProps {
  recording: GetRecordResponse;
}

export const FeedItemComponent  = observer((
  { recording }: IProps) => {
  const { currentRecording } = useContext(FeedStorageContext);

  const paused = useMemo(() => {
    if (recording?._id === currentRecording?._id) {
      return false;
    } else {
      return true;
    }
  }, [currentRecording])

  return (
    <VideoWrapper key={recording?._id}>
      <FeedVideoComponent
        recording={recording}
        paused={paused}
      />
    </VideoWrapper>
  )
});