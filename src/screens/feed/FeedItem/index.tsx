import React, { useContext, useEffect, useState } from "react";

import { observer } from "mobx-react";
import { StyleSheet } from "react-native";
import { FeedVideoComponent } from "../FeedVideo";

import { VideoWrapper } from "../styled";

interface IProps {
  id: string,
  photo: string,
  name: string,
  level: string,
  link: string,
  openedComments: boolean,
}

export const FeedItemComponent  = observer(({ id, photo, name, level, link, openedComments }: IProps) => {
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
  }, [id, photo, name, level, link, openedComments, ]);

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
          /> :
          <></>
      }
    </VideoWrapper>
  )
});