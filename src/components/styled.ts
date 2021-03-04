import styled from "styled-components/native";

export const COLORS = {
  MAIN_DARK: "#0B131A",
  MAIN_LIGHT: "#0F1A23",
  GREY: "#908F9D",
  LIGHT_GREY: "#DEDEDE",
  WHITE: "#fff",
  WHITE_VAGUE: "#6D7278",
  BLACK: "#0B0B0B",
  RED: "#FF0000",
  ORANGE: "#FD9D00",
  ALTERNATIVE: "#0AFFEF",
};

export const Z_INDEX = {
  HIGHEST: 9999,
  HIGH: 999,
  MIDDLE: 99,
};

/**
 * Top Navigation
 */
interface NavigationBarProps {
  position?: "absolute";
}

export const NavigationBar = styled.View<NavigationBarProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: 21px;
  background-color: ${COLORS.BLACK};
  position: ${({ position }) => position || "relative"};
  z-index: ${Z_INDEX.MIDDLE};
  width: 100%;
`;

export const NavigationText = styled.Text`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
  color: ${COLORS.WHITE};
`;

interface ItemProps {
  color?: string;
}

const NavigationItem = styled.TouchableOpacity<ItemProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ color }) => color || COLORS.WHITE};
`;

export const LeftItem = styled(NavigationItem)`
  width: 20%;
  justify-content: flex-start;
`;

export const RightItem = styled(NavigationItem)`
  width: 20%;
  justify-content: flex-end;
`;

export const CenterItem = styled(NavigationItem)`
  flex-grow: 1;
  justify-content: center;
`;

/**
 * Basic button
 */
type BasicButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  flexGrow?: number;
  margin?: string;
  width?: string;
  disabled?: boolean;
}

export const BasicButton = styled.TouchableOpacity<BasicButtonProps>`
  padding: 11px 37.5px;
  border-radius: 6px;
  border: 2px solid;
  width: ${({width}) => width || "auto"};
  margin: ${({margin}) => margin || "0 0 20px 0"};
  background-color: ${({backgroundColor, disabled}) => disabled ? COLORS.WHITE_VAGUE : backgroundColor || COLORS.WHITE};
  border-color: ${({borderColor, disabled}) => disabled ? COLORS.WHITE_VAGUE : borderColor || COLORS.WHITE};
  flex-grow: ${({flexGrow}) => flexGrow || 0};
`;

type BasicButtonTextProps = {
  color?: string;
}

export const BasicButtonText = styled.Text<BasicButtonTextProps>`
  font-size: 18px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0px;
  color: ${({color}) => color || COLORS.BLACK};
`;

/**
 * Basic page wrapper with navigation
 */

interface PageWrapperProps {
  background?: string;
  paddingHorizontal?: string;
}

export const PageWrapper = styled.View<PageWrapperProps>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-horizontal: ${({paddingHorizontal}) => paddingHorizontal}; 
  background-color: ${({ background }) => background || COLORS.BLACK};
`;

// /**
//  * Common components
//  */
// interface CommonPageContentWrapperProps {
//   padding?: string;
// }

// export const CommonPageContentWrapper = styled.div<CommonPageContentWrapperProps>`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
//   flex-grow: 1;
//   background-color: ${COLORS.MAIN_DARK};
//   padding: ${({ padding }) => padding || "8% 20px"};
// `;

// interface ICommonImgWrapperProps {
//   width?: string;
// }

// export const CommonImgWrapper = styled.img<ICommonImgWrapperProps>`
//   cursor: pointer;
//   width: ${({ width }) => width || "auto"};
// `;

// interface ButtonProps {
//   color?: string;
//   backgroundColor?: string;
//   margin?: string;
// }

// export const CommonButton = styled.button<ButtonProps>`
//   width: 100%;
//   height: 50px;
//   padding: 13px 0 12px 0;
//   border-radius: 6px;
//   font-size: 18px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: 25px;
//   letter-spacing: 0px;
//   text-align: center;
//   color: ${({ color }) => color || COLORS.WHITE};
//   background-color: ${({ backgroundColor }) => backgroundColor || COLORS.MAIN_LIGHT};
//   margin: ${({ margin }) => margin || 0};
//   border: none;
// `;

// export const CommonContentWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;

// `;

// export const CommonContentTitle = styled.div`
//   font-size: 24px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: 40px;
//   letter-spacing: 0px;
//   text-align: center;
//   color: ${COLORS.WHITE};
// `;

// export const CommonContentDescription = styled.div`
//   font-size: 12px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 16px;
//   letter-spacing: 0px;
//   text-align: center;
//   color: ${COLORS.WHITE};
// `;

// export const LoaderWrapper = styled.div`
//   position: absolute;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 100%;
//   z-index: ${Z_INDEX.HIGHEST};
// `;

// /**
//  * Call page
//  */
// export const CallPageWrapper = styled.div`
//   flex-grow: 1;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   position: relative;
// `;

// export const CALL_PAGE_NAVIGATION_HEIGHT = 75;

// export const CallPageNavigation = styled.div`
//   width: 100%;
//   background: ${COLORS.MAIN_DARK};
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 0 17px;
//   height: ${CALL_PAGE_NAVIGATION_HEIGHT}px;
// `;

// export const NavigationCenterContent = styled.div`
//   flex-grow: 1;
//   display: flex;
//   flex-direction: column;
//   padding: 0px 20px;
//   color: ${COLORS.WHITE};
// `;

// interface ContentTopProps {
//   lineHeight?: string;
// }

// export const ContentTop = styled.div<ContentTopProps>`
//   font-size: 14px;
//   font-style: normal;
//   font-weight: 800;
//   line-height: ${({ lineHeight }) => lineHeight || "31px"};
//   letter-spacing: 0px;
//   text-align: left;
// `;

// export const ContentBottom = styled.div`
//   font-size: 12px;
//   line-height: 14px;
//   letter-spacing: 0px;
//   text-align: left;
// `;

// export const CallPageToolbar = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: absolute;
//   right: 0;
//   bottom: 16%;
//   z-index: ${Z_INDEX.MIDDLE};

//   & > * {
//     padding: 16px;
//   }

// `;
