import React, { useState, useContext, useEffect } from "react";
import { Share, ShareContent } from "react-native";
import { observer } from "mobx-react";

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

import {
  FeatureCount, CommentsFeedItemWrapper, ReportIcon, AddToFriendIcon
} from "../styled";
import { CallPageToolbar } from "../../../components/styled";

import AddIcon from "../../../assets/images/feed/feedAddIcon.svg";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";
const reportIcon = "../../../assets/images/feed/report.png";
const featuredIcon = "../../../assets/images/feed/featured.png";
const unfeaturedIcon = "../../../assets/images/feed/unfeatured.png";
const tempProfileIcon = "../../../assets/images/call/default_profile_image.png";

interface IProps {
  height: number;
}

export const FeedOptionComponent  = observer(({ height }: IProps) => {
  const {
    sharedRecording,
    featuredStatus,
    featuredCount,
    currentRecording,
    fetchSharedRecording,
    cleanSharedRecording,
    updateFeatured,
    checkFeatured,
  } = useContext(FeedStorageContext);

  const { profile } = useContext(UserServiceContext);
  
  const [sharedRecordingId, setSharedRecordingId] = useState(null);

  useEffect(() => {
    if (sharedRecordingId) {
      fetchSharedRecording(sharedRecordingId);
    }
  }, [sharedRecordingId]);

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
      url: `${SERVER_BASE_URL}${Routes.SHARED}/${recording._id}`,
    };

    Share.share(shareCallData);
  };

  const showReport = (id: string) => {
    setIsReport(id);
  }

  const showUserProfile = (id: string) => {
    setCurrentProfileUser(id);
  }

  const onChangeFeatured = async () => {
    await updateFeatured(profile?._id , currentRecording?._id);
    await checkFeatured(currentRecording?._id);
  }

  return (
    <>
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

      <CallPageToolbar>
        {
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
        }

        <CommentsFeedItemWrapper onPress={showComments}>
          <CommentIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={onChangeFeatured}>
          <ReportIcon source={(featuredStatus) ? require(featuredIcon) : require(unfeaturedIcon)} />
          <FeatureCount>{featuredCount}</FeatureCount>
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => shareCall(currentRecording)}>
          <ShareIcon />
        </CommentsFeedItemWrapper>

        <CommentsFeedItemWrapper onPress={() => showReport(currentRecording?._id)}>
          <ReportIcon source={require(reportIcon)} />
        </CommentsFeedItemWrapper>
        
        {
          (currentRecording.authorList.length === 2) && (
            <CommentsFeedItemWrapper onPress={() => showUserProfile((currentRecording?.authorList[1] === currentRecording?.user?._id) ? currentRecording?.user?._id : currentRecording?.participants[0]?._id)}>
              {
                ((currentRecording?.authorList[1] === currentRecording?.user?._id) ? currentRecording?.user?.imageUrl : currentRecording?.participants[0]?.imageUrl) ? (
                  <AddToFriendIcon source={{uri: (currentRecording?.authorList[1] === currentRecording?.user?._id) ? currentRecording?.user?.imageUrl : currentRecording?.participants[0]?.imageUrl}} />
                ) : (
                  <AddToFriendIcon source={require(tempProfileIcon)} />
                )
              }
              <AddIcon style={{ width: 20, height: 20, marginTop: -12, marginLeft: 17 }} />
            </CommentsFeedItemWrapper>
          )
        }
        
      </CallPageToolbar>
    </>
  )
});
