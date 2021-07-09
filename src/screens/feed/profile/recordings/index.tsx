import React, { useState, useRef } from "react";
import { observer } from "mobx-react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import Video from "react-native-video/Video";

import { GetRecordResponse } from "../../../../shared/interfaces";

import { ProfileFeedContent, FeedPlayerContentWrapperView, FeedPlayerToolTip, FeedPlayerContentWrapper } from "../styled";
import PlayIcon from "../../../../assets/images/feed/play.svg";
const testVideoFile = "../../../../assets/test_video.mp4";

const width = Dimensions.get('screen').width;

interface IProps {
  recordings: GetRecordResponse[];
  currentRecording: string;
  height: number;
}

export const ProfileRecordingComponent = observer(({ recordings, currentRecording, height }: IProps): JSX.Element => {
  const recordingRef = [];
  recordings.forEach((item) => {
    recordingRef[item._id] = useRef<Video>(null);
  });

  const renderItem = (({ item }) => {
    return (
      // <Video
      //   paused={false}
      //   ref={playerRef[item._id.toString()]}
      //   // source={{uri: recording.list[0].url}}
      //   source={require(testVideoFile)}
      //   style={{ height: height + 4, width: width, zIndex: 0, position: "absolute" }}
      //   repeat={true}
      //   loop={true}
      // />
      <></>
    )
  });
  return (
    <FlatList
      data={recordings}
      renderItem={renderItem}
      keyExtractor={(item) => (item?._id + Math.random() * 1000000000).toString()}
      pagingEnabled={true}
      style={styled.flatlist}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      // onViewableItemsChanged={onViewRef.current}
      // viewabilityConfig={viewConfigRef.current}
      showsVerticalScrollIndicator={false}
      // onScroll={onScroll}
      scrollEventThrottle={height}
      // onScrollEndDrag={onScrollEndDrag}
    />
  );
});

const styled = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
  }
});
