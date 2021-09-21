import { Dimensions, StatusBar } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  width: width,
  height: height,
  sideMargin: 16,
  mainStatusBarHeight: StatusBar.currentHeight,
  labelFontSize: 18,
  headerFontSize: 24,
  subheaderFontSize: 18,
  normalFontSize: 16,
};
