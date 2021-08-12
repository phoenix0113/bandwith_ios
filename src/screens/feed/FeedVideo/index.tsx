import React, { useState, useContext, useEffect, useRef } from "react";
import Video from "react-native-video/Video";
import { observer } from "mobx-react";
import Spinner from "react-native-loading-spinner-overlay";

import { FeedStorageContext } from "../../../services/feed";
import { GetRecordResponse } from "../../../shared/interfaces";

import { COLORS, BackgroundImage } from "../../../components/styled";
import {
  VideoWrapper, FeedPlayerContentWrapper, FeedPlayerToolTip, FeedPlayerContentWrapperView,
} from "../../feed/styled";

import PlayIcon from "../../../assets/images/feed/play.svg";
const testVideoFile = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

interface IProps {
  recording: GetRecordResponse;
  width: number;
  height: number;
}

export const FeedVideoComponent  = observer((
  { recording, width, height }: IProps) => {
  const {
    currentRecording,
  } = useContext(FeedStorageContext);

  const playerRef = useRef<Video>(null);
  
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [onReady, setOnReady] = useState(false);

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
    setShowPlayButton(false);
  }, [currentRecording])

  return (
    <VideoWrapper key={recording?._id} style={{ height: height }}>
      <Spinner
        visible={!onReady}
        size="large"
        color={COLORS.WHITE}
        overlayColor="rgba(0, 0, 0, 0)"
        animation="fade"
      />

      {
        (!onReady) && (recording.thumbnail) && (
          <BackgroundImage
            style={{ width: width, height: height + 4 }}
            source={{ uri: recording.thumbnail }}
          />
        )
      }

      <Video
        paused={false}
        ref={playerRef}
        source={{uri: recording.list[0].url}}
        // source={{ uri: testVideoFile }}
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
