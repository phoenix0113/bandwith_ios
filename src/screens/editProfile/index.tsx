import React, { useState, useContext, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { observer } from "mobx-react";
import { Input } from "react-native-elements";
import { launchImageLibrary } from 'react-native-image-picker';
import { updateUserProfile } from "../../axios/routes/feed";


import {
  COLORS, NavigationBar, LeftItem, CenterItem, RightItem,
  PageWrapper, BasicText, NavigationText, BasicSafeAreaView,
} from "../../components/styled";
import {
  PhoneBlock, ProfileImageWrapper, PhoneNumber, PhoneNumberSection, PhoneNumberChange
} from "./styled";

import { InputGroup } from "../login/styled";
import { getUsernameErrorMessage, inputStyles } from "../login/utils";

import { UserServiceContext, UserServiceInstance } from "../../services/user";

const tempProfileIcon = "../../assets/images/call/default_profile_image.png";

export const EditProfileScreen = observer(() => {
  const { profile } = useContext(UserServiceContext);

  const [photo, setPhoto] = useState(profile?.imageUrl);
  const [photoType, setPhotoType] = useState("");

  const handleChoosePhoto = () => {
    launchImageLibrary({
      mediaType: `photo`,
      includeBase64: true,
      maxHeight: 96,
      maxWidth: 96,
    }, (response) => {
      if (response) {
        let splitted = response.assets[0].type.split("/", 2); 
        setPhotoType(splitted[1]);
        setPhoto(`data:image/${photoType};base64,${response.assets[0].base64}`);
        setUpdateStatus(true);
      }
    });
  };

  const [username, setUsername] = useState(profile?.name);
  const usernameErrorMessage = useMemo(() => username === null ? "" : getUsernameErrorMessage(username), [username]);
  const [updateStatus, setUpdateStatus] = useState(false);

  const onChangeName = (value: string) => {
    if (value === profile?.name) {
      setUpdateStatus(false);
    } else {
      setUpdateStatus(true);
    }
    
    setUsername(value);
  }

  const onSubmit = async () => {
    await updateUserProfile({
      id: profile?._id,
      photoUrl: photo,
      username: username,
    });

    await UserServiceInstance.init();
    UserServiceInstance.cancelEditProfile();
  }

  return (
    <BasicSafeAreaView>
      <PageWrapper>

        <NavigationBar>
          <LeftItem>
            <NavigationText
              color={COLORS.ALTERNATIVE}
              onPress={() => UserServiceInstance.cancelEditProfile()}
              >
              Cancel
            </NavigationText>
          </LeftItem>
          <CenterItem>
            <NavigationText>Edit Profile</NavigationText>
          </CenterItem>
          <RightItem>
            {
              (updateStatus) ? (
                <NavigationText
                  color={COLORS.ALTERNATIVE}
                  onPress={onSubmit}
                  >
                  Save
                </NavigationText>
              ) : (
                <></>
              )
            }
          </RightItem>
        </NavigationBar>

        {
          (photo) ? (
            <ProfileImageWrapper source={{uri: photo }} />
          ) : (
            <ProfileImageWrapper source={require(tempProfileIcon)} />
          )
        }
        
        <TouchableOpacity onPress={handleChoosePhoto}>
          <BasicText
            fontSize="16px"
            lineHeight="16px"
            color={COLORS.ALTERNATIVE}
            textAlign="right"
            underline
          >
            Choose Photo
          </BasicText>
        </TouchableOpacity>

        <PhoneBlock>
          <BasicText
            fontSize="20px"
            color={COLORS.WHITE}
            textAlign="left"
            margin="10px 0 0 0"
          >
            Name:
          </BasicText>

          <InputGroup>
            <Input
              onChangeText={(value: string) => onChangeName(value)}
              placeholder="ENTER YOUR USERNAME"
              autoCorrect={false}
              textContentType="oneTimeCode"
              errorMessage={usernameErrorMessage}
              inputStyle={inputStyles.inputText}
              containerStyle={inputStyles.inputContainer}
              value={username}
              style={{ marginTop: 10 }}
            />
          </InputGroup>
        </PhoneBlock>

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
            
            <PhoneNumberSection>
              <PhoneNumber>
                <BasicText
                  fontSize="20px"
                  color={COLORS.WHITE}
                  textAlign="left"
                  margin="3px 0 3px 0"
                >
                  {profile.phone}
                </BasicText>
              </PhoneNumber>
              
              <PhoneNumberChange>
                <TouchableOpacity onPress={UserServiceInstance.editPhone}>
                  <BasicText
                    fontSize="16px"
                    lineHeight="16px"
                    color={COLORS.ALTERNATIVE}
                    textAlign="right"
                    underline
                  >
                    Change
                  </BasicText>
                </TouchableOpacity>
              </PhoneNumberChange>
            </PhoneNumberSection>
          </PhoneBlock>
        )}

      </PageWrapper>
    </BasicSafeAreaView>
  );
});
