import { observer } from "mobx-react";
import React, { useState, useRef } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from "react-native-safe-area-view";
import Video from "react-native-video/Video";

import { GetRecordResponse } from "../../../shared/interfaces";

import { tabBarHeight } from "../../../utils/styles";
import {
  FeedPlayerContentWrapper, FeedPlayerToolTip, FeedPlayerContentWrapperView, 
} from "../styled";

import PlayIcon from "../../../assets/images/feed/play.svg";
const testVideoFile = "../../../assets/test_video.mp4";

interface IProps {
  recording: GetRecordResponse;
  paused?: boolean;
}

export const FeedVideoComponent = observer(({
  recording, paused
}: IProps) => {
  let playerRef = useRef<Video>(null);

  const [pausedStatus, setPausedStatus] = useState(paused);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const width = Dimensions.get('screen').width;

  const hidePlayBtn = () => {
    setShowPlayButton(true);
    setPausedStatus(true);
  }

  const changePlaybackStatus = () => {
    if (!playerRef) return;
    
    if (pausedStatus) {
      setPausedStatus(false);
      setShowPlayButton(false);
      console.log(`> Recoding ${recording?._id} was resumed manually`);
    } else {
      setPausedStatus(true);
      setShowPlayButton(true);
      console.log(`> Recoding ${recording?._id} was paused manually`);
    }
  };

  const onEnd = () => {
    setPausedStatus(true);
    setCurrentTime(0);
  }

  return (
    <>
      {
        (showPlayButton) ? (
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

      {!!recording?.list?.length && (
        <SafeAreaProvider>
          <SafeAreaView>
            <Video
              paused={pausedStatus}
              source={{uri: recording.list[0].url}}
              // source={require(testVideoFile)}
              onEnd={onEnd}
              style={{ height: height + 4, width: width }}
              currentTime={currentTime}
              repeat={true}
              loop
            />
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  feedVideo: {
    position: "relative",
    flex: 1,
  },
});