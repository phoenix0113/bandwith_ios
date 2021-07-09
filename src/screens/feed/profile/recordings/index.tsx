import React, { useState, useRef } from "react";
import { observer } from "mobx-react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import Video from "react-native-video/Video";

import { GetRecordResponse } from "../../../../shared/interfaces";

import { ProfileFeedVideo } from "../styled";
import { RecordingItemComponent } from "../recordingItem";
const testVideoFile = "../../../../assets/test_video.mp4";

const width = Dimensions.get('screen').width;

interface IProps {
  recordings: GetRecordResponse[];
  height: number;
}

export const ProfileRecordingComponent = observer(({ recordings, height }: IProps): JSX.Element => {
  
  return (
    <>
      {
        (recordings.length !== 0 && recordings.map((item) => (
          <ProfileFeedVideo style={{ height: height }} key={item._id + (Math.random() * 1000000000).toString()}>
            <RecordingItemComponent
              recording={item}
              width={width}
              height={height}
            />
          </ProfileFeedVideo>
        )))
      }
    </>
  );
});

const styled = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});
