import React, { useState, useContext, useEffect, useRef } from "react";
import { Share, ShareContent, Alert } from "react-native";
import Video from "react-native-video/Video";
import { observer } from "mobx-react";
import Spinner from "react-native-loading-spinner-overlay";

import { ProfileComponent } from "../../feed/profile";
import { SharedFeedItemComponent } from "../../feed/SharedItem";
import { CommentsComponent } from "../../../components/Comments";
import { ReportRecordingComponent } from "../../feed/Report";

import { FeedStorageContext } from "../../../services/feed";
import { UserServiceContext } from "../../../services/user";

import { showGeneralErrorAlert } from "../../../utils/notifications";

import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../../utils/constants";
import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";
import { Params, Routes } from "../../../utils/routes";
import { deleteCallRecording } from "../../../axios/routes/feed";

import { VideoWrapper, CommentsFeedItemWrapper, ReportIcon, FeedPlayerContentWrapper,
  FeedPlayerToolTip, FeedPlayerContentWrapperView } from "../../feed/styled";
import { CallPageToolbar, COLORS, BackgroundImage } from "../../../components/styled";

import PlayIcon from "../../../assets/images/feed/play.svg";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";
const reportIcon = "../../../assets/images/feed/report.png";
const deleteIcon = "../../../assets/images/general/delete.png";
const testVideoFile = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const tempProfileIcon = "../../../assets/images/call/default_profile_image.png";
const testBackgroundImage = "../../../assets/images/test.png";

interface IProps {
  recording: GetRecordResponse;
  width: number;
  height: number;
  onBack: () => void;
}

export const RecordingItemComponent  = observer((
  { recording, width, height, onBack }: IProps) => {
  const {
    currentProfileRecording, profile, loadProfileRecordings
  } = useContext(UserServiceContext);
  const {
    sharedRecording,
    fetchSharedRecording,
    cleanSharedRecording,
  } = useContext(FeedStorageContext);

  const playerRef = useRef<Video>(null);
  
  const [sharedRecordingId, setSharedRecordingId] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [onReady, setOnReady] = useState(false);

  useEffect(() => {
    if (sharedRecordingId) {
      fetchSharedRecording(sharedRecordingId);
    }
  }, [sharedRecordingId]);

  useEffect(() => {
    if (currentProfileRecording?._id !== recording?._id) {
      setShowPlayButton(false);
    }
  }, [currentProfileRecording]);

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

  const onLoad = () => {
    setOnReady(true);
  }

  useEffect(() => {
    console.log("currentProfileRecording", currentProfileRecording);
    if (currentProfileRecording?._id !== recording._id) {
      playerRef.current?.setNativeProps({
        paused: true
      })
    } else {
      playerRef.current?.setNativeProps({
        paused: false
      })
    }
    playerRef.current?.seek(0);
  }, [currentProfileRecording])

  const onDelete = async () => {
    await deleteCallRecording({
      recordId: recording?._id,
      authorId: profile?._id,
    });

    await loadProfileRecordings(profile?._id);
    onBack();
  }

  const onDeleteAlert = () => {
    Alert.alert(
      'Delete Call Recording',
      'Are you sure you want to remove this call recording?',
      [
        {
          text: 'OK',
          onPress: () => onDelete()
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
  
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
        <CommentsFeedItemWrapper onPress={showComments}>
          <CommentIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => shareCall(recording)}>
          <ShareIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => showReport(recording?._id)}>
          <ReportIcon source={require(reportIcon)} />
        </CommentsFeedItemWrapper>
        
        <CommentsFeedItemWrapper onPress={onDeleteAlert}>
          <ReportIcon source={require(deleteIcon)} />
        </CommentsFeedItemWrapper>
        
      </CallPageToolbar>

      <Spinner
        visible={!onReady}
        size="large"
        color={COLORS.WHITE}
        overlayColor="0, 0, 0, 0"
        animation="fade"
      />

      {
        (!onReady) && (
          <BackgroundImage
            style={{ width: width, height: height + 4 }}
            source={require(testBackgroundImage)}
          />
        )
      }

      <Video
        paused={false}
        ref={playerRef}
        // source={{uri: recording.list[0].url}}
        source={{ uri: testVideoFile }}
        style={{ height: height + 4, width: width, zIndex: 0, position: "absolute" }}
        repeat={true}
        loop={true}
        onLoad={onLoad}
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
