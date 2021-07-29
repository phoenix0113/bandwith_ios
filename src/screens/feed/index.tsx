import React, { useContext, useRef, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarHeight } from "../../utils/styles";
import { BasicSafeAreaView } from "../../components/styled";

import { FeedRecordingComponent } from "./FeedItem";
import { FeedOptionComponent } from "./FeedOption";

import { FeedStorageContext } from "../../services/feed";

import { PageContent, OptioinsView } from "./styled";

const testVideoFile = "../../assets/test_video.mp4";

export const FeedScreen = observer((): JSX.Element => {
  const {
    recordings,
    setCurrentRecording,
  } = useContext(FeedStorageContext);

  let scrollRef = useRef<ScrollView>(null);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const recordingHeight = height + 4;

  const [position, setPosition] = useState(0);

  const onScrollEndDrag = (event) => {
    if (position > event.nativeEvent.contentOffset.y) {
      setPosition((position > 0) ? position - recordingHeight : 0);
    } else {
      setPosition(position + recordingHeight);
    }
    scrollRef.current?.scrollTo({
      y: position,
      animated: true,
    });
    let index = Math.floor(position/recordingHeight);
    if (index > recordings.length - 1) {
      index = recordings.length - 1;
    }
  }

  const onScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    let index = 0;
    recordings.forEach((item) => {
      if (index === Math.floor(positionY / recordingHeight)) {
        setCurrentRecording(item._id);
      }
      index++;
    });
  }

  return (
    <BasicSafeAreaView>
      <PageContent>
        <FeedOptionComponent
          height={height + 4}
        />
        
        <ScrollView
          onScrollEndDrag={onScrollEndDrag}
          ref={scrollRef}
          onScroll={onScroll}
        >
          <FeedRecordingComponent
            recordings={recordings}
            height={height + 4}
          />
        </ScrollView>
      </PageContent>
    </BasicSafeAreaView>
  )
});

export default FeedScreen;

const styled = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});