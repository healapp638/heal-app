import { Image, View } from 'react-native';
import React, { useContext } from 'react';
import SolidView from '../../../../components/SolidView';
import { LocalizationContext } from '../../../../localization/localization';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import StreakCard from '../../../../components/StreakCard';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';

const DailyStreak = () => {
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const { images, colors } = useTheme() as any;
  const styles = style(colors);

  return (
    <SolidView
      view={
        <View style={styles.container}>
          <HeaderCommon title={localization.appkeys.streak} />

          <Image
            source={images.bigStreak}
            resizeMode="contain"
            style={styles.bigStreak}
          />

          <SolidText style={styles.quoteText}>
            "{localization.appkeys.homeDailyQuote}"
          </SolidText>
          <SolidText style={styles.buildStreakText}>
            {localization.appkeys.buildStreak}
          </SolidText>
          <StreakCard />

          <SolidBtn
            btnStyle={styles.continueBtn}
            titleTxt={localization.appkeys.continue}
            onPress={() => navigation.goBack()}
          />
        </View>
      }
    />
  );
};

export default DailyStreak;
