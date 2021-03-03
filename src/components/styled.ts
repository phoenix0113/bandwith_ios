import styled from "styled-components/native";

export const COLORS = {
  MAIN_DARK: "#0B131A",
  MAIN_LIGHT: "#0F1A23",
  GREY: "#908F9D",
  LIGHT_GREY: "#DEDEDE",
  WHITE: "#fff",
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
  padding: 21px;
  background-color: ${COLORS.MAIN_LIGHT};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
  position: ${({ position }) => position || "initial"};
  z-index: ${Z_INDEX.MIDDLE};
  width: 100%;
`;

interface ItemProps {
  color?: string;
}

const NavigationItem = styled.View<ItemProps>`
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

  & > .anticon {
    line-height: 1;
  }
`;

export const CenterItem = styled(NavigationItem)`
  flex-grow: 1;
  justify-content: center;
`;


/**
 * Basic page wrapper with navigation
 */

// interface PageWrapperProps {
//   background?: string;
// }

// export const PageWrapper = styled.div<PageWrapperProps>`
//   display: flex;
//   flex-grow: 1;
//   flex-direction: column;
//   justify-content: space-between;
//   width: 100%;
//   background-color: ${({ background }) => background || COLORS.WHITE};
// `;

// /**
//  * Authentication pages
//  */

// export const WelcomeLogo = styled.img`
//   width: 46%;
// `;

// const AuthPageBlock = styled.div`
//   width: 100%;
//   transform: skewY(-12.2deg);
//   display: flex;
// `;

// export const AuthPageTopBlock = styled(AuthPageBlock)`
//   background-color: ${COLORS.MAIN_LIGHT};
//   margin-top: -12.2%;
//   padding-top: 24.4%;
//   height: 42%;
//   justify-content: center;
//   align-items: center;

//   @media (max-height: 800px) {
//     height: 40%;
//   }

//   @media (max-height: 650px){
//     height: 35%;
//   }

//   @media (max-height: 568px) {
//     height: 30%;
//   }
// `;

// export const AuthPageBottomBlock = styled(AuthPageBlock)`
//   flex-grow: 1;
//   margin-bottom: -12.2%;
// `;

// export const AuthPageBlockContent = styled.div`
//   transform: skewY(12.2deg);
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// export const AuthPageContentWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;

//   @media (min-width: 768px) {
//     display: flex;
//     justify-content: center;
//     margin: 0 20%;
//   }
// `;

// export const AuthFormWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   padding: 20px;
// `;

// export const AuthFormHeader = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 54px 0;

//   & > img {
//     width: 36%;
//   }
// `;

// export const AuthLinkRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   width: 100%;
//   cursor: pointer;
// `;

// export const Text = styled.div`
//   display: inline;
//   color: ${COLORS.MAIN_LIGHT};
//   font-size: 14px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: 31px;
//   letter-spacing: 0px;
//   text-align: center;
//   margin-right: 4px;
// `;

// export const StyledLink = styled(Text)`
//   color: ${COLORS.ALTERNATIVE};
// `;

// export const InputIconWrapper = styled.div`
//   width: 20px;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// `;

// export const AuthButton = styled.button`
//   width: 100%;
//   height: 50px;
//   background: ${COLORS.ALTERNATIVE};
//   box-shadow: 0px 0px 8px rgba(10, 255, 239, 0.3);
//   border-radius: 10px;
//   font-size: 20px;
//   font-style: normal;
//   font-weight: 800;
//   line-height: 31px;
//   letter-spacing: 0px;
//   text-align: center;
//   border: none;
//   margin: 5px 0 20px 0;
// `;

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
