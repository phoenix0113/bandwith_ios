import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { Dimensions } from "react-native";
import Video from "react-native-video";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tabBarHeight } from "../../../utils/styles";
import { ProfileFeedContent, FeedPlayerContentWrapperView, FeedPlayerToolTip, FeedPlayerContentWrapper } from "../styled";
import PlayIcon from "../../../assets/images/feed/play.svg";

const windowWidth = Dimensions.get('screen').width;

interface IProps {
  uri: string;
  paused: boolean;
  height: number;
}

export const ProfileRecordingComponent = observer(({ uri, paused, height }: IProps): JSX.Element => {
  const [playStatus, setPlayStatus] = useState(paused);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const playerRef = useRef<Video>(null);

  const pausePlay = () => {
    setPlayStatus(false);
    setShowPlayButton(true);
  }

  const changePlaybackStatus = () => {
    if (!playerRef) return;
    
    if (playStatus) {
      setPlayStatus(false);
      setShowPlayButton(true);
    } else {
      setPlayStatus(true);
      setShowPlayButton(false);
    }
  };

  return (
    <ProfileFeedContent>
      {
        (showPlayButton) ? (
          <FeedPlayerContentWrapperView style={{ height: height }}>
            <FeedPlayerToolTip onPress={changePlaybackStatus}>
              <PlayIcon />
            </FeedPlayerToolTip>
          </FeedPlayerContentWrapperView>
        ) : (
          <FeedPlayerContentWrapper style={{ height: height }} onPress={pausePlay}>
            <FeedPlayerToolTip onPress={changePlaybackStatus} />
          </FeedPlayerContentWrapper>
        )
      }
      <Video
        source={{uri: uri}}
        resizeMode="cover"
        style={{ width: windowWidth, height: height, position: "absolute" }}
        paused={playStatus}
      />
    </ProfileFeedContent>
  );
});