import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { configure } from "mobx";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Spinner from "react-native-loading-spinner-overlay";
import Video from "react-native-video/Video";
import { SharedScreenProps } from "../../navigation/welcome/types";

import { AppServiceContext } from "../../services/app";
import { UserServiceInstance } from "../../services/user";
import { APNServiceContext } from "../../services/APNs";
import { SharedStorageContext } from "../../services/shared";
import { tabBarHeight } from "../../utils/styles";

import {
  PageWrapper, NavigationBar, NavigationText, CenterItem, LeftItem, RightItem,
  COLORS, SpinnerOverlayText, BasicSafeAreaView,
} from "../../components/styled";
import {
  FeedPlayerToolTip, FeedPlayerContentWrapperView, FeedPlayerContentWrapper
} from "../feed/styled";

import PlayIcon from "../../assets/images/feed/play.svg";
const testVideoFile = "../../assets/test_video.mp4";

configure({ enforceActions: "never" });
let servicesInitialized = false;

export const SharedScreen = ({ route, navigation }: SharedScreenProps): JSX.Element => {
  console.log("+++++++++++++++++++++++ Route ++++++++++++++++++++", route);
  console.log("+++++++++++++++++++++++ Navigation ++++++++++++++++++++", navigation);

  const { incomingCallData } = useContext(APNServiceContext);
  const { netAccessible, netConnected, netCurrentType, netOldType } = useContext(AppServiceContext);

  useEffect(() => {
    if (!servicesInitialized && netAccessible === true && netConnected === true) {
      console.log("> Initializing core services...");
      UserServiceInstance.init();
      servicesInitialized = true;
    }
  }, [netAccessible, netConnected]);

  const spinnerText = useMemo(() => {
    if (incomingCallData) {
      return "Proceeding to the call...";
    }
    if (netAccessible === false || netConnected === false) {
      return "You're offline. Check your connection.";
    }
    return null;
  }, [incomingCallData, netAccessible, netConnected]);


  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const width = Dimensions.get('screen').width;

  const {
    sharedRecording, sharedRecordingID, setShareCurrentRecordingID,
  } = useContext(SharedStorageContext);

  const playerRef = useRef<Video>(null);

  const [showPlayBtn, setShowPlayBtn] = useState(true);
  
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
  
  return (
    <BasicSafeAreaView>
      <Spinner
        visible={!!spinnerText}
        textContent={spinnerText}
        textStyle={SpinnerOverlayText.text}
        size="large"
        color={COLORS.WHITE}
        overlayColor={COLORS.BLACK}
        animation="fade"
      />

      <PageWrapper>
        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>Shared</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>
        
        {!!sharedRecording?.list?.length && route.params !== undefined && (
          <>
            <Video
              paused={false}
              ref={playerRef}
              source={{uri: sharedRecording.list[0].url}}
              // source={require(testVideoFile)}
              style={{ height: height + 4, width: width, zIndex: 0, position: "absolute" }}
              repeat={true}
              loop={true}
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
}
