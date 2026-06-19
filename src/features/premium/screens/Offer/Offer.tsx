import React, { useContext } from 'react';
import { View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidBtn from '../../../../components/SolidBtn';
import SolidText from '../../../../components/SolidText';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSubscription } from '../../../../hooks/useSubscription';

const Offer = () => {
  const navigation = useNavigation();
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const { packages } = useSubscription();
  const styles = style(colors);

  const getYearlyPriceInfo = () => {
    let text = localization.appkeys?.yearlyPriceInfoNew || '';
    let priceStr = 'CHF 48.00';
    if (packages?.yearly) {
      priceStr = packages.yearly.product.priceString;
      text = text.replace(/CHF\s*48\.00/gi, priceStr);
    }
    return { text, priceStr };
  };

  const { text: priceInfoText, priceStr } = getYearlyPriceInfo();
  const yearlyPriceDisplay = `${priceStr}/year`;

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <SolidText style={styles.priceHeader}>
            {yearlyPriceDisplay}
          </SolidText>
          
          <SolidText style={styles.title}>
            {localization.appkeys?.offerTrialText}
          </SolidText>

          <SolidText style={styles.infoText}>
            {priceInfoText}
          </SolidText>

          <SolidBtn
            btnStyle={styles.btn}
            titleTxt={localization.appkeys?.tryFreeBtn}
            onPress={() => {
              return navigation.navigate(AppRoutes.Reminder as never);
            }}
          />
        </View>
      }
    />
  );
};
export default Offer;
