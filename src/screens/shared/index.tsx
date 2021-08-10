import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { configure } from "mobx";
import { Dimensions } from "react-native";
import { observer } from "mobx-react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Spinner from "react-native-loading-spinner-overlay";
import Video from "react-native-video/Video";

import { MainNavigationNavigationProps } from "../../navigation/welcome/types";
import { AppServiceContext } from "../../services/app";
import { UserServiceInstance } from "../../services/user";
import { APNServiceContext } from "../../services/APNs";
import { SharedStorageContext } from "../../services/shared";
import { tabBarHeight } from "../../utils/styles";

import {
  PageWrapper, NavigationBar, NavigationText, CenterItem, LeftItem, RightItem,
  COLORS, BasicSafeAreaView, BackgroundImage,
} from "../../components/styled";
import {
  FeedPlayerToolTip, FeedPlayerContentWrapperView, FeedPlayerContentWrapper
} from "../feed/styled";

import PlayIcon from "../../assets/images/feed/play.svg";
import BackButtonIcon from "../../assets/images/general/BackButtonIcon.svg";
const testVideoFile = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const testBackgroundImage = "../../assets/images/test.png";

configure({ enforceActions: "never" });
let servicesInitialized = false;

type WithNavigatorScreen = {
  navigation: MainNavigationNavigationProps;
}

export const SharedScreen = observer(({navigation}: WithNavigatorScreen) => {
  const { incomingCallData } = useContext(APNServiceContext);
  const { netAccessible, netConnected } = useContext(AppServiceContext);

  useEffect(() => {
    if (!servicesInitialized && netAccessible === true && netConnected === true) {
      console.log("> Initializing core services...");
      UserServiceInstance.init();
      servicesInitialized = true;
    }
  }, [netAccessible, netConnected]);

  const spinnerText = useMemo(() => {
    if (incomingCallData) {
      return "Recording Loading...";
    }
    return null;
  }, [incomingCallData, netAccessible, netConnected]);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('window').height - insets.top - insets.bottom - tabBarHeight();
  const width = Dimensions.get('window').width;

  const { sharedRecording, setShareCurrentRecordingID } = useContext(SharedStorageContext);

  const playerRef = useRef<Video>(null);

  const [showPlayBtn, setShowPlayBtn] = useState(false);
  const [onReady, setOnReady] = useState(false);
  
  const onPlay = () => {
    setShowPlayBtn(false);
    playerRef.current?.setNativeProps({
      paused: false
    })
  }

  const onPause = () => {
    setShowPlayBtn(true);
    playerRef.current?.setNativeProps({
      paused: true
    })
  }
  
  const onStop = () => {
    setShowPlayBtn(true);
    playerRef.current?.setNativeProps({
      paused: true
    })
    playerRef.current?.seek(0);
  }

  const onBack = () => {
    setShareCurrentRecordingID("");
    navigation.navigate("Main");
  }
  
  const onLoad = () => {
    setOnReady(true);
  }

  return (
    <BasicSafeAreaView>
      <Spinner
        visible={!onReady}
        size="large"
        color={COLORS.WHITE}
        overlayColor="0, 0, 0, 0"
        animation="fade"
      />

      {
        (!onReady) && (
          <BackgroundImage
            style={{ width: width, height: height }}
            source={require(testBackgroundImage)}
          />
        )
      }

      <PageWrapper>
        <NavigationBar style={{ width: width }}>
          <LeftItem onPress={onBack} style={{ paddingLeft: 21 }}>
            <BackButtonIcon />
          </LeftItem>
          <CenterItem>
            <NavigationText>Shared</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>
        
        {!!sharedRecording?.list?.length && (
          <>
            <Video
              paused={false}
              ref={playerRef}
              // source={{uri: sharedRecording.list[0].url}}
              source={{ uri: testVideoFile }}
              style={{ height: height, width: width, zIndex: 0, position: "absolute", top: 50 }}
              repeat={true}
              loop={true}
              onLoad={onLoad}
            />

            {
              (showPlayBtn) ? (
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
          </>
        )}
      </PageWrapper>
    </BasicSafeAreaView>
  );
});
