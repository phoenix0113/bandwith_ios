import React from "react";
import { observer } from "mobx-react";
import { Dimensions } from "react-native";

import { GetRecordResponse } from "../../../shared/interfaces";

import { ProfileFeedVideo } from "../../profile/styled";
import { FeedVideoComponent } from "../FeedVideo";

const width = Dimensions.get('screen').width;

interface IProps {
  recordings: GetRecordResponse[];
  height: number;
}

export const FeedRecordingComponent = observer(({
  recordings, height
}: IProps): JSX.Element => {
  
  return (
    <>
      {
        (recordings.length !== 0 && recordings.map((item) => (
          <ProfileFeedVideo style={{ height: height }} key={item._id + (Math.random() * 1000000000).toString()}>
            <FeedVideoComponent
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
