import styled from "styled-components/native";
import { Z_INDEX } from "../../components/styled";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const PhoneBlock = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 3%;
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

export const ProfileContentWrapper = styled.View`
  align-items: center;
  width: ${windowWidth}px;
  flex: 1;
  z-index: ${Z_INDEX.HIGH};
`;

export const BackContent = styled.TouchableOpacity`
  display: flex;
  padding-left: 18px;
  width: 100%;
`;

export const ProfileFeedVideo = styled.View`
  width: ${windowWidth}px;
`;
