import styled from "styled-components/native";
import { COLORS, Z_INDEX } from "../../components/styled";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface FeedScrollableWrapperProps {
  hidden?: boolean;
}

interface VideoWrapperProps {
  withoutBorder?: boolean;
  sharedRecording?: boolean;
}

interface BasicContentWrapperProps {
  justifyContent?: "center" | "space-between";
}

interface PageWrapperProps {
  background?: string;
  paddingHorizontal?: string;
  justifyContent?: "space-between"|"flex-start";
}

export const PageContent = styled.View<PageWrapperProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: ${({justifyContent}) => justifyContent || "flex-start"};
  align-items: center;
  background-color: ${({ background }) => background || COLORS.BLACK};
`;


export const BasicContentWrapper = styled.View<BasicContentWrapperProps>`
  position: relative;
  flex-direction: column;
  justify-content: ${({justifyContent}) => justifyContent || "center"};
  align-items: center;
  width: 100%;
  flex: 1;
`;


export const VideoWrapper = styled.View<VideoWrapperProps>`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  z-index: ${({ sharedRecording }) => (sharedRecording ? Z_INDEX.HIGH : 1)};
`;

export const AddToFriendsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  z-index: ${Z_INDEX.MIDDLE};
  top: 10%;
  left: 20px;
  border-radius: 22.5px;
  padding: 5px 8px;
  background: ${COLORS.BLACK};
`;

export const ViewProfile = styled.TouchableOpacity`
`;

export const AddToFriendIcon = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 27px;
`;

export const UserProfileIcon = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 27px;
`;

export const BackIcon = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 27px;
`;

export const AddToFriendContent = styled.View`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;

interface ContentTextProps {
  isTitle?: boolean;
}

export const ContentText = styled.Text<ContentTextProps>`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 13px;
  color: ${({ isTitle }) => (isTitle ? COLORS.ALTERNATIVE : COLORS.WHITE)};
`;

export const CommonImgWrapper = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #ffffff;
`;

export const FeedPlayerContentWrapper = styled.TouchableOpacity`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FeedPlayerContentWrapperView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FeedPlayerToolTip = styled.TouchableOpacity`
`;

interface ToolTipImgWrapperProps {
  opacity: 1|0;
}

export const ToolTipImgWrapper = styled.TouchableOpacity<ToolTipImgWrapperProps>`
  cursor: pointer;
  width: 25vw;
  opacity: ${({ opacity }) => opacity};
  transition: opacity 0.35s ease-in;
`;

/**
 * Single feed
 */
export const SharedFeedItemWrapper = styled.View`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: scroll;
  background-color: ${COLORS.MAIN_LIGHT};
`;

export const CommentsFeedItemWrapper = styled.TouchableOpacity`
  width: 54px;
  height: 54px;
  border-radius: 27px;
  background-color: #ffffff;
  margin: 10px 0;
`;


export const BackToFeedButton = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: ${Z_INDEX.MIDDLE};
`;

export const RecordUserWrapper = styled.View`
  position: absolute;
  width: ${windowWidth}px;
  height: 100%;
  flex: 1;
  top: 0;
  left: 0;
  z-index: ${Z_INDEX.HIGH};
  background-color: rgb(11, 19, 26);
`;

interface NavigationBarProps {
  position?: "absolute";
}

export const NavigationBar = styled.View<NavigationBarProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 21px;
  background-color: rgb(15, 26, 35);
  position: ${({ position }) => position || "relative"};
  z-index: ${Z_INDEX.MIDDLE};
  height: 70px;
  width: 100%;
`;

interface NavigationTextProps {
  color?: string;
}

export const NavigationText = styled.Text<NavigationTextProps>`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
  color: ${({ color }) => color || COLORS.WHITE};
`;

export const RightText = styled.Text`
  color: rgb(10, 255, 239);
`;

const NavigationItem = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const LeftItem = styled(NavigationItem)`
  width: 18%;
  justify-content: flex-start;
`;

export const RightItem = styled(NavigationItem)`
  width: 18%;
  justify-content: flex-end;
`;

export const CenterItem = styled(NavigationItem)`
  flex-grow: 1;
  justify-content: center;
`;

export const ProfileImageContent = styled.View`
  width: 100%;
`;

export const ProfileNameText = styled.Text`
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: 0px;
  text-align: center;
  color: rgb(255, 255, 255);
`;

export const ProfileActionButton = styled.TouchableOpacity`
  height: 50px;
  margin: 2.5% 13px 20px 13px;
  height: 50px;
  padding: 13px 0px 12px;
  border-radius: 6px;
`;

export const ProfileActionText = styled.Text`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0px;
  text-align: center;
`;

export const ProfileContentWrapper = styled.View<BasicContentWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${({justifyContent}) => justifyContent || "center"};
  align-items: center;
  width: 100%;
  flex: 1;
`;

export const TotalContent = styled.View`
  background-color: green;
  z-index: 100;
  margin-top: 4px;
`;

export const PhoneBlock = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 3%;
`;

export const ReportIcon = styled.Image`
  width: 36px;
  height: 36px;
  margin: 8px;
  border-radius: 13.5px;
`;

export const ReportTitle = styled.TextInput`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0px;
  text-align: left;
  padding: 10px;
  margin: 2px 0;
  width: 80%;
  border: 1px solid grey;
  color: #FFFFFF;
`;

export const ReportBody = styled.TextInput`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0px;
  text-align: left;
  padding: 10px;
  margin: 2px 0;
  width: 80%;
  height: 100%;
  border: 1px solid grey;
  color: #FFFFFF;
`;

export const ReportContentWrapper = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const ReportHeader = styled.View`
  margin: 20px 0;
  align-items: center;
  width: 100%;
`;

export const ReportContent = styled.View`
  align-items: center;
  width: 100%;
  height: 50%;
`;

export const ReportFooter = styled.View`
  margin: 20px 0;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const VideoPlayerWrapper = styled.View`
  position: relative;
  width: 100%;
`;

export const VideoPlayerContent = styled.View`
  position: absolute;
  width: 100%;
`;

export const OptioinsView = styled.View`
  border: 1px solid red;
  width: 100%;
  position: absolute;
`;

export const FeatureCount = styled.Text`
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 25px;
  letter-spacing: 0px;
  text-align: center;
  color: red;
  margin-top: -20px;
`;
