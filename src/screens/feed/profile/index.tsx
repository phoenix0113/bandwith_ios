import React, { useState, useEffect, useContext, useRef } from "react";
import { observer } from "mobx-react";
import Video from "react-native-video/Video";
import Spinner from "react-native-loading-spinner-overlay";
import { Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tabBarHeight } from "../../../utils/styles";
import { UserServiceContext } from "../../../services/user";
import { FeedStorageContext } from "../../../services/feed";
import { ProfileRecordingComponent } from "./recordings";

import {
  NavigationBar, LeftItem, CenterItem, RightItem, COLORS, BackgroundImage,
} from "../../../components/styled";
import {
  ProfileUserWrapper, BackContent, ProfileName, ProfileImageWrapper, ProfileEmail, ProfileContentWrapper,
  ProfileRecordingContent, ProfileVideo,
} from "./styled";

import BackIcon from "../../../assets/images/feed/back.svg";
const tempProfileIcon = "../../../assets/images/call/default_profile_image.png";
const testVideoFile = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const testBackgroundImage = "../../../assets/images/test.png";

interface IProps {
  id: string;
  showUserProfile: (id: string) => void;
}

export const ProfileComponent = observer(({ id, showUserProfile }: IProps): JSX.Element => {
  const { profileUser, getUserData } = useContext(UserServiceContext);
  const {
    setCurrentFilterRecording, filterRecordings, getRecordingsByUserID
  } = useContext(FeedStorageContext);
  const width = Dimensions.get('screen').width;
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const recordingHeight = height - 66;
  const [currentRecording, setCurrentRecording] = useState("");
  const [position, setPosition] = useState(0);
  const [recordigns, setRecordings] = useState([]);
  const [onReady, setOnReady] = useState(false);

  const scrollRef = useRef<ScrollView>();

  const onViewRecordings = (id: string) => {
    let index = 0;
    setCurrentRecording(id);
    filterRecordings.forEach((item) => {
      if (item?._id === id) {
        setPosition(index * recordingHeight);
      }
      index++;
    });
  }

  const onLoad = () => {
    setOnReady(true);
  }

  useEffect(() => {
    getUserData(id);
    getRecordingsByUserID(id);
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: position,
      animated: true,
    });
  });

  useEffect(() => {
    setRecordings(filterRecordings);
  }, [filterRecordings]);

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
    if (index > filterRecordings.length - 1) {
      index = filterRecordings.length - 1;
    }
  }

  const onScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    let index = 0;
    filterRecordings.forEach((item) => {
      if (index === Math.floor(positionY / recordingHeight)) {
        setCurrentFilterRecording(item._id);
      }
      index++;
    });
  }

  return (
    <ProfileUserWrapper>
      <NavigationBar>
        <LeftItem>
          <BackContent onPress={() => showUserProfile("")}>
            <BackIcon />
          </BackContent>
        </LeftItem>
        <CenterItem>
          <ProfileName>{profileUser?.name}</ProfileName>
        </CenterItem>
        <RightItem />
      </NavigationBar>
      <ProfileContentWrapper style={{backgroundColor: COLORS.BLACK}}>
        {
          (currentRecording === "") ? (
            <>
              {
                (profileUser?.imageUrl) ? (
                  <ProfileImageWrapper source={{uri: (profileUser?.imageUrl) }} />
                ) : (
                  <ProfileImageWrapper source={require(tempProfileIcon)} />
                )
              }
              <ProfileEmail>{profileUser?.email}</ProfileEmail>
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
                    recordigns.map((recording) => (
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
                recordings={filterRecordings}
                height={recordingHeight}
              />
            </ScrollView>
          )
        }
      </ProfileContentWrapper>
    </ProfileUserWrapper>
  );
});
