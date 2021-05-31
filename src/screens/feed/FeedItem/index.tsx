import React, { useContext, useState } from "react";
import { View } from "react-native";

import { observer } from "mobx-react";
import { VideoWrapper } from "../styled";

import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";

import { FeedStorageContext } from "../../../services/feed";

import { FeedVideoComponent } from "../FeedVideo";

interface IProps {
  // observer: IntersectionObserver;
  recording: GetRecordResponse;
  showComments: () => void;
  shareCall: (recording: GetRecordResponse) => void;
  openRecordUser: (user: RecordUser) => void;
}

export const FeedItemComponent  = observer((
  { recording, openRecordUser, shareCall, showComments }: IProps) => {
  
  const [itemRef, setItemRef] = useState<View>(null);

  const { currentRecording } = useContext(FeedStorageContext);

  // useEffect(() => {
  //   if (itemRef) {
  //     observer.observe(itemRef);
  //   }

  //   return () => {
  //     if (itemRef) {
  //       observer.unobserve(itemRef);
  //     }
  //   };
  // }, [observer, itemRef]);

  return (
    <VideoWrapper key={recording?._id} ref={setItemRef}>
      <FeedVideoComponent
        recording={recording}
        showComments={showComments}
        shareCall={shareCall}
        openRecordUser={openRecordUser}
        currentRecording={currentRecording}
      />
    </VideoWrapper>
  )
});