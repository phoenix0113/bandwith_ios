import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { observer, Observer } from "mobx-react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video/Video";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarHeight } from "../../utils/styles";
import { BasicSafeAreaView } from "../../components/styled";

import { FeedItemComponent } from "./FeedItem";

import { FeedStorageContext } from "../../services/feed";

import { PageContent, BasicContentWrapper } from "./styled";

const testVideoFile = "../../assets/test_video.mp4";

export const FeedScreen = observer((): JSX.Element => {
  const {
    recordings,
    allRecordingsList,
    loadRecordings,
    setCurrentRecording,
  } = useContext(FeedStorageContext);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const width = Dimensions.get('screen').width;

  const [allRecordings, setAllRecordings] = useState([]);

  const onViewRef = useRef((viewableItems: any) => {
    let item = viewableItems;
    let currentRecording = item.changed[0]["item"];
    setCurrentRecording(currentRecording?._id);
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50
  });

  useEffect(() => {
    setAllRecordings(recordings);
  }, [recordings]);

  const onEndReached = async () => {
    await loadRecordings();
    setAllRecordings(recordings);
  }

  const playerRef = [];

  allRecordingsList.forEach((item) => {
    playerRef[item.toString()] = useRef<Video>(null);
  });

  const onScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    let index = 0;
    allRecordings.forEach((item) => {
      if (index === Math.floor(positionY / height)) {
        playerRef[item._id.toString()].current?.setNativeProps({
          paused: false
        });
        setCurrentRecording(item._id);
      } else {
        if (playerRef[item._id.toString()].current !== null) {
          playerRef[item._id.toString()].current?.setNativeProps({
            paused: true
          });
          playerRef[item._id.toString()].current?.seek(0);
        }
      }
      index++;
    });
  };

  const onPlay = (id: string) => {
    playerRef[id.toString()].current?.setNativeProps({
      paused: false
    })
    console.log(`> Recoding ${id} was resumed manually`);
  }

  const onPause = (id: string) => {
    playerRef[id.toString()].current?.setNativeProps({
      paused: true
    })
    console.log(`> Recoding ${id} was paused manually`);
  }

  const onStop = (id: string) => {
    playerRef[id.toString()].current?.setNativeProps({
      paused: true
    })
    console.log(`> Recoding ${id} was paused manually`);
  }

  const renderItem = useCallback(({ item }) => {
    return <Observer>{() => 
      <BasicContentWrapper>
        <FeedItemComponent
          recording={item}
          height={height + 4}
          onPlay={onPlay}
          onPause={onPause}
          onStop={onStop}
        />
        
        <Video
          paused={false}
          ref={playerRef[item._id.toString()]}
          // source={{uri: recording.list[0].url}}
          source={require(testVideoFile)}
          style={{ height: height + 4, width: width, zIndex: 0, position: "absolute" }}
          repeat={true}
          loop={true}
        />
      </BasicContentWrapper>
    }</Observer>;
  }, []);

  return (
    <BasicSafeAreaView>
      <PageContent>
        <FlatList
          data={allRecordings}
          renderItem={renderItem}
          keyExtractor={(item) => (item?._id + Math.random() * 1000000000).toString()}
          pagingEnabled={true}
          style={styled.flatlist}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onScroll={onScroll}
          scrollEventThrottle={height}
        />
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