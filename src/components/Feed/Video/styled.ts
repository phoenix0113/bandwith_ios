import styled from "styled-components/native";
import { COLORS } from "../../styled";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const FeedPageContentWrapper = styled.View`
  position: relative;
  display: flex;
  width: ${windowWidth};
  height: ${windowHeight};
  position: relative;
  background-color: #000000;
  zIndex: 0;
`;

export const ProfileContent = styled.View`
  position: absolute;
  width: 200;
  height: 30;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 104;
  left: 20;
  border-radius: 22.5px;
  padding: 5px 8px;
  background-color: #1F2123;
  zIndex: 1;
`;

export const ProfilePhoto = styled.Image`
  width: 30;
  height: 30;
  border-radius: 50;
`;

export const ProfileText = styled.View`
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
`;

export const ProfileName = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  color: #ffffff;
  line-height: 11.72px;
`;

export const ProfileLevel = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  color: #ffffff;
  opacity: 0.3;
  line-height: 11.72px;
`;

export const AddFollowButton = styled.View`
  display: flex;
  width: 60;
  height: 20;
  marginLeft: auto;
  background-color: #ffffff;
  border-radius: 24;
`;

export const AddFollowText = styled.Text`
  font-size: 12px;
  line-height: 14px;
  color: #E020A9;
  text-align: center;
  margin: auto;
`;

export const VideoContent = styled.View`
  position: absolute;
  top: 0;
  left: 0;
`;

export const PlayPauseButtonContent = styled.View`
  position: absolute;
  display: flex;
  width: ${windowWidth};
  height: ${windowHeight};
`;

export const PlayPauseButton = styled.Image`
  margin: auto;
  width: 25vw;
  opacity: 1;
  transition: opacity 0.35s ease-in 0s;
`;