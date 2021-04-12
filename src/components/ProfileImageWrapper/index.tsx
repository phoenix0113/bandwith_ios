import React from "react";
import ProfileMaskIcon from "../../assets/images/call/ProfileMask.svg";

import { ImgWrapperAbsolute, ProfileWrapper, ProfileImage } from "./styled";

interface IProps {
  src: string
}

export const ProfileImageWrapper = ({ src }: IProps): JSX.Element => {
  return (
    <ProfileWrapper>
      <ProfileMaskIcon />
      <ImgWrapperAbsolute>
        <ProfileImage source={{ uri: src || "DefaultProfileImage" }} />
      </ImgWrapperAbsolute>
    </ProfileWrapper>
  );
};
