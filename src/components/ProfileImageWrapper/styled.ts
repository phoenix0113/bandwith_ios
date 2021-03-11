import styled from "styled-components/native";

export const ProfileWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  padding: 35px 0;
`;

export const ImgWrapperAbsolute = styled.View`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 130px;
  z-index: 99;
`;

export const ProfileImage = styled.Image`
  width: 130px;
  height: 130px;
  border-radius: 65px;
`;
