import { observer } from "mobx-react";
import { useContext, useMemo } from "react";
import { Image } from "react-native";
import { HintButton, HintWrapper, HintContent, HintText } from "./styled";
import { CommonImgWrapper } from "../styled";

import { HintTypes } from "../../shared/interfaces";
import { SocketServiceInstance, SocketServiceContext } from "../../services/socket";
import { Routes } from "../../utils/routes";

const swipeTopIcon = "../../assets/images/hints/swipeTop.svg";
const swipeHorizontalIcon = "../../assets/images/hints/swipeHorizontal.svg";
const touchIcon = "../../assets/images/hints/touch.svg";

import { DELETE_NOTIFICATION_HINT, FEED_HINT, FEED_PLAYER_HINT } from "../../utils/hints";

interface IProps {
  page: Routes;
}

interface Hint {
  text: string;
  icon: string;
  type: HintTypes;
}

interface PageHints {
  [page: string]: Array<Hint>;
}

const hints: PageHints = {
  [Routes.FEED]: [
    {
      icon: swipeTopIcon,
      text: FEED_HINT,
      type: HintTypes.FEED,
    },
    {
      icon: touchIcon,
      text: FEED_PLAYER_HINT,
      type: HintTypes.FEED_PLAYER,
    },
  ],
  [Routes.NOTIFICATIONS]: [
    {
      icon: swipeHorizontalIcon,
      text: DELETE_NOTIFICATION_HINT,
      type: HintTypes.NOTIFICATION,
    },
  ],
};

export const HintComponent = observer(({ page }: IProps) => {
  const pageHints = useMemo(() => hints[page], [page]);

  const { profile } = useContext(SocketServiceContext);

  const unreadHints = useMemo(() => pageHints.filter((pageHint) => {
    const profileHint = profile?.hints.find((hint) => hint.type === pageHint.type);
    if (!profileHint) {
      return false;
    }
    return !profileHint.seen;
  }), [profile]);

  console.log(`> Unread hints on page ${page}: `, unreadHints);

  if (!unreadHints.length) {
    return null;
  }

  return (
    <HintWrapper>
      <HintContent>
        <CommonImgWrapper width="50%">
          <Image source={{uri: unreadHints[0].icon}} />
        </CommonImgWrapper>
        <HintText>{unreadHints[0].text}</HintText>
      </HintContent>
      <HintButton
        onPress={() => SocketServiceInstance.updateHintAndProfile(unreadHints[0].type)}
      >
        {unreadHints.length > 1 ? "Next" : "Got It"}
      </HintButton>
    </HintWrapper>
  );
});
