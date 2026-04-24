import { StyleSheet } from 'react-native';

const style = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    confirmBtn: {
      backgroundColor: colors.brown,
      width: '90%',
      borderRadius: 100,
      marginTop: 20,
      marginBottom: 60,
    },
  });

export default style;
