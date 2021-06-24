import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react";
import Video from "react-native-video";
import { Dimensions } from "react-native";

import { UserServiceContext } from "../../services/user";
import { GetRecordResponse } from "../../shared/interfaces";

import {
  NavigationBar, LeftItem, CenterItem, RightItem, COLORS
} from "../../components/styled";
import {
  ProfileUserWrapper, BackContent, ProfileName, ProfileImageWrapper, ProfileEmail, ProfileContentWrapper,
  ProfileRecordingContent, ProfileVideo,
} from "./styled";
import BackIcon from "../../assets/images/feed/back.svg";

interface IProps {
  id: string;
  currentRecordings: Array<GetRecordResponse>;
  showUserProfile: (id: string) => void;
}

export const ProfileScreen = observer(({ id, showUserProfile, currentRecordings }: IProps): JSX.Element => {
  const { profileUser, getUserData } = useContext(UserServiceContext);
  const width = Dimensions.get('screen').width;

  useEffect(() => {
    getUserData(id);
  }, [id]);
  
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
          <ProfileImageWrapper source={{uri: profileUser?.imageUrl}} />
          <ProfileEmail>{profileUser?.email}</ProfileEmail>
          <ProfileRecordingContent>
            {
              currentRecordings.map((recording) => (
                <ProfileVideo key={recording._id}>
                  <Video
                    source={{uri: recording.list[0].url}}
                    style={{width: width / 3, height: "100%"}}
                  />
                </ProfileVideo>
              ))
            }
          </ProfileRecordingContent>
        </ProfileContentWrapper>
    </ProfileUserWrapper>
  );
});