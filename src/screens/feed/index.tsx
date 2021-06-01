import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { FlatList, StyleSheet, Share, ShareContent } from "react-native";
// import { useHistory, useLocation } from "react-router-dom";
// import { parse } from "query-string";
// import { Utils } from "avcore/client";
import {
  NavigationBar, LeftItem, CenterItem, RightItem, PageWrapper, NavigationText, BasicSafeAreaView,
} from "../../components/styled";
// import { BottomNavigationComponent } from "../../components/BottomNavigation";
import { CommentsComponent } from "../../components/Comments";

import { BasicContentWrapper } from "./styled";

import { FeedItemComponent } from "./FeedItem";
import { HintComponent } from "../../components/Hint";

import { GetRecordResponse, RecordUser } from "../../shared/interfaces";

import { FeedStorageContext } from "../../services/feed";
import { showUnexpectedErrorAlert } from "../../utils/notifications";
import { NAVIGATOR_SHARE_ERROR, SERVER_BASE_URL } from "../../utils/constants";
import { Params, Routes } from "../../utils/routes";
import { SharedFeedItemComponent } from "./SharedItem";
import { RecordUserComponent } from "./FeedUser";

export const FeedScreen = observer(() => {
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

  // const { search } = useLocation();
  // const history = useHistory();
  const [sharedRecordingId, setSharedRecordingId] = useState(null);
  
  // useEffect(() => {
  //   if (search) {
  //     const parsed = parse(search);
  //     console.log("> Parsed search params: ", parsed);
  //     setSharedRecordingId(parsed[Params.RECORDING_ID]);
  //   }
  // }, [search]);

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
    // history.push({ search: null });
    cleanSharedRecording();
  };

  // const scrollableRef = useRef<HTMLDivElement>(null);

  // const [videoObserver, setVideoObserver] = useState(null);

  useEffect(() => {
    loadRecordings();
  }, [])

  // useEffect(() => {
  //   if (scrollableRef.current) {
  //     const createdObserver = new IntersectionObserver((entries) => {
  //       console.log("Interaction observer event's entries: ", entries);

  //       entries.forEach((entry) => {
  //         console.log(`Is safari: ${Utils.isSafari}, entry is intersecting: ${entry.isIntersecting}`);

  //         if (entry.isIntersecting) {
  //           console.log(`Entry is intersecting ${entry.target?.id}.`);
  //           setCurrentRecording(entry.target.id);
  //         } else if (Utils.isSafari) {
  //           console.log(`For some reason, entry is not intersecting. May need a new method. Scrolling from ${entry.target.id} to the bottom`);
  //         }
  //       });
  //     }, { threshold: 0.8, root: scrollableRef.current });

  //     console.log("Created observer: ", createdObserver);

  //     setVideoObserver(createdObserver);
  //   }
  // }, [scrollableRef]);

  // useEffect(() => {
  //   if (scrollableRef?.current && currentRecording) {
  //     console.log(`> Scrolling into ${currentRecording._id}`);

  //     const nodes = scrollableRef.current.querySelectorAll(".video_wrapper");

  //     nodes.forEach((n) => {
  //       if (n.id === currentRecording._id) {
  //         n.scrollIntoView();
  //       }
  //     });
  //   }
  // }, [scrollableRef]);

  // const [shareStatus, setShareStatus] = useState(false);

  const onViewRef = useRef((viewableItems)=> {
    let item = viewableItems;
    let currentRecording = item.changed[0]["item"];
    setCurrentRecording(currentRecording._id);
  });

  const viewConfigRef = useRef({ 
    viewAreaCoveragePercentThreshold: 50
  });

  const renderItem = ({item}) => {
    return (
      <BasicContentWrapper>
        <FeedItemComponent
          key={item._id}
          // observer={videoObserver}
          openRecordUser={openRecordUser}
          recording={item}
          shareCall={shareCall}
          showComments={showComments}
        />
      </BasicContentWrapper>
    );
  };
  return (
    <BasicSafeAreaView>
      <PageWrapper>
        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>Feed</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

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
          keyExtractor={(item) => item._id}
          pagingEnabled={true}
          style={styled.flatlist}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      </PageWrapper>
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