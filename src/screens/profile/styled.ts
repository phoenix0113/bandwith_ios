import styled from "styled-components/native";
import { Z_INDEX } from "../../components/styled";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const BackContent = styled.TouchableOpacity`
  display: flex;
  padding-left: 18px;
  width: 100%;
`;

export const ProfileUserWrapper = styled.View`
  position: absolute;
  width: ${windowWidth}px;
  height: 100%;
  flex: 1;
  top: 0;
  left: 0;
  z-index: ${Z_INDEX.HIGH};
  background-color: rgb(11, 19, 26);
`;

export const ProfileName = styled.Text`
  font-size: 18px;
  line-height: 21px;
  color: #FFFFFF;
`;

export const ProfileEmail = styled.Text`
  font-size: 17px;
  line-height: 20px;
  color: #E6E6E6;
  margin-bottom: 50px;
`;

export const ProfileContentWrapper = styled.View`
  align-items: center;
  width: 100%;
  height: 100%;
  flex: 1;
`;

export const ProfileImageWrapper = styled.Image`
  margin-bottom: 11px;
  width: 96px;
  height: 96px;
  border-radius: 48px;
`

export const ProfileRecordingContent = styled.View`
  display: flex;
  flex-wrap: wrap;
  align-content: stretch;
  flex-direction: row;
  padding: 2px;
  width: ${windowWidth}px;
`;

export const ProfileVideo = styled.TouchableOpacity`
  position: relative;
  margin: 2px;
  width: ${windowWidth / 3 - 6}px;
  height: ${2 * windowWidth / 3 - 12}px;
  border: 1px solid white;
`;

export const ProfileFeedContent = styled.View`
  position: relative;
`;


export const ProfileFeedVideo = styled.View`
  width: ${windowWidth}px;
`;

export const FeedPlayerContentWrapperView = styled.View`
  position: absolute;
  z-index: ${Z_INDEX.MIDDLE};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FeedPlayerToolTip = styled.TouchableOpacity`
`;

export const FeedPlayerContentWrapper = styled.TouchableOpacity`
  position: absolute;
  z-index: ${Z_INDEX.MIDDLE};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
