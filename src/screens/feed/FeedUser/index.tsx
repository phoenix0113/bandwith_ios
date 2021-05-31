import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { COLORS } from "../../../components/styled";
import { RecordUserWrapper, RightItem, RightText, NavigationBar, LeftItem, CenterItem, NavigationText, ProfileImageContent,
  ProfileNameText, ProfileActionButton, ProfileActionText, ProfileContentWrapper, BasicContentWrapper
} from "../styled";
import { View, Text, TouchableOpacity } from "react-native";
import { ProfileImageWrapper } from "../../../components/ProfileImageWrapper";

interface Iprops {
  photo: string,
  name: string,
}

export const RecordUserComponent = observer(({ photo, name }: Iprops) => {
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const requestSent = false;

  const closeHandler = () => {

  }

  const addToFriends = () => {

  }

  const removeFromFriends = () => {

  }

  const call = () => {

  }

  useEffect(() => {
    setUserPhoto(photo);
    setUserName(name);
  }, [photo, name]);

  return (
    <>
      {
        (userName !== "")
          ?
            <RecordUserWrapper>
              <NavigationBar>
                <LeftItem />
                <CenterItem>
                  <NavigationText>Contact Account</NavigationText>
                </CenterItem>
                <RightItem>
                  <RightText onPress={closeHandler}>Cancel</RightText>
                </RightItem>
              </NavigationBar>
              <BasicContentWrapper>
                <ProfileImageContent>
                  <ProfileImageWrapper src={userPhoto} />
                </ProfileImageContent>
                <View style={{width: "100%"}}>
                  <ProfileNameText>{userName}</ProfileNameText>
                  <ProfileActionButton
                    onPress={addToFriends}
                    style={{
                      backgroundColor: requestSent ? COLORS.ALTERNATIVE : COLORS.MAIN_LIGHT,
                    }}
                  >
                    <ProfileActionText style={{color: requestSent ? COLORS.BLACK : COLORS.WHITE}}>
                      {requestSent ? "Invitation is sent" : "Add to Friends" }
                    </ProfileActionText>
                  </ProfileActionButton>

                  <ProfileActionButton
                    onPress={removeFromFriends}
                    style={{
                      backgroundColor: COLORS.MAIN_LIGHT,
                    }}
                  >
                    <ProfileActionText style={{color: COLORS.RED}}>
                      Delete
                    </ProfileActionText>
                  </ProfileActionButton>
                  
                  <ProfileActionButton
                    onPress={call}
                    style={{
                      backgroundColor: COLORS.MAIN_LIGHT,
                    }}
                  >
                    <ProfileActionText style={{color: COLORS.WHITE}}>
                      Make a Call
                    </ProfileActionText>
                  </ProfileActionButton>
                </View>
              </BasicContentWrapper>
            </RecordUserWrapper>
          :
          <></>
      }
    </>
  );
});

// import { useContext, useMemo, useState } from "react";
// import {
//   CommonButton, NavigationBar, LeftItem, CenterItem, RightItem,
//   CommonPageContentWrapper,
//   CommonContentTitle, CommonContentWrapper, COLORS,
// } from "../../../components/styled";
// import { RecordUser } from "../../../shared/interfaces";

// import { ProfileImageWrapper } from "../../../components/ProfileImageWrapper";
// import { GlobalStorage, GlobalStorageContext } from "../../../services/global";
// import { OutgoingCallStorage } from "../../../services/outgoingCall";
// import { showErrorNotification, showInfoNotification } from "../../../utils/notification";

// import { RecordUserWrapper } from "../styled";

// interface IProps {
//   user: RecordUser;
//   closeHandler: () => void;
// }

// export const RecordUserComponent = ({ user, closeHandler }: IProps): JSX.Element => {
//   const {
//     contacts, sendAddToFriendInvitation, removeContact, canCallToUser, isContact,
//   } = useContext(GlobalStorageContext);

//   const [requestSent, setRequestSent] = useState(false);
//   const addToFriends = () => {
//     sendAddToFriendInvitation(user._id, () => {
//       setRequestSent(true);
//     });
//   };

//   const removeFromFriends = async () => {
//     try {
//       if (await removeContact(user._id)) {
//         closeHandler();
//       }
//     } catch (err) {
//       showErrorNotification(err.message);
//     }
//   };

//   const call = () => {
//     if (canCallToUser(user._id)) {
//       OutgoingCallStorage.makeCall(user._id);
//       closeHandler();
//     } else {
//       showInfoNotification("User is offline or busy at the moment");
//     }
//   };

//   const isUserInContactList = useMemo(() => isContact(user._id), [contacts]);

//   return (
//     <RecordUserWrapper>
//       <NavigationBar>
//         <LeftItem />
//         <CenterItem>Contact Account</CenterItem>
//         <RightItem color={COLORS.ALTERNATIVE} onClick={closeHandler}>Cancel</RightItem>
//       </NavigationBar>
//       <CommonPageContentWrapper>
//         <ProfileImageWrapper src={user.imageUrl} />
//         <CommonContentWrapper>
//           <CommonContentTitle>{user.name}</CommonContentTitle>
          // {!isUserInContactList && GlobalStorage.profile._id !== user._id && (
          //   <CommonButton
          //     margin="5% 0 20px 0"
          //     onClick={addToFriends}
          //     backgroundColor={requestSent ? COLORS.ALTERNATIVE : COLORS.MAIN_LIGHT}
          //     color={requestSent ? COLORS.BLACK : COLORS.WHITE}
          //   >
          //     {requestSent ? "Invitation is sent" : "Add to Friends" }
          //   </CommonButton>
          // )}
          // {isUserInContactList && GlobalStorage.profile._id !== user._id && (
          //   <CommonButton
          //     margin="5% 0 20px 0"
          //     onClick={removeFromFriends}
          //     backgroundColor={COLORS.MAIN_LIGHT}
          //     color={COLORS.RED}
          //   >
          //     Delete
          //   </CommonButton>
          // )}
          // {GlobalStorage.profile._id !== user._id && (
          //   <CommonButton
          //     margin="0 0 20px 0"
          //     onClick={call}
          //     backgroundColor={COLORS.MAIN_LIGHT}
          //     color={COLORS.WHITE}
          //   >
          //     Make a Call
          //   </CommonButton>
          // )}
//         </CommonContentWrapper>
//       </CommonPageContentWrapper>
//     </RecordUserWrapper>
//   );
// };
