import React, { useState, useContext, useEffect, useRef } from "react";
import { Share, ShareContent } from "react-native";
import Video from "react-native-video/Video";
import { observer } from "mobx-react";

import { SharedFeedItemComponent } from "../../SharedItem";
import { CommentsComponent } from "../../../../components/Comments";
import { ReportRecordingComponent } from "../../Report";

import { FeedStorageContext } from "../../../../services/feed";

import { showGeneralErrorAlert } from "../../../../utils/notifications";

import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../../../utils/constants";
import { GetRecordResponse, RecordUser } from "../../../../shared/interfaces";
import { Params, Routes } from "../../../../utils/routes";

import { VideoWrapper } from "../../styled";
import { CallPageToolbar } from "../../../../components/styled";
import { CommentsFeedItemWrapper, ReportIcon } from "../../styled";
import {
  FeedPlayerContentWrapper, FeedPlayerToolTip, FeedPlayerContentWrapperView
} from "../styled";

import PlayIcon from "../../../../assets/images/feed/play.svg";
import CommentIcon from "../../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../../assets/images/feed/share.svg";
const reportIcon = "../../../../assets/images/feed/report.png";
const testVideoFile = "../../../../assets/test_video.mp4";

interface IProps {
  recording: GetRecordResponse;
  width: number;
  height: number;
}

export const RecordingItemComponent  = observer((
  { recording, width, height }: IProps) => {
  const {
    currentRecording,
    sharedRecording,
    fetchSharedRecording,
    cleanSharedRecording,
    currentFilterRecording,
  } = useContext(FeedStorageContext);

  const playerRef = useRef<Video>(null);
  
  const [sharedRecordingId, setSharedRecordingId] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    if (sharedRecordingId) {
      fetchSharedRecording(sharedRecordingId);
    }
  }, [sharedRecordingId]);

  useEffect(() => {
    if (currentRecording?._id !== recording?._id) {
      setShowPlayButton(false);
    }
  }, [currentRecording]);

  const [openedComments, setOpenedComments] = useState(false);
  const showComments = () => setOpenedComments(true);
  const hideComments = () => setOpenedComments(false);
  const [isReport, setIsReport] = useState("");
  const [recordUser, setRecordUser] = useState<RecordUser>(null);

  const openRecordUser = (user: RecordUser) => {
    setRecordUser(user);
  };

  const closeRecordUser = () => {
    setRecordUser(null);
  };

  const backToFeed = () => {
    cleanSharedRecording();
  };

  const shareCall = (recording: GetRecordResponse) => {
    if (!Share.share) {
      showGeneralErrorAlert(NAVIGATOR_SHARE_ERROR);
    }

    const shareCallData: ShareContent = {
      title: `Check out ${recording.user?.name}'s recording`,
      url: `${SERVER_BASE_URL}${Routes.FEED}?${Params.RECORDING_ID}=${recording._id}`,
    };

    Share.share(shareCallData);
  };

  const showReport = (id: string) => {
    setIsReport(id);
  }

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
    console.log("currentFilterRecording", currentFilterRecording);
    console.log("recording", recording);
    if (currentFilterRecording?._id !== recording._id) {
      playerRef.current?.setNativeProps({
        paused: true
      })
    } else {
      playerRef.current?.setNativeProps({
        paused: false
      })
    }
    playerRef.current?.seek(0);
  }, [currentFilterRecording])
  
  return (
    <VideoWrapper key={recording?._id} style={{ height: height }}>
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

      {sharedRecording && (
        <SharedFeedItemComponent
          key={sharedRecording._id}
          openRecordUser={openRecordUser}
          recording={sharedRecording}
          showComments={showComments}
          backToFeed={backToFeed}
        />
      )}

      {openedComments && (
        <CommentsComponent
          id={recording?._id}
          visible={openedComments}
          hide={hideComments}
          isRecording
        />
      )}

      {(isReport !== "") && (
        <ReportRecordingComponent
          closeHandler={() => setIsReport("")}
          id={isReport}
        />
      )}

      <CallPageToolbar>
        <CommentsFeedItemWrapper onPress={showComments}>
          <CommentIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => shareCall(recording)}>
          <ShareIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => showReport(recording?._id)}>
          <ReportIcon source={require(reportIcon)} />
        </CommentsFeedItemWrapper>
      </CallPageToolbar>

      <Video
        paused={false}
        ref={playerRef}
        source={{uri: recording.list[0].url}}
        // source={require(testVideoFile)}
        style={{ height: height + 4, width: width, zIndex: 0, position: "absolute" }}
        repeat={true}
        loop={true}
      />
    </VideoWrapper>
  )
});
