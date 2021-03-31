import { StyleSheet } from "react-native";
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
  ALTERNATIVE: "#0091FF",
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
  height: 70px;
`;

interface NavigationTextProps {
  color?: string;
}

export const NavigationText = styled.Text<NavigationTextProps>`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
  color: ${({ color }) => color || COLORS.WHITE};
`;

const NavigationItem = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const LeftItem = styled(NavigationItem)`
  width: 16%;
  justify-content: flex-start;
`;

export const RightItem = styled(NavigationItem)`
  width: 16%;
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
  justifyContent?: "space-between"|"flex-start";
}

export const PageWrapper = styled.View<PageWrapperProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: ${({justifyContent}) => justifyContent || "flex-start"};
  align-items: center;
  padding-horizontal: ${({paddingHorizontal}) => paddingHorizontal || "24px"}; 
  background-color: ${({ background }) => background || COLORS.BLACK};
`;

interface BasicTextProps {
  color?: string;
  fontSize?: string;
  lineHeight?: string;
  fontWeight?: string;
  letterSpacing?: string;
  textAlign?: string;
}

export const BasicText = styled.Text<BasicTextProps>`
  font-family: Kefa;
  font-size: ${({fontSize}) => fontSize || "24px"};
  font-style: normal;
  font-weight: ${({fontWeight}) => fontWeight || "400"};
  line-height: ${({lineHeight}) => lineHeight || "24px"};
  letter-spacing: ${({letterSpacing}) => letterSpacing || "0px"};
  color: ${({color}) => color || COLORS.WHITE};
  text-align: ${({textAlign}) => textAlign || "center"};
`;

export const BasicSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.BLACK};
`;

export const SpinnerOverlayText = StyleSheet.create({
  text: {
    color: COLORS.WHITE,
    fontSize: 20,
  },
});
