import { StyleSheet, Platform, Dimensions } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3; // 3 columns with padding/gaps

const style = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gridContainer: {
      paddingHorizontal: 16,
      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    card: {
      width: ITEM_WIDTH,
      height: 140,
      margin: 4,
      borderRadius: 20,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageStyle: {
      width: '100%',
      borderRadius: 18,
    },
    healText: {
      fontSize: AppUtils.fontSize(28), // Large as per дизайн
      fontFamily: AppFonts.recoMedium,
      color: 'white',
      textAlign: 'center',
    },
    lockWrapper: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'rgba(255,255,255,0.3)', // Translucent circle
      justifyContent: 'center',
      alignItems: 'center',
    },
    lockIcon: {
      width: 14,
      height: 14,
      tintColor: 'white',
    },
  });

export default style;
