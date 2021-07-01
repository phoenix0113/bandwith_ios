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
  const [showPlayBtn, changeShowPlayBtn] = useState(paused);
  const playerRef = useRef<Video>(null);

  const changePlaybackStatus = () => {
    if (!playerRef) return;
    
    if (showPlayBtn) {
      changeShowPlayBtn(false);
    } else {
      changeShowPlayBtn(true);
    }
  };

  return (
    <ProfileFeedContent>
      {
        (!showPlayBtn) ? (
          <FeedPlayerContentWrapperView style={{ height: height }}>
            <FeedPlayerToolTip onPress={changePlaybackStatus}>
              <PlayIcon />
            </FeedPlayerToolTip>
          </FeedPlayerContentWrapperView>
        ) : (
          <FeedPlayerContentWrapper style={{ height: height }} onPress={() => changeShowPlayBtn(false)}>
            <FeedPlayerToolTip onPress={changePlaybackStatus} />
          </FeedPlayerContentWrapper>
        )
      }
      <Video
        source={{uri: uri}}
        resizeMode="cover"
        style={{ width: windowWidth, height: height, position: "absolute" }}
        paused={showPlayBtn}
      />
    </ProfileFeedContent>
  );
});