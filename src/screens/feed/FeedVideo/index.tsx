import { observer } from "mobx-react";
import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Utils } from "avcore/client";
import { GetRecordResponse, RecordUser } from "../../../shared/interfaces";

import {
  AddToFriendContent, AddToFriendIcon, AddToFriendsWrapper, ContentText, FeedPlayerContentWrapper, FeedPlayerToolTip,
  CommonImgWrapper, CommentsFeedItemWrapper, FeedPlayerContentWrapperView,
} from "../styled";
import { CallPageToolbar } from "../../../components/styled";

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from "react-native-safe-area-view";

const tempProfileIcon = "../../../assets/images/call/default_profile_image.svg";
import { SocketServiceInstance, SocketServiceContext } from "../../../services/socket";
import { UserServiceInstance } from "../../../services/user";

import Video from "react-native-video";
import CommentIcon from "../../../assets/images/feed/comment.svg";
import ShareIcon from "../../../assets/images/feed/share.svg";
import AddIcon from "../../../assets/images/feed/feedAddIcon.svg";
import BackToFeedIcon from "../../../assets/images/call/ExitLive.svg";
import BandwithLogo from "../../../assets/images/Bandwith.svg";
import PlayIcon from "../../../assets/images/feed/play.svg";
import PauseIcon from "../../../assets/images/feed/pause.svg";
import { setWeek } from "date-fns/esm";
import { tabBarHeight } from "../../../utils/styles";

interface IProps {
  recording: GetRecordResponse;
  isShared?: boolean;
  showComments: () => void;
  openRecordUser: (user: RecordUser) => void;
  shareCall?: (recording: GetRecordResponse) => void;
  backToFeed?: () => void;
  currentRecording?: GetRecordResponse;
  paused: boolean;
}

export const FeedVideoComponent = observer(({
  recording, isShared, showComments, openRecordUser, shareCall, backToFeed, currentRecording, paused
}: IProps) => {
  const { contacts } = useContext(SocketServiceContext);
  const playerRef = useRef<Video>(null);
  const [started, setStarted] = useState(false);

  const [showPlayBtn, setShowPlayBtn] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();

  const hidePlayBtn = () => {
    setShowPlayBtn(true);
  }

  const changePlaybackStatus = () => {
    if (!playerRef) return;

    // if (playerRef?.current?.paused) {
    if (showPlayBtn) {
      // if (!started) {
      //   setStarted(true);
      //   console.log("> Setting 'started' to true");
      // }

      setShowPlayBtn(false);
      console.log(`> Recoding ${recording?._id} was resumed manually`);
    } else {
      setShowPlayBtn(true);
      console.log(`> Recoding ${recording?._id} was paused manually`);
    }
  };

  const feedOnScrollPlaybackHandler = () => {
    if (currentRecording._id === recording._id) {
      if (playerRef.current.paused) {
        playerRef.current.play().then(() => setShowPlayBtn(false)).catch(() => {
          console.log("> [Security error] User didn't interact with the page. Showing btn for manual resume");
          if (playerRef.current.paused) {
            setShowPlayBtn(true);
          }
        });
      }
    } else if (!playerRef.current.paused) {
      setShowPlayBtn(true);
    }
    console.log(`> Feed recording ${recording?._id} is ${playerRef.current.paused ? "paused" : "playing"}`);
  };

  const sharedPlaybackHandler = () => {
    if (playerRef.current.paused) {
      playerRef.current.play().then(() => setShowPlayBtn(false)).catch(() => {
        console.log("> [Security error] User didn't interact with the page. Showing btn for manual resume");
        if (playerRef.current.paused) {
          setShowPlayBtn(true);
        }
      });
    }
    console.log(`> Shared recording ${recording._id} is ${playerRef.current.paused ? "paused" : "playing"}`);
  };

  const onEnd = () => {
    setShowPlayBtn(true);
    setCurrentTime(0);
  }

  useEffect(() => {
    if (playerRef && playerRef.current) {
      if (isShared) {
        if (Utils.isSafari && !started) {
          // No reason to try to play it in Safari, it will be blocked in any case
          // trying to play only when it was played manually before
          console.log("> Skip play attempt in Safari for the first time");
          setShowPlayBtn(true);
        } else {
          sharedPlaybackHandler();
        }
      } else {
        if (!currentRecording) {
          return;
        }

        console.log(`> Current recording changed to ${currentRecording._id}. Current recording component: ${recording._id} `);
        if (Utils.isSafari && !started) {
          console.log("> Skip play attempt in Safari for the first time");
          setShowPlayBtn(true);
        } else {
          feedOnScrollPlaybackHandler();
        }
      }
    }

    setShowPlayBtn(paused);
  }, [playerRef, currentRecording, paused]);

  const contentText = useMemo(() => {
    if (UserServiceInstance.profile._id === recording?.user?._id) {
      return "You";
    }
    if (SocketServiceInstance.isContact(recording?.user?._id)) {
      return "Friend";
    }
    return "Unknown User";
  }, [recording, contacts]);

  return (
    <>
      {
        (showPlayBtn) ? (
          <FeedPlayerContentWrapperView>
            <FeedPlayerToolTip onPress={changePlaybackStatus}>
              <PlayIcon />
            </FeedPlayerToolTip>
          </FeedPlayerContentWrapperView>
        ) : (
          <FeedPlayerContentWrapper onPress={hidePlayBtn}>
            <FeedPlayerToolTip onPress={changePlaybackStatus} />
          </FeedPlayerContentWrapper>
        )
      }
      <AddToFriendsWrapper>
        <AddToFriendIcon source={{uri: recording.user?.imageUrl || tempProfileIcon}} />
        <AddToFriendContent>
          <ContentText isTitle>{recording.user?.name}</ContentText>
          <ContentText>{contentText}</ContentText>
        </AddToFriendContent>
        <CommonImgWrapper onPress={() => openRecordUser(recording.user)}>
          <AddIcon />
        </CommonImgWrapper>
      </AddToFriendsWrapper>

      {!!recording?.list?.length && (
        <SafeAreaProvider>
          <SafeAreaView>
            <Video
              paused={showPlayBtn}
              source={{uri: recording.list[0].url}}
              onEnd={onEnd}
              resizeMode="cover"
              style={{ height: height + 4 }}
              currentTime={currentTime}
              repeat={true}
              loop
            />
          </SafeAreaView>
        </SafeAreaProvider>
      )}

      <CallPageToolbar>
        <CommentsFeedItemWrapper onPress={showComments}>
          <CommentIcon />
        </CommentsFeedItemWrapper>
        {
          (!isShared) ?
            <CommentsFeedItemWrapper onPress={() => shareCall(recording)}>
              <ShareIcon />
            </CommentsFeedItemWrapper>
            :
            <></>
        }
      </CallPageToolbar>
    </>
  );
});

const styles = StyleSheet.create({
  feedVideo: {
    position: "relative",
    flex: 1,
  },
});