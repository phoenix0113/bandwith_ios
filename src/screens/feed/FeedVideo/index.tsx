import React, { useState, useContext, useEffect, useRef } from "react";
import { Share, ShareContent } from "react-native";
import Video from "react-native-video/Video";
import { observer } from "mobx-react";

import { ProfileComponent } from "../../feed/profile";
import { SharedFeedItemComponent } from "../../feed/SharedItem";
import { CommentsComponent } from "../../../components/Comments";
import { ReportRecordingComponent } from "../../feed/Report";

import { FeedStorageContext } from "../../../services/feed";

import { showGeneralErrorAlert } from "../../../utils/notifications";

import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../../utils/constants";
import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";
import { Params, Routes } from "../../../utils/routes";

import { VideoWrapper, CommentsFeedItemWrapper, ReportIcon, FeedPlayerContentWrapper,
  FeedPlayerToolTip, FeedPlayerContentWrapperView, AddToFriendIcon } from "../../feed/styled";
import { CallPageToolbar } from "../../../components/styled";

import AddIcon from "../../../assets/images/feed/feedAddIcon.svg";
import PlayIcon from "../../../assets/images/feed/play.svg";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";
const reportIcon = "../../../assets/images/feed/report.png";
const testVideoFile = "../../../assets/test_video.mp4";
const tempProfileIcon = "../../../assets/images/call/default_profile_image.png";

interface IProps {
  recording: GetRecordResponse;
  width: number;
  height: number;
}

export const FeedVideoComponent  = observer((
  { recording, width, height }: IProps) => {
  const {
    currentRecording,
  } = useContext(FeedStorageContext);

  const playerRef = useRef<Video>(null);
  
  const [showPlayButton, setShowPlayButton] = useState(false);

  const onPlay = () => {
    setShowPlayButton(false);
    playerRef.current?.setNativeProps({
      paused: false
    })
  }

  const onPause = () => {
    setShowPlayButton(true);
    playerRef.current?.setNativeProps({
      paused: true
    })
  }
  
  const onStop = () => {
    setShowPlayButton(true);
    playerRef.current?.setNativeProps({
      paused: true
    })
    playerRef.current?.seek(0);
  }

  useEffect(() => {
    if (currentRecording?._id !== recording._id) {
      playerRef.current?.setNativeProps({
        paused: true
      })
    } else {
      playerRef.current?.setNativeProps({
        paused: false
      })
    }
    playerRef.current?.seek(0);
    setShowPlayButton(false);
  }, [currentRecording])

  return (
    <VideoWrapper key={recording?._id} style={{ height: height }}>
      <Video
        paused={false}
        ref={playerRef}
        // source={{uri: recording.list[0].url}}
        source={require(testVideoFile)}
        style={{ height: height + 4, width: width, zIndex: 0, position: "absolute" }}
        repeat={true}
        loop={true}
      />

      {
        (showPlayButton) ? (
          <FeedPlayerContentWrapperView>
            <FeedPlayerToolTip onPress={onPlay}>
              <PlayIcon />
            </FeedPlayerToolTip>
          </FeedPlayerContentWrapperView>
        ) : (
          <FeedPlayerContentWrapper onPress={onPause}>
            <FeedPlayerToolTip onPress={onStop} />
          </FeedPlayerContentWrapper>
        )
      }
    </VideoWrapper>
  )
});
