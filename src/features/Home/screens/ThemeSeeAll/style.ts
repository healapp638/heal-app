import { StyleSheet, Platform } from 'react-native';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';

const style = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gridContainer: {
      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },

    imageStyle: {
      borderRadius: 15,
      width: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.1)', // Subtle dark overlay for readability
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: AppUtils.fontSize(20),
      fontFamily: AppFonts.recoMedium,
      color: 'white',
      textAlign: 'center',
    },
  });

export default style;
