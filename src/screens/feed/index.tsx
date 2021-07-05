import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { observer, Observer } from "mobx-react";
import { FlatList, StyleSheet, Share, ShareContent, Dimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarHeight } from "../../utils/styles";
import {
  BasicSafeAreaView, CallPageToolbar,
} from "../../components/styled";
import { CommentsComponent } from "../../components/Comments";
import { ProfileScreen } from "../profile";

import { FeedItemComponent } from "./FeedItem";
import { SharedFeedItemComponent } from "./SharedItem";
import { RecordUserComponent } from "./FeedUser";
import { HintComponent } from "../../components/Hint";
import { ReportRecordingComponent } from "./Report";

import { SocketServiceInstance, SocketServiceContext } from "../../services/socket";
import { UserServiceInstance } from "../../services/user";
import { FeedStorageContext } from "../../services/feed";
import { showGeneralErrorAlert } from "../../utils/notifications";
import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../utils/constants";
import { Params, Routes } from "../../utils/routes";

import { GetRecordResponse, RecordUser } from "../../shared/interfaces";

import { AddToFriendContent, AddToFriendIcon, AddToFriendsWrapper, ContentText,
  CommonImgWrapper, ViewProfile, PageContent, BasicContentWrapper, CommentsFeedItemWrapper,
  ReportIcon
} from "./styled";

import AddIcon from "../../assets/images/feed/feedAddIcon.svg";
import CommentIcon from "../../assets/images/feed/comment.svg";
import ShareIcon from "../../assets/images/feed/share.svg";
const reportIcon = "../../assets/images/feed/report.png";
const tempProfileIcon = "../../assets/images/call/default_profile_image.png";

export const FeedScreen = observer((): JSX.Element => {
  const {
    currentRecording,
    sharedRecording,
    recordings,
    loadRecordings,
    setCurrentRecording,
    fetchSharedRecording,
    cleanSharedRecording,
  } = useContext(FeedStorageContext);

  const { contacts } = useContext(SocketServiceContext);

  const insets = useSafeAreaInsets();
  const height = Dimensions.get('screen').height - insets.top - insets.bottom - tabBarHeight();

  const [sharedRecordingId, setSharedRecordingId] = useState(null);

  useEffect(() => {
    if (sharedRecordingId) {
      fetchSharedRecording(sharedRecordingId);
    }
  }, [sharedRecordingId]);

  const [openedComments, setOpenedComments] = useState(false);
  const showComments = () => setOpenedComments(true);
  const hideComments = () => setOpenedComments(false);
  const [isReport, setIsReport] = useState("");
  const [currentProfileUser, setCurrentProfileUser] = useState("");
  const [allRecordings, setAllRecordings] = useState([]);

  const shareCall = (recording: GetRecordResponse) => {
    if (!Share.share) {
      showGeneralErrorAlert(NAVIGATOR_SHARE_ERROR);
    }

    const shareCallData: ShareContent = {
      title: `Check out ${recording.user?.name}'s recording`,
      url: `${SERVER_BASE_URL}${Routes.FEED}?${Params.RECORDING_ID}=${recording._id}`,
    };

    Share.share(shareCallData);
  };

  const [recordUser, setRecordUser] = useState<RecordUser>(null);

  const openRecordUser = (user: RecordUser) => {
    setRecordUser(user);
  };

  const closeRecordUser = () => {
    setRecordUser(null);
  };

  const backToFeed = () => {
    cleanSharedRecording();
  };

  const onViewRef = useRef((viewableItems: any) => {
    let item = viewableItems;
    let currentRecording = item.changed[0]["item"];
    setCurrentRecording(currentRecording?._id);
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50
  });

  const showUserProfile = (id: string) => {
    setCurrentProfileUser(id);
  }

  const showReport = (id: string) => {
    setIsReport(id);
  }

  const onScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    let index = 0;
    allRecordings.forEach((item) => {
      if (index === Math.floor(positionY / height) && currentRecording?._id !== item._id) {
        setCurrentRecording(item._id);
      }
      index++;
    });
    console.log("currentRecording", currentRecording);
  };

  const contentText = useMemo(() => {
    if (UserServiceInstance.profile?._id === currentRecording?.user?._id) {
      return "You";
    }
    if (SocketServiceInstance.isContact(currentRecording?.user?._id)) {
      return "Friend";
    }
    return "Unknown User";
  }, [currentRecording, contacts]);

  useEffect(() => {
    setAllRecordings(recordings);
  }, [recordings]);

  const onEndReached = async () => {
    await loadRecordings();
    setAllRecordings(recordings);
  }

  const getInitialStatus = (item) => {
    if (item?._id === currentRecording?._id) {
      return false;
    } else {
      return true;
    }
  }

  const renderItem = useCallback(({ item }) => {
    return <Observer>{() => 
      <BasicContentWrapper>
        <FeedItemComponent
          recording={item}
        />
      </BasicContentWrapper>
    }</Observer>;
  }, []);

  return (
    <BasicSafeAreaView>
      <PageContent>
        {(currentProfileUser !== "") && (
          <ProfileScreen
            id={currentProfileUser}
            showUserProfile={showUserProfile}
          />
        )}

        {(isReport !== "") && (
          <ReportRecordingComponent
            closeHandler={() => setIsReport("")}
            id={isReport}
          />
        )}

        {recordUser && (
          <RecordUserComponent
            closeHandler={closeRecordUser}
            user={recordUser}
          />
        )}

        <HintComponent page={Routes.FEED} />

        {openedComments && (
          <CommentsComponent
            id={currentRecording?._id}
            visible={openedComments}
            hide={hideComments}
            isRecording
          />
        )}

        {sharedRecording && (
          <SharedFeedItemComponent
            key={sharedRecording._id}
            openRecordUser={openRecordUser}
            recording={sharedRecording}
            showComments={showComments}
            backToFeed={backToFeed}
          />
        )}

        <AddToFriendsWrapper>
          <ViewProfile onPress={() => showUserProfile(currentRecording.user?._id)}>
            {
              (currentRecording.user?.imageUrl) ? (
                <AddToFriendIcon source={{uri: currentRecording.user?.imageUrl}} />
              ) : (
                <AddToFriendIcon source={require(tempProfileIcon)} />
              )
            }
          </ViewProfile>
          <AddToFriendContent>
            <ContentText isTitle>{currentRecording.user?.name}</ContentText>
            <ContentText>{contentText}</ContentText>
          </AddToFriendContent>
          <CommonImgWrapper onPress={() => openRecordUser(currentRecording.user)}>
            <AddIcon />
          </CommonImgWrapper>
        </AddToFriendsWrapper>

        <FlatList
          data={allRecordings}
          renderItem={renderItem}
          keyExtractor={() => (Math.random() * 1000000000).toString()}
          pagingEnabled={true}
          style={styled.flatlist}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onScroll={onScroll}
          scrollEventThrottle={height}
        />

        <CallPageToolbar>
          <CommentsFeedItemWrapper onPress={showComments}>
            <CommentIcon />
          </CommentsFeedItemWrapper>

          <CommentsFeedItemWrapper onPress={() => shareCall(currentRecording)}>
            <ShareIcon />
          </CommentsFeedItemWrapper>

          <CommentsFeedItemWrapper onPress={() => showReport(currentRecording?._id)}>
            <ReportIcon source={require(reportIcon)} />
          </CommentsFeedItemWrapper>
        </CallPageToolbar>
      </PageContent>
    </BasicSafeAreaView>
  )
});

export default FeedScreen;

const styled = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});