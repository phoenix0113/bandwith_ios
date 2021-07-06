import React, { useState, useEffect, useContext, useRef } from "react";
import { observer } from "mobx-react";
import Video from "react-native-video/Video";
import { Dimensions, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tabBarHeight } from "../../utils/styles";
import { UserServiceContext } from "../../services/user";
import { FeedStorageContext } from "../../services/feed";
import { ProfileRecordingComponent } from "./recording";

import {
  NavigationBar, LeftItem, CenterItem, RightItem, COLORS
} from "../../components/styled";
import {
  ProfileUserWrapper, BackContent, ProfileName, ProfileImageWrapper, ProfileEmail, ProfileContentWrapper,
  ProfileRecordingContent, ProfileVideo, ProfileFeedVideo,
} from "./styled";
import BackIcon from "../../assets/images/feed/back.svg";
const tempProfileIcon = "../../assets/images/call/default_profile_image.png";
const testVideoFile = "../../assets/test_video.mp4";

interface IProps {
  id: string;
  showUserProfile: (id: string) => void;
}

export const ProfileScreen = observer(({ id, showUserProfile }: IProps): JSX.Element => {
  const { profileUser, getUserData } = useContext(UserServiceContext);
  const { filterRecordings, getRecordingsByUserID } = useContext(FeedStorageContext);
  const windowWidth = Dimensions.get('screen').width;
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();
  const recordingHeight = height - 66;
  const [currentRecording, setCurrentRecording] = useState("");
  const [position, setPosition] = useState(0);
  const [recordigns, setRecordings] = useState([]);

  const scrollRef = useRef<ScrollView>();

  useEffect(() => {
    getUserData(id);
    getRecordingsByUserID(id);
  }, [id]);

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
    setCurrentRecording(filterRecordings[index]._id);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: position,
      animated: true,
    });
  });

  useEffect(() => {
    setRecordings(filterRecordings);
  }, [filterRecordings]);
  
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
                  {
                    recordigns.map((recording) => (
                      <ProfileVideo key={recording._id} onPress={() => onViewRecordings(recording._id)}>
                        <Video
                          source={{uri: recording.list[0].url}}
                          // source={require(testVideoFile)}
                          style={{ width: windowWidth / 3 - 8, height: 2 * windowWidth / 3 - 14, position: "absolute"}}
                          paused={true}
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
            >
              {
                (recordigns.length !== 0 && recordigns.map((item) => (
                  <ProfileFeedVideo style={{ height: recordingHeight }} key={(Math.random() * 1000000000).toString()}>
                    <ProfileRecordingComponent
                      uri={item.list[0].url}
                      paused={(currentRecording === item._id) ? false : true}
                      height={height - 70}
                    />
                  </ProfileFeedVideo>
                )))
              }
            </ScrollView>
          )
        }
      </ProfileContentWrapper>
    </ProfileUserWrapper>
  );
});