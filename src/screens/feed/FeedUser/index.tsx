import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { View, Text } from "react-native";

import { RecordUserWrapper } from "../styled";
import addIcon from "../../../assets/images/feed/feedAddIcon.svg";

interface Iprops {
  photo: string,
  name: string,
  level: string,
}

export const RecordUserComponent = observer(({ photo, name, level }: Iprops) => {
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const [userLevel, setUserLevel] = useState("");

  useEffect(() => {
    setUserPhoto(photo);
    setUserName(name);
    setUserLevel(level);
  }, [photo, name, level]);

  return (
    <RecordUserWrapper>
      
    </RecordUserWrapper>
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
//           {!isUserInContactList && GlobalStorage.profile._id !== user._id && (
//             <CommonButton
//               margin="5% 0 20px 0"
//               onClick={addToFriends}
//               backgroundColor={requestSent ? COLORS.ALTERNATIVE : COLORS.MAIN_LIGHT}
//               color={requestSent ? COLORS.BLACK : COLORS.WHITE}
//             >
//               {requestSent ? "Invitation is sent" : "Add to Friends" }
//             </CommonButton>
//           )}
//           {isUserInContactList && GlobalStorage.profile._id !== user._id && (
//             <CommonButton
//               margin="5% 0 20px 0"
//               onClick={removeFromFriends}
//               backgroundColor={COLORS.MAIN_LIGHT}
//               color={COLORS.RED}
//             >
//               Delete
//             </CommonButton>
//           )}
//           {GlobalStorage.profile._id !== user._id && (
//             <CommonButton
//               margin="0 0 20px 0"
//               onClick={call}
//               backgroundColor={COLORS.MAIN_LIGHT}
//               color={COLORS.WHITE}
//             >
//               Make a Call
//             </CommonButton>
//           )}
//         </CommonContentWrapper>
//       </CommonPageContentWrapper>
//     </RecordUserWrapper>
//   );
// };
