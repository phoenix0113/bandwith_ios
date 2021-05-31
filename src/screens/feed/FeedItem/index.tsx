import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react";
import { StyleSheet } from "react-native";
import { FeedVideoComponent } from "../FeedVideo";
import { RecordUser } from "../../../shared/interfaces";

import { VideoWrapper } from "../styled";

interface IProps {
  id: string;
  photo: string;
  name: string;
  level: string;
  link: string;
  openedComments: boolean;
  shareStatus: boolean;
  openRecordUser: (user: RecordUser) => void;
}

export const FeedItemComponent  = observer(({ id, photo, name, level, link, openedComments, shareStatus, openRecordUser }: IProps) => {
  const [feedItemID, setFeedItemID] = useState("");
  const [feedItemPhoto, setFeedItemPhoto] = useState("");
  const [feedItemName, setFeedItemName] = useState("");
  const [feedItemLevel, setFeedItemLevel] = useState("");
  const [feedItemLink, setFeedItemLink] = useState("");
  const [feedItemStatus, setFeedItemStatus] = useState(false);
  const [feedItemCommentsStatus, setFeedItemCommentsStatus] = useState(false);
  const [feedItemShareStatus, setFeedItemShareStatus] = useState(false);

  useEffect(() => {
    setFeedItemID(id);
    setFeedItemPhoto(photo);
    setFeedItemName(name);
    setFeedItemLevel(level);
    setFeedItemLink(link);
    setFeedItemStatus(false);
    setFeedItemCommentsStatus(openedComments);
    setFeedItemShareStatus(shareStatus);
  }, [id, photo, name, level, link, openedComments, shareStatus]);

  return (
    <VideoWrapper>
      {
        (id !== "") ?
          <FeedVideoComponent
            id={feedItemID}
            photo={feedItemPhoto}
            name={feedItemName}
            level={feedItemLevel}
            link={feedItemLink}
            status={false}
            feedItemCommentsStatus={feedItemCommentsStatus}
            feedItemShareStatus={feedItemShareStatus}
            openRecordUser={openRecordUser}
          /> :
          <></>
      }
    </VideoWrapper>
  )
});