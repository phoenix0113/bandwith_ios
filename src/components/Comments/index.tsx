import React, { ChangeEvent, useState, useContext, useEffect } from "react";
import { observer } from "mobx-react";
import { FlatList, StyleSheet, Keyboard, Text } from "react-native";
// import InfiniteScroll from "react-infinite-scroll-component";

import {
  CommentsBlock, CommentsBlockHeader, CommentContentText, CommentListWrapper, CloseOutlined, TotalCommentsAmount, CommentText,
  CommentHeader, CommentItem, HeaderImage, HeaderUsernameText, InputWrapper, SendButton, AllLoadedText, CommentsContentWrapper
} from "./styled";

import SendImg from "../../assets/images/SendComment.svg";
import CloseImg from "../../assets/images/close.svg";
import { showUnexpectedErrorAlert } from "../../utils/notifications";
import { CommentsStorageContext } from "../../services/comments";

import { CommentTimeComponent } from "./Time";

const SCROLLABLE_DIV_ID = "scrollable";

interface IProps {
  visible: boolean;
  hide: () => void;
  id: string; // callId or recordingId
  isRecording?: boolean;
}

const MAX_INPUT_LENGTH = 150;

export const CommentsComponent = observer((
  { visible, id, hide, isRecording }: IProps) => {
  const {
    fetchComments, subscribeToComments, totalAmount, loading,
    comments, resetService, sendComment, allCommentsLoaded,
  } = useContext(CommentsStorageContext);
  
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const [keyboardHeight, setKeyboardHeight] = useState("0%");
  const _keyboardDidShow = () => setKeyboardStatus("Keyboard Shown");
  const _keyboardDidHide = () => setKeyboardStatus("Keyboard Hidden");

  useEffect(() => {
    if (keyboardStatus === "Keyboard Shown")
      setKeyboardHeight("33%");
    else
      setKeyboardHeight("0%");
  }, [keyboardStatus]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    subscribeToComments();
    fetchComments(id, isRecording);

    return () => {
      resetService();
    };
  }, [id]);

  const [inputValue, setInputValue] = useState("");
  const onChange = (target: string) => {
    const value = target;

    if (value.length === MAX_INPUT_LENGTH + 1) {
      showUnexpectedErrorAlert(`Maximum of ${MAX_INPUT_LENGTH} characters`, "");
    } else {
      setInputValue(value);
    }
  };

  const sendCommentHandler = () => {
    if (loading) {
      console.log("> Comments are still loading...Wait till you can send a new one");
      return;
    }
    if (inputValue) {
      sendComment(id, inputValue, isRecording);
      setInputValue("");
    }
  };

  const renderItem = (comment) => {
    const item = comment.item;
    return (
      <CommentItem key={item._id}>
        <CommentHeader>
          <HeaderImage source={{uri: item.user.imageUrl}} />
          <HeaderUsernameText>{item.user.name}</HeaderUsernameText>
          <CommentTimeComponent date={item.date} />
        </CommentHeader>
        <CommentContentText>{item.content}</CommentContentText>
      </CommentItem>
    )
  }

  return (
    <CommentsContentWrapper>
      <CommentsBlock visible={visible} style={{bottom: keyboardHeight}}>
        <CommentsBlockHeader>
          <TotalCommentsAmount>{`Comments (${totalAmount})`}</TotalCommentsAmount>
          <CloseOutlined onPress={hide}>
            <CloseImg width={15} height={15} fill={"#ffffff"} />
          </CloseOutlined>
        </CommentsBlockHeader>
        <CommentListWrapper>
          <FlatList
            data={comments}
            renderItem={(comment) => renderItem(comment)}
            keyExtractor={(comment) => {
              return comment._id;
            }}
            style={styled.feedComment}
          />
          {/* <InfiniteScroll
            dataLength={comments.length}
            next={() => fetchComments(id, isRecording)}
            hasMore={!allCommentsLoaded}
            loader={<></>}
            endMessage={
              <AllLoadedText>You have seen it all</AllLoadedText>
            }
            scrollableTarget={SCROLLABLE_DIV_ID}
          >
            {comments && comments.map((comment) => (
              <CommentItem key={comment._id}>
                <CommentHeader>
                  <HeaderImage source={{uri: comment.user.imageUrl}} />
                  <HeaderUsernameText>{comment.user.name}</HeaderUsernameText>
                  <CommentTimeComponent date={comment.date} />
                </CommentHeader>
                <CommentContentText>{comment.content}</CommentContentText>
              </CommentItem>
            ))}
          </InfiniteScroll> */}
          <AllLoadedText>You have seen it all</AllLoadedText>
          <InputWrapper>
            <CommentText
              value={inputValue}
              underlineColorAndroid="transparent"
              placeholder={"Leave Comment..."}
              placeholderTextColor={"#ffffff"}
              numberOfLines={50}
              multiline={true}
              enablesReturnKeyAutomatically={true}
              keyboardType={"default"}
              onChangeText={text => onChange(text)}
            />
            <SendButton onPress={sendCommentHandler}>
              <SendImg width={"100%"} />
            </SendButton>
          </InputWrapper>
        </CommentListWrapper>
      </CommentsBlock>
    </CommentsContentWrapper>
  );
});

export const styled = StyleSheet.create({
  feedComment: {
    maxHeight: "80%",
  },
})