import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet, Dimensions } from "react-native";
import {
  AddToFriendContent, AddToFriendIcon, AddToFriendsWrapper, ContentText, BackToFeedButton, FeedPlayerContentWrapper, FeedPlayerToolTip,
  CommonImgWrapper, CommentsFeedItemWrapper,
} from "../styled";
import { RecordUser } from "../../../shared/interfaces";
import { CallPageToolbar } from "../../../components/styled";

import Video from "react-native-video";
import AddIcon from "../../../assets/images/feed/feedAddIcon.svg";
import PlayIcon from "../../../assets/images/feed/play.svg";
import PauseIcon from "../../../assets/images/feed/pause.svg";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";

const height = Dimensions.get('window').height;

interface Iprops {
  id: string;
  photo: string;
  name: string;
  level: string;
  link: string;
  status: boolean;
  feedItemCommentsStatus: boolean;
  feedItemShareStatus: boolean;
  openRecordUser: (user: RecordUser) => void;
}

export const FeedVideoComponent = observer(({
  id,
  photo,
  name,
  level,
  link,
  status,
  feedItemCommentsStatus,
  feedItemShareStatus,
  openRecordUser,
}: Iprops) => {
  const [feedItemID, setFeedItemID] = useState("");
  const [feedItemPhoto, setFeedItemPhoto] = useState("");
  const [feedItemName, setFeedItemName] = useState("");
  const [feedItemLevel, setFeedItemLevel] = useState("");
  const [feedItemLink, setFeedItemLink] = useState("");
  const [feedItemStatus, setFeedItemStatus] = useState(false);
  const [commentsStatus, setCommentsStatus] = useState(false);
  const [shareStatus, setShareStatus] = useState(false);

  useEffect(() => {
    setFeedItemID(id);
    setFeedItemPhoto(photo);
    setFeedItemName(name);
    setFeedItemLevel(level);
    setFeedItemLink(link);
    setFeedItemStatus(status);
    setCommentsStatus(feedItemCommentsStatus);
    setShareStatus(feedItemShareStatus);
  }, [id, photo, name, level, link, status, feedItemCommentsStatus, feedItemShareStatus]);

  // function for change video play status
  const changePlaybackStatus = () => {
    setFeedItemStatus(!feedItemStatus);
  }

  //function for show/hide comments
  const showComments = () => {
    setCommentsStatus(true);
  }

  //function for show/hide comments
  const shareCall = () => {
    setShareStatus(true);
  }

  const openRecordUserTemp = ({
    _id: feedItemID,
    name: feedItemName,
    imageUrl: feedItemPhoto
  }) => {
    console.log("here");
  }

  return (
    <>
    {
      (feedItemID !== "") ?
        <>
          <AddToFriendsWrapper>
            <AddToFriendIcon source={{uri: feedItemPhoto}} />
            <AddToFriendContent>
              <ContentText isTitle>{feedItemName}</ContentText>
              <ContentText>{feedItemLevel}</ContentText>
            </AddToFriendContent>
            <CommonImgWrapper onPress={() => openRecordUserTemp({
              _id: feedItemID,
              name: feedItemName,
              imageUrl: feedItemPhoto
            })}>
              <AddIcon />
            </CommonImgWrapper>
          </AddToFriendsWrapper>

          <FeedPlayerContentWrapper>
            <FeedPlayerToolTip onPress={changePlaybackStatus}>
              {
                (feedItemStatus) ? <PlayIcon /> : <PauseIcon />
              }
            </FeedPlayerToolTip>
          </FeedPlayerContentWrapper>

          <Video
            source={{uri: feedItemLink}}
            resizeMode="cover"
            style={styled.feedVideo}
            paused={feedItemStatus}
          />

          <CallPageToolbar>
            <CommentsFeedItemWrapper onPress={showComments}>
              <CommentIcon />
            </CommentsFeedItemWrapper>
            {
              (!shareStatus) ?
                <CommentsFeedItemWrapper onPress={shareCall}>
                  <ShareIcon />
                </CommentsFeedItemWrapper>
                :
                <></>
            }
            
          </CallPageToolbar>
        </> :
        <></>
    }
    </>
  );
});

const styled = StyleSheet.create({
  feedVideo: {
    flex: 1,
    height: height * 0.78,
  }
});


