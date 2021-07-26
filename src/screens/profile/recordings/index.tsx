import React from "react";
import { observer } from "mobx-react";
import { Dimensions } from "react-native";

import { GetRecordResponse } from "../../../shared/interfaces";

import { ProfileFeedVideo } from "../styled";
import { RecordingItemComponent } from "../recordingItem";

const width = Dimensions.get('screen').width;

interface IProps {
  recordings: GetRecordResponse[];
  height: number;
  onBack?: () => void;
}

export const ProfileRecordingComponent = observer(({
  recordings, height, onBack
}: IProps): JSX.Element => {
  
  return (
    <>
      {
        (recordings.length !== 0 && recordings.map((item) => (
          <ProfileFeedVideo style={{ height: height }} key={item._id + (Math.random() * 1000000000).toString()}>
            <RecordingItemComponent
              recording={item}
              width={width}
              height={height}
              onBack={onBack}
            />
          </ProfileFeedVideo>
        )))
      }
    </>
  );
});
