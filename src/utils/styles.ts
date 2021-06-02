import {Platform, Dimensions} from 'react-native';

const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.width >= dim.height;
};

export const tabBarHeight = () => {
  const majorVersion = parseInt(Platform.Version, 10);
  const isIos = Platform.OS === 'ios';
  const isIOS11 = majorVersion >= 11 && isIos;
  if(Platform.isPad) return 49;
  if(isIOS11 && !isLandscape()) return 49;
  return 29;
}

