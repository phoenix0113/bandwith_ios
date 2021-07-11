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
  paused: boolean;
}

export const FeedVideoComponent = observer(({
  recording, paused
}: IProps) => {
  let playerRef = useRef<Video>(null);

  const [showPlayButton, setShowPlayButton] = useState(false);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const width = Dimensions.get('screen').width;

  const onPause = () => {
    playerRef.current?.setNativeProps({
      paused: true
    })
    setShowPlayButton(true);
    console.log(`> Recoding ${recording?._id} was paused manually`);
  }

  const onPlay = () => {
    playerRef.current?.setNativeProps({
      paused: false
    })
    setShowPlayButton(false);
    console.log(`> Recoding ${recording?._id} was resumed manually`);
  }

  const onStop = () => {
    playerRef.current?.setNativeProps({
      paused: true
    })
    setShowPlayButton(true);
    console.log(`> Recoding ${recording?._id} was paused manually`);
  }

  return (
    <>
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

      {!!recording?.list?.length && (
        <SafeAreaProvider>
          <SafeAreaView>
            <Video
              paused={paused}
              ref={playerRef}
              source={{uri: recording.list[0].url}}
              // source={require(testVideoFile)}
              style={{ height: height + 4, width: width }}
              repeat={true}
              loop={true}
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