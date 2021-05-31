import React, { ChangeEvent, useState, useContext, useEffect } from "react";
import { observer } from "mobx-react";
import { ScrollView } from "react-native";
// import { StyledTextArea } from "react-native-textarea";

import {
  CommentsBlock, CommentsBlockHeader, CommentContentText, CommentListWrapper, CloseOutlined, TotalCommentsAmount, CommentText,
  CommentHeader, CommentItem, HeaderImage, HeaderUsernameText, InputWrapper, SendButton, AllLoadedText, CommentsContentWrapper,
} from "./styled";

import SendImg from "../../assets/images/SendComment.svg";
import CloseImg from "../../assets/images/close.svg";
// import { showInfoNotification } from "../../utils/notification";
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
  { visible, id, hide, isRecording }: IProps,
): JSX.Element => {
  const {
    fetchComments, subscribeToComments, totalAmount, loading,
    comments, resetService, sendComment, allCommentsLoaded,
  } = useContext(CommentsStorageContext);

  useEffect(() => {
    subscribeToComments();
    fetchComments(id, isRecording);

    return () => {
      resetService();
    };
  }, [id]);

  const [inputValue, setInputValue] = useState("");
  const onChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    // const { value } = target;

    // if (value.length === MAX_INPUT_LENGTH + 1) {
    //   showInfoNotification(`Maximum of ${MAX_INPUT_LENGTH} characters`, 1);
    // } else {
    //   setInputValue(target.value);
    // }
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

  return (
    <CommentsContentWrapper>
      <CommentsBlock visible={visible}>
        <CommentsBlockHeader>
          <TotalCommentsAmount>{`Comments (${totalAmount})`}</TotalCommentsAmount>
          <CloseOutlined onPress={hide}>
            <CloseImg width={15} height={15} fill={"#ffffff"} />
          </CloseOutlined>
        </CommentsBlockHeader>
        <CommentListWrapper>
          <ScrollView>
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
          </ScrollView>
        </CommentListWrapper>
        <InputWrapper>
          <CommentText
            underlineColorAndroid="transparent"
            placeholder={"Type Something in Text Area."}
            placeholderTextColor={"#ffffff"}
            numberOfLines={50}
            multiline={true}
          />
          <SendButton onPress={sendCommentHandler}>
            <SendImg width={"100%"} />
          </SendButton>
        </InputWrapper>
      </CommentsBlock>
    </CommentsContentWrapper>
  );
});
