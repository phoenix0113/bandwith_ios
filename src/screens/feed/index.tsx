import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { observer } from "mobx-react";
import { RecordUser } from "../../shared/interfaces";
import { FeedItemComponent } from "./FeedItem";

import {
  NavigationBar, LeftItem, CenterItem, RightItem, PageWrapper, NavigationText, BasicSafeAreaView,
} from "../../components/styled";

import { BasicContentWrapper } from "./styled";

import { SharedFeedItemComponent } from "./SharedItem";
import { RecordUserComponent } from "./FeedUser";
import { CommentsComponent } from "../../components/Comments";

const DATA = [
  {
    id: "1",
    photo: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    name: "Luis Andres 1",
    level: "Level 1",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: "2",
    photo: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    name: "Luis Andres 2",
    level: "Level 2",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: "3",
    photo: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    name: "Luis Andres 3",
    level: "Level 3",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: "4",
    photo: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    name: "Luis Andres 4",
    level: "Level 4",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: "5",
    photo: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    name: "Luis Andres 5",
    level: "Level 5",
    video: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
]

export const FeedScreen = observer(() => {
  const [recordUser, setRecordUser] = useState<RecordUser>(null);

  const [openedComments, setOpenedComments] = useState(false);
  const showComments = () => setOpenedComments(true);
  const hideComments = () => setOpenedComments(false);

  const hide = () => {

  }

  const openRecordUser = (user: RecordUser) => {
    console.log("here");
    setRecordUser(user);
  };

  const [shareStatus, setShareStatus] = useState(false);

  const renderItem = ({item}) => {
    return (
      <BasicContentWrapper>
        <FeedItemComponent
          id={item.id}
          photo={item.photo}
          name={item.name}
          level={item.level}
          link={item.video}
          openedComments={openedComments}
          shareStatus={shareStatus}
          openRecordUser={openRecordUser}
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

        {
          (false) ?
          <RecordUserComponent
            photo={"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"}
            name={"Luis Andres 1"}
          /> :
          <></>
        }

        {
          (true) ?
          <CommentsComponent
            visible={true}
            id={"1"}
            hide={hide}
          /> :
          <></>
        }

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styled.flatlist}
        />
      </PageWrapper>
    </BasicSafeAreaView>
  )
});

const styled = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});