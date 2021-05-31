import styled from "styled-components/native";

import { COLORS, Z_INDEX } from "../styled";

export const HintWrapper = styled.View`
  height: 100%;
  width: 100%;

  background: ${COLORS.BLACK};
  mix-blend-mode: normal;
  opacity: 0.93;
  z-index: ${Z_INDEX.HIGH};

  display: flex;
  justify-content: center;
  align-items: center;  

  position: absolute;
`;

export const HintContent = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HintText = styled.View`
  margin-top: 15%;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  color: ${COLORS.WHITE};
`;

export const HintButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 8%;
  margin: 0 auto;

  display: flex;
  flex-direction: row;
  justify-content: center;

  font-size: 20px;
  line-height: 23px;
  color: ${COLORS.ALTERNATIVE};

  cursor: pointer;
`;
