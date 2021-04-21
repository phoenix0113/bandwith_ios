import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { observer } from "mobx-react";

import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem, BasicContentWrapper,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView,
} from "../../components/styled";
import { PhoneBlock } from "./styled";

import { ProfileImageWrapper } from "../../components/ProfileImageWrapper";
import { UserServiceContext, UserServiceInstance } from "../../services/user";


export const ProfileScreen = observer(() => {
  const { profile } = useContext(UserServiceContext);

  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem />
          <CenterItem>
            <NavigationText>Profile</NavigationText>
          </CenterItem>
          <RightItem />
        </NavigationBar>

        <BasicContentWrapper>
          <ProfileImageWrapper src={profile?.imageUrl} />

          <BasicText margin="0 0 10% 0" lineHeight="40px">{profile?.name}</BasicText>

          {profile?.phone && (
            <PhoneBlock>
              <BasicText
                fontSize="20px"
                color={COLORS.WHITE}
                textAlign="left"
                margin="10px 0 0 0"
              >
                Phone number:
              </BasicText>
              <BasicText
                fontSize="16px"
                color={COLORS.WHITE}
                textAlign="left"
                margin="5px 0 3px 0"
              >
                {profile.phone}
              </BasicText>
              <TouchableOpacity onPress={UserServiceInstance.editPhone}>
                <BasicText
                  fontSize="14px"
                  lineHeight="16px"
                  color={COLORS.ALTERNATIVE}
                  textAlign="left"
                  underline
                >
                  Change
                </BasicText>
              </TouchableOpacity>
            </PhoneBlock>
          )}

        </BasicContentWrapper>

      </PageWrapper>
    </BasicSafeAreaView>
  );
});
