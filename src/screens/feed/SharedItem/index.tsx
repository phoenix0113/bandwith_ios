import React from "react";
import { observer } from "mobx-react";
import { VideoWrapper } from "../styled";

import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";

import { FeedVideoComponent } from "../FeedVideo";

interface IProps {
  recording: GetRecordResponse;
  showComments: () => void;
  openRecordUser: (user: RecordUser) => void;
  backToFeed: () => void;
}

export const SharedFeedItemComponent = observer((
  { recording, openRecordUser, showComments, backToFeed }: IProps,
) => {
  return (
    <VideoWrapper key={recording._id} withoutBorder>
      <FeedVideoComponent
        isShared
        recording={recording}
        showComments={showComments}
        backToFeed={backToFeed}
        openRecordUser={openRecordUser}
      />
    </VideoWrapper>
  );
});
