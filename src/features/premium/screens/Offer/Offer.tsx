import React, { useContext } from 'react';
import { View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidBtn from '../../../../components/SolidBtn';
import SolidText from '../../../../components/SolidText';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

const Offer = () => {
  const navigation = useNavigation();
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <SolidText style={styles.title}>
            {localization.appkeys?.offerTrialText}
          </SolidText>

          <SolidBtn
            btnStyle={styles.btn}
            titleTxt={localization.appkeys?.tryFreeBtn}
            onPress={() => navigation.navigate(AppRoutes.Reminder as never)}
          />
        </View>
      }
    />
  );
};

export default Offer;
