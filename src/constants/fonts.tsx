import { Platform } from 'react-native';

const AppFonts = {
  reco: Platform.OS === 'ios' ? 'Recoleta-Regular' : 'Recoleta Regular',
  recoMedium: Platform.OS === 'ios' ? 'Recoleta-Medium' : 'Recoleta Medium',
  recoSemiBold: Platform.OS === 'ios' ? 'Recoleta-SemiBold' : 'Recoleta SemiBold',
  recoBold: Platform.OS === 'ios' ? 'Recoleta-Bold' : 'Recoleta Bold',

  semiBold: 'Poppins-SemiBold',
  regular: 'Poppins-Regular',
  italic: 'Poppins-Italic',
  semiItalic: 'Poppins-SemiBoldItalic',
  medium: 'Poppins-Medium',
  light: 'Poppins-Light',
  bold: 'Poppins-Bold',

  // font name example : Bold:'SFUIText-Bold' ,  Regular:'SFUIText-Regular',
};

export default AppFonts;
