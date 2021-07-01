import React, { useState, useEffect, useContext, useRef } from "react";
import { observer } from "mobx-react";
import Video from "react-native-video";
import { Dimensions, ScrollView } from "react-native";
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
        setPosition(index * (height - 66));
      }
      index++;
    });
  }

  const onScroll = () => {
    console.log("+++++++++++++++++++++++++++");
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
                          style={{ width: windowWidth / 3 - 8, height: 2 * windowWidth / 3 - 14, position: "absolute"}}
                          paused={(recording._id === currentRecording) ? false : true}
                        />
                      </ProfileVideo>
                    ))
                  }
                </ProfileRecordingContent>
              </ScrollView>
            </>
          ) : (
            <ScrollView
              onScroll={onScroll}
              ref={scrollRef}
            >
              {
                (recordigns.length !== 0 && recordigns.map((item) => (
                  <ProfileFeedVideo style={{ height: height - 66 }} key={(Math.random() * 1000000000).toString()}>
                    <ProfileRecordingComponent
                      uri={item.list[0].url}
                      paused={(currentRecording === item._id) ? true : false}
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