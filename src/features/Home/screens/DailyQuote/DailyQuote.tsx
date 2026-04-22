import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const DailyQuote = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  return (
    <SolidView
      view={
        <View style={styles.container}>
          <HeaderCommon
            rightIcon={images.crown}
            onRightPress={() => setShowCreditsModal(true)}
          />

          <View style={styles.quoteContainer}>
            <SolidText style={styles.quoteText}>
              "{localization.appkeys.homeDailyQuote}"
            </SolidText>
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.iconBtn}>
                <Image
                  source={images.share}
                  style={styles.bottomIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Image
                  source={images.like}
                  style={styles.bottomIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate(AppRoutes.ThemeMixes as never)}
              style={styles.themeBtn}
            >
              <Image
                source={images.theme}
                style={styles.themeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default DailyQuote;
