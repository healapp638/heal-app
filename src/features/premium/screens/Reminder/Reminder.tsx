import React, { useContext } from 'react';
import { Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LocalizationContext } from '../../../../localization/localization';
import SolidBtn from '../../../../components/SolidBtn';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const Reminder = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <SolidText style={styles.title}>
            {localization.appkeys?.reminderTrialEnds}
          </SolidText>
          <SolidText style={styles.subtitle}>
            {localization.appkeys?.noSurprise}
          </SolidText>
          <Image
            source={images.reminder}
            resizeMode="contain"
            style={styles.image}
          />
          <SolidBtn
            btnStyle={styles.btn}
            titleTxt={localization.appkeys?.tryFreeBtn}
            onPress={() => navigation.navigate(AppRoutes.Premium as never)}
          />
        </View>
      }
    />
  );
};

export default Reminder;
