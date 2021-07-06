import React, { useState, useRef } from "react";
import { observer } from "mobx-react";
import { Dimensions } from "react-native";
import Video from "react-native-video/Video";

import { ProfileFeedContent, FeedPlayerContentWrapperView, FeedPlayerToolTip, FeedPlayerContentWrapper } from "../styled";
import PlayIcon from "../../../assets/images/feed/play.svg";
const testVideoFile = "../../../assets/test_video.mp4";

const windowWidth = Dimensions.get('screen').width;

interface IProps {
  uri: string;
  paused: boolean;
  height: number;
}

export const ProfileRecordingComponent = observer(({ uri, paused, height }: IProps): JSX.Element => {
  const [pausedStatus, setPausedStatus] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  let playerRef = useRef<Video>(null);

  const pausePlay = () => {
    setPausedStatus(true);
    setShowPlayButton(true);
  }

  const changePlaybackStatus = () => {
    if (!playerRef) return;
    if (pausedStatus) {
      setPausedStatus(false);
      setShowPlayButton(false);
    } else {
      setPausedStatus(true);
      setShowPlayButton(true);
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
        // source={require(testVideoFile)}
        style={{ width: windowWidth, height: height, position: "absolute" }}
        paused={pausedStatus}
        ref={(ref) => {
          playerRef = ref;
        }}
        repeat={true}
        loop
      />
    </ProfileFeedContent>
  );
});