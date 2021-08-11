import React, { useState, useEffect, useRef, useContext } from "react";
import { ScrollView, Dimensions, TouchableOpacity } from "react-native";
import Video from "react-native-video/Video";
import { observer } from "mobx-react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Spinner from "react-native-loading-spinner-overlay";

import { ProfileRecordingComponent } from "./recordings";

import { tabBarHeight } from "../../utils/styles";
import {
  NavigationBar, LeftItem, CenterItem, RightItem, PageWrapper, BasicText,
  NavigationText, BasicSafeAreaView, COLORS, BackgroundImage,
} from "../../components/styled";
import {
  ProfileRecordingContent, ProfileImageWrapper, ProfileVideo, ProfileContentWrapper,
  BackContent,
} from "./styled";

import { UserServiceContext, UserServiceInstance } from "../../services/user";

import BackIcon from "../../assets/images/feed/back.svg";
const tempProfileIcon = "../../assets/images/call/default_profile_image.png";
const testVideoFile = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const testBackgroundImage = "../../assets/images/test.png";

export const ProfileScreen = observer(() => {
  const {
    profile, profileRecordings, setCurrentProfileRecording,
  } = useContext(UserServiceContext);

  const width = Dimensions.get('screen').width;
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const recordingHeight = height - 66;
  const [currentRecording, setCurrentRecording] = useState("");
  const [position, setPosition] = useState(0);
  const [onReady, setOnReady] = useState(false);

  const scrollRef = useRef<ScrollView>();

  const onViewRecordings = (id: string) => {
    let index = 0;
    setCurrentRecording(id);
    profileRecordings.forEach((item) => {
      if (item?._id === id) {
        setPosition(index * recordingHeight);
      }
      index++;
    });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: position,
      animated: true,
    });
  });

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
    if (index > profileRecordings.length - 1) {
      index = profileRecordings.length - 1;
    }
  }

  const onScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    let index = 0;
    profileRecordings.forEach((item) => {
      if (index === Math.floor(positionY / recordingHeight)) {
        setCurrentProfileRecording(item._id);
      }
      index++;
    });
  }

  const onBack = () => {
    setCurrentRecording("");
  }

  const onLoad = () => {
    setOnReady(true);
  }

  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
        <LeftItem>
          {
            (currentRecording === "") ? (
              <></>
            ) : (
              <BackContent onPress={onBack}>
                <BackIcon />
              </BackContent>
            )
          }
        </LeftItem>
          <CenterItem>
            <NavigationText>Profile</NavigationText>
          </CenterItem>
          <RightItem>
            <TouchableOpacity onPress={UserServiceInstance.editProfile}>
              <BasicText
                fontSize="16px"
                lineHeight="16px"
                color={COLORS.ALTERNATIVE}
                textAlign="left"
              >
                Change
              </BasicText>
            </TouchableOpacity>
          </RightItem>
        </NavigationBar>

        <ProfileContentWrapper>
        {
          (currentRecording === "") ? (
            <>
              {
                (profile?.imageUrl) ? (
                  <ProfileImageWrapper source={{uri: (profile?.imageUrl) }} />
                ) : (
                  <ProfileImageWrapper source={require(tempProfileIcon)} />
                )
              }
              <BasicText lineHeight="40px">{profile?.name}</BasicText>
              <ScrollView>
                <ProfileRecordingContent>
                  <Spinner
                    visible={!onReady}
                    size="large"
                    color={COLORS.WHITE}
                    overlayColor="0, 0, 0, 0"
                    animation="fade"
                  />

                  {
                    profileRecordings.map((recording) => (
                      <ProfileVideo key={recording._id} onPress={() => onViewRecordings(recording._id)}>
                        {
                          (!onReady) && (recording.thumbnail) && (
                            <BackgroundImage
                              style={{ width: width / 3 - 8, height: 2 * width / 3 - 14 }}
                              source={{ uri: recording.thumbnail }}
                            />
                          )
                        }

                        <Video
                          source={{uri: recording.list[0].url}}
                          // source={{ uri: testVideoFile }}
                          style={{ width: width / 3 - 8, height: 2 * width / 3 - 14, position: "absolute"}}
                          paused={true}
                          loop={true}
                          onLoad={onLoad}
                        />
                      </ProfileVideo>
                    ))
                  }
                </ProfileRecordingContent>
              </ScrollView>
            </>
          ) : (
            <ScrollView
              onScrollEndDrag={onScrollEndDrag}
              ref={scrollRef}
              onScroll={onScroll}
            >
              <ProfileRecordingComponent
                recordings={profileRecordings}
                height={recordingHeight}
                onBack={onBack}
              />
            </ScrollView>
          )
        }
        </ProfileContentWrapper>

      </PageWrapper>
    </BasicSafeAreaView>
  );
});
