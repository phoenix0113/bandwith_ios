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

export const ProfileRecordingContent = styled.ScrollView`
  margin-top: 50px;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const ProfileVideo = styled.View`
  width: 33.3333%;
  height: 100%;
  position: relative;
`;