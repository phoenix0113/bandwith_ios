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
    sharedRecording,
    fetchSharedRecording,
    cleanSharedRecording,
    currentRecording,
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
  const [currentProfileUser, setCurrentProfileUser] = useState("");

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
    console.log("currentRecording", currentRecording);
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
  }, [currentRecording])

  const showUserProfile = (id: string) => {
    console.log(id);
    setCurrentProfileUser(id);
  }

  return (
    <VideoWrapper key={recording?._id} style={{ height: height }}>
      {(currentProfileUser !== "") && (
        <ProfileComponent
          id={currentProfileUser}
          showUserProfile={showUserProfile}
        />
      )}

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
        {
          <CommentsFeedItemWrapper onPress={() => showUserProfile((recording?.authorList[0] === recording?.user?._id) ? recording?.user?._id : recording?.participants[0]?._id)}>
            {
              ((recording?.authorList[0] === recording?.user?._id) ? recording?.user?.imageUrl : recording?.participants[0]?.imageUrl) ? (
                <AddToFriendIcon source={{uri: (recording?.authorList[0] === recording?.user?._id) ? recording?.user?.imageUrl : recording?.participants[0]?.imageUrl}} />
              ) : (
                <AddToFriendIcon source={require(tempProfileIcon)} />
              )
            }
            <AddIcon style={{ width: 20, height: 20, marginTop: -12, marginLeft: 17 }} />
          </CommentsFeedItemWrapper>
        }

        <CommentsFeedItemWrapper onPress={showComments}>
          <CommentIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => shareCall(recording)}>
          <ShareIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => showReport(recording?._id)}>
          <ReportIcon source={require(reportIcon)} />
        </CommentsFeedItemWrapper>
        
        {
          (recording.authorList.length === 2) && (
            <CommentsFeedItemWrapper onPress={() => showUserProfile((recording?.authorList[1] === recording?.user?._id) ? recording?.user?._id : recording?.participants[0]?._id)}>
              {
                ((recording?.authorList[1] === recording?.user?._id) ? recording?.user?.imageUrl : recording?.participants[0]?.imageUrl) ? (
                  <AddToFriendIcon source={{uri: (recording?.authorList[1] === recording?.user?._id) ? recording?.user?.imageUrl : recording?.participants[0]?.imageUrl}} />
                ) : (
                  <AddToFriendIcon source={require(tempProfileIcon)} />
                )
              }
              <AddIcon style={{ width: 20, height: 20, marginTop: -12, marginLeft: 17 }} />
            </CommentsFeedItemWrapper>
          )
        }
        
      </CallPageToolbar>

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
