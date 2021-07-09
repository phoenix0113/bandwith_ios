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
import {CallPageToolbar } from "../../../components/styled";
import { AddToFriendContent, AddToFriendIcon, AddToFriendsWrapper, ContentText,
  CommonImgWrapper, ViewProfile, CommentsFeedItemWrapper, ReportIcon,
  FeedPlayerContentWrapper, FeedPlayerToolTip, FeedPlayerContentWrapperView
} from "../styled";

import PlayIcon from "../../../assets/images/feed/play.svg";
import AddIcon from "../../../assets/images/feed/feedAddIcon.svg";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";
const reportIcon = "../../../assets/images/feed/report.png";
const tempProfileIcon = "../../../assets/images/call/default_profile_image.png";

interface IProps {
  recording: GetRecordResponse;
  height: number;
  onPlay: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
}

export const FeedItemComponent  = observer((
  { recording, height, onPlay, onPause, onStop }: IProps) => {
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

  useEffect(() => {
    if (currentRecording?._id !== recording?._id) {
      setShowPlayButton(false);
    }
  }, [currentRecording]);

  const [openedComments, setOpenedComments] = useState(false);
  const showComments = () => setOpenedComments(true);
  const hideComments = () => setOpenedComments(false);
  const [isReport, setIsReport] = useState("");
  const [currentProfileUser, setCurrentProfileUser] = useState("");

  const [recordUser, setRecordUser] = useState<RecordUser>(null);

  const showUserProfile = (id: string) => {
    setCurrentProfileUser(id);
  }

  const contentText = useMemo(() => {
    if (UserServiceInstance.profile?._id === recording?.user?._id) {
      return "You";
    }
    if (SocketServiceInstance.isContact(recording?.user?._id)) {
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
    return onPlay(recording._id);
  }

  const pause = () => {
    setShowPlayButton(true);
    return onPause(recording._id);
  }
  
  const stop = () => {
    setShowPlayButton(true);
    return onStop(recording._id);
  }
  
  return (
    <VideoWrapper key={recording?._id} style={{ height: height }}>
      <AddToFriendsWrapper>
        <ViewProfile onPress={() => showUserProfile(recording?.user?._id)}>
          {
            (recording?.user?.imageUrl) ? (
              <AddToFriendIcon source={{uri: recording?.user?.imageUrl}} />
            ) : (
              <AddToFriendIcon source={require(tempProfileIcon)} />
            )
          }
        </ViewProfile>
        <AddToFriendContent>
          <ContentText isTitle>{recording?.user?.name}</ContentText>
          <ContentText>{contentText}</ContentText>
        </AddToFriendContent>
        <CommonImgWrapper onPress={() => openRecordUser(recording?.user)}>
          <AddIcon />
        </CommonImgWrapper>
      </AddToFriendsWrapper>

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

      {recordUser && (
        <RecordUserComponent
          closeHandler={closeRecordUser}
          user={recordUser}
        />
      )}

      <HintComponent page={Routes.FEED} />

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
    </VideoWrapper>
  )
});
