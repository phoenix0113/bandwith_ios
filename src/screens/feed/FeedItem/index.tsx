import React, { useState, useContext, useMemo, useEffect } from "react";
import { Share, ShareContent } from "react-native";
import { observer } from "mobx-react";

import { ProfileComponent } from "../profile";
import { SharedFeedItemComponent } from "../SharedItem";
import { CommentsComponent } from "../../../components/Comments";
import { ReportRecordingComponent } from "../Report";
import { RecordUserComponent } from "../FeedUser";
import { HintComponent } from "../../../components/Hint";

import { SocketServiceInstance, SocketServiceContext } from "../../../services/socket";
import { UserServiceInstance } from "../../../services/user";
import { FeedStorageContext } from "../../../services/feed";

import { showGeneralErrorAlert } from "../../../utils/notifications";

import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../../utils/constants";
import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";
import { Params, Routes } from "../../../utils/routes";

import { VideoWrapper } from "../styled";
import { CallPageToolbar } from "../../../components/styled";
import { AddToFriendIcon, CommentsFeedItemWrapper, ReportIcon,
  FeedPlayerContentWrapper, FeedPlayerToolTip, FeedPlayerContentWrapperView
} from "../styled";

import PlayIcon from "../../../assets/images/feed/play.svg";
import AddIcon from "../../../assets/images/feed/feedAddIcon.svg";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";
const reportIcon = "../../../assets/images/feed/report.png";
const tempProfileIcon = "../../../assets/images/call/default_profile_image.png";

interface IProps {
  // recording: GetRecordResponse;
  height: number;
  onPlay: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
}

export const FeedItemComponent  = observer((
  { height, onPlay, onPause, onStop }: IProps) => {
  const {
    currentRecording,
    sharedRecording,
    fetchSharedRecording,
    cleanSharedRecording,
  } = useContext(FeedStorageContext);

  const { contacts } = useContext(SocketServiceContext);
  
  const [sharedRecordingId, setSharedRecordingId] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    if (sharedRecordingId) {
      fetchSharedRecording(sharedRecordingId);
    }
  }, [sharedRecordingId]);

  // useEffect(() => {
  //   if (currentRecording?._id !== recording?._id) {
  //     setShowPlayButton(false);
  //   }
  // }, [currentRecording]);

  const [openedComments, setOpenedComments] = useState(false);
  const showComments = () => setOpenedComments(true);
  const hideComments = () => setOpenedComments(false);
  const [isReport, setIsReport] = useState("");
  const [currentProfileUser, setCurrentProfileUser] = useState("");

  const [recordUser, setRecordUser] = useState<RecordUser>(null);

  const showUserProfile = (id: string) => {
    console.log(id);
    setCurrentProfileUser(id);
  }

  const contentText = (id: string) => useMemo(() => {
    if (UserServiceInstance.profile?._id === id) {
      return "You";
    }
    if (SocketServiceInstance.isContact(id)) {
      return "Friend";
    }
    return "Unknown User";
  }, [contacts]);

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

  const play = () => {
    setShowPlayButton(false);
    return onPlay(currentRecording._id);
  }

  const pause = () => {
    setShowPlayButton(true);
    return onPause(currentRecording._id);
  }
  
  const stop = () => {
    setShowPlayButton(true);
    return onStop(currentRecording._id);
  }
  
  return (
    <VideoWrapper key={currentRecording?._id} style={{ height: height }}>
      {
        (showPlayButton) ? (
          <FeedPlayerContentWrapperView>
            <FeedPlayerToolTip onPress={play}>
              <PlayIcon />
            </FeedPlayerToolTip>
          </FeedPlayerContentWrapperView>
        ) : (
          <FeedPlayerContentWrapper onPress={pause}>
            <FeedPlayerToolTip onPress={stop} />
          </FeedPlayerContentWrapper>
        )
      }

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
          id={currentRecording?._id}
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

      {recordUser && (
        <RecordUserComponent
          closeHandler={closeRecordUser}
          user={recordUser}
        />
      )}

      <HintComponent page={Routes.FEED} />

      <CallPageToolbar>
        <CommentsFeedItemWrapper onPress={() => showUserProfile((currentRecording?.authorList[0] === currentRecording?.user?._id) ? currentRecording?.user?._id : currentRecording?.participants[0]?._id)}>
          {
            ((currentRecording?.authorList[0] === currentRecording?.user?._id) ? currentRecording?.user?.imageUrl : currentRecording?.participants[0]?.imageUrl) ? (
              <AddToFriendIcon source={{uri: (currentRecording?.authorList[0] === currentRecording?.user?._id) ? currentRecording?.user?.imageUrl : currentRecording?.participants[0]?.imageUrl}} />
            ) : (
              <AddToFriendIcon source={require(tempProfileIcon)} />
            )
          }
          <AddIcon style={{ width: 20, height: 20, marginTop: -12, marginLeft: 17 }} />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={showComments}>
          <CommentIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => shareCall(currentRecording)}>
          <ShareIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => showReport(currentRecording?._id)}>
          <ReportIcon source={require(reportIcon)} />
        </CommentsFeedItemWrapper>
      </CallPageToolbar>
    </VideoWrapper>
  )
});
