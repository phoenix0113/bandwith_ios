import styled from "styled-components/native";

import { COLORS, Z_INDEX } from "../styled";

interface ICommentBlockProps {
  visible: boolean;
}

interface BasicContentWrapperProps {
  justifyContent?: "center" | "space-between";
}

export const CommentsContentWrapper = styled.View<BasicContentWrapperProps>`
  position: absolute;
  bottom: 0;
  flex-direction: column;
  justify-content: ${({justifyContent}) => justifyContent || "center"};
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: ${Z_INDEX.HIGH};
  flex: 1;
`;

export const CommentsBlock = styled.View<ICommentBlockProps>`
  background-color: ${COLORS.MAIN_DARK};
  color: ${COLORS.WHITE};
  width: 100%;
  height: 66%;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  z-index: ${Z_INDEX.HIGH};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;

  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  justify-content: space-between;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const CommentsBlockHeader = styled.View`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CommentListWrapper = styled.View`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 10px;
`;

export const CommentItem = styled.View`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

export const CommentHeader = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const HeaderImage = styled.Image`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 12.5px;
`;

const Text = styled.View`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;
  margin-right: 10px;
`;

export const HeaderUsernameText = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;
  margin-right: 10px;
  color: white;
`;

export const HeaderInfo = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;
  margin-right: 10px;
  color: white;
  opacity: 0.5;
`;

export const CommentContentText = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.093px;
  text-align: left;
  padding-right: 15%;
  color: white;
`;

export const InputWrapper = styled.View`
  background: rgb(100, 102, 103);
  display: flex;
  flex-direction: row;
  border-radius: 6px;
  padding: 9px;
`;

export const CommentText = styled.TextInput`
  width: 88%;
  color: rgb(255, 255, 255);
  border: none;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0px;
  text-align: left;
`;

// const { TextArea } = Input;

// export const StyledTextArea = styled(TextArea)`
//   && {
//     color: ${COLORS.WHITE};
//     background: #646667;
//     border-radius: 6px;
//     border: none;

//     font-size: 14px;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 22px;
//     letter-spacing: 0px;
//     text-align: left;

//     padding: 9px 40px 9px 20px;


//     :focus {
//       /* border-color: ${COLORS.ALTERNATIVE}; */
//       border-color: transparent;
//     }
//   }
// `;

export const SendButton = styled.TouchableOpacity`
  position: absolute;
  width: 40px;
  height: 25px;
  bottom: 12px;
  right: 7px;
`;

export const AllLoadedText = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.093px;
  text-align: left;
  padding-right: 15%;
  color: ${COLORS.ALTERNATIVE};
`;

export const CloseOutlined = styled.TouchableOpacity`

`;

export const TotalCommentsAmount = styled.Text`
  color: white;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: 0px;
  text-align: left;
`;
