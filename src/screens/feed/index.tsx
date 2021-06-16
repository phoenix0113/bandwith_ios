import React, { useContext, useEffect, useRef, useState } from "react";
import { observer, Observer } from "mobx-react";
import { FlatList, StyleSheet, Share, ShareContent } from "react-native";
import {
  BasicSafeAreaView,
} from "../../components/styled";
import { CommentsComponent } from "../../components/Comments";

import { PageContent, BasicContentWrapper } from "./styled";

import { FeedItemComponent } from "./FeedItem";
import { HintComponent } from "../../components/Hint";

import { GetRecordResponse, RecordUser } from "../../shared/interfaces";

import { FeedStorageContext } from "../../services/feed";
import { showUnexpectedErrorAlert } from "../../utils/notifications";
import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../utils/constants";
import { Params, Routes } from "../../utils/routes";
import { SharedFeedItemComponent } from "./SharedItem";
import { RecordUserComponent } from "./FeedUser";

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

  recordings.map((recording) => {
    console.log(recording.user);
  })
  
  const [sharedRecordingId, setSharedRecordingId] = useState(null);

  useEffect(() => {
    if (sharedRecordingId) {
      fetchSharedRecording(sharedRecordingId);
    }
  }, [sharedRecordingId]);

  const [openedComments, setOpenedComments] = useState(false);
  const showComments = () => setOpenedComments(true);
  const hideComments = () => setOpenedComments(false);

  const shareCall = (recording: GetRecordResponse) => {
    if (!Share.share) {
      showUnexpectedErrorAlert(NAVIGATOR_SHARE_ERROR, "");
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

  useEffect(() => {
    loadRecordings();
  }, [])

  const onViewRef = useRef((viewableItems) => {
    let item = viewableItems;
    let currentRecording = item.changed[0]["item"];
    setCurrentRecording(currentRecording._id);
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50
  });

  const renderItem = ({ item }) => {
    return <Observer>{() => 
      <BasicContentWrapper>
        <FeedItemComponent
          key={item._id}
          openRecordUser={openRecordUser}
          recording={item}
          shareCall={shareCall}
          showComments={showComments}
          paused={(item._id === currentRecording?._id) ? false : true}
        />
      </BasicContentWrapper>
    }</Observer>;
  };
  return (
    <BasicSafeAreaView>
      <PageContent>
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

        <FlatList
          data={recordings}
          renderItem={renderItem}
          keyExtractor={(item) => (Math.random() * 1000000000).toString()}
          pagingEnabled={true}
          style={styled.flatlist}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          showsVerticalScrollIndicator={false}
          onEndReached={loadRecordings}
        />
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