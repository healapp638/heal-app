import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import SolidText from './SolidText';
import AppRoutes from '../routes/RouteKeys/appRoutes';

interface PremiumFooterProps {
  localization: any;
  styles: any;
  navigation: any;
  appLanguage: any;
  hideRestore?: boolean;
}

const PremiumFooter: React.FC<PremiumFooterProps> = ({
  localization,
  styles,
  navigation,
  appLanguage,
  hideRestore = false,
}) => {
  return (
    <View style={styles.footerLinks}>
      {!hideRestore && (
        <>
          <TouchableOpacity>
            <SolidText maxFontScale={1} style={styles.footerLink}>
              {localization.appkeys?.restore}
            </SolidText>
          </TouchableOpacity>
          <View style={styles.footerDot} />
        </>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate(AppRoutes.PrivacyPolicy as never)}
      >
        <SolidText maxFontScale={1} style={styles.footerLink}>
          {localization.appkeys?.privacyPolicy}
        </SolidText>
      </TouchableOpacity>
      <View style={styles.footerDot} />
      <TouchableOpacity
        onPress={() => navigation.navigate(AppRoutes.Terms as never)}
      >
        <SolidText maxFontScale={1} style={styles.footerLink}>
          {localization.appkeys?.termsOfService}
        </SolidText>
      </TouchableOpacity>
    </View>
  );
};

export default PremiumFooter;
