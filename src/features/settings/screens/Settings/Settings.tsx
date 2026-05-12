import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';
import SettingItem from '../../../../components/SettingItem';
import SettingsProfileCard from '../../../../components/SettingsProfileCard';
import SettingsPremiumCard from '../../../../components/SettingsPremiumCard';
import PremiumFooter from '../../../../components/PremiumFooter';
import LogoutModal from '../../../../modals/LogoutModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuth,
  setToken,
  setUser,
} from '../../../../redux/Reducers/userData';
import getEnvVars from '../../../../../env';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';
const Settings = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [visible, setvisible] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const user = useSelector((state: any) => state.userData?.user);
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);

  const settingItems = [
    localization.appkeys?.personalInfo || 'Personal Information',
    localization.appkeys?.biometricAuth || 'Biometric',
    localization.appkeys?.language || 'Language',
    // localization.appkeys?.privacySecurity || 'Privacy & Security',
    // localization.appkeys?.termsOfService || 'Terms of Service',
    // localization.appkeys?.privacyPolicy || 'Privacy Policy',
    localization.appkeys?.contactUs || 'Contact Us',
    localization.appkeys?.logout || 'Logout',
    // localization.appkeys?.aboutHeal || 'About HEAL',
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <View
            style={{
              flex: 1,
            }}
          >
            <HomeHeader
              showCrown
              showStreak={false}
              onCrownPress={() => {
                setShowCreditsModal(true);
              }}
              userName={localization.appkeys?.settingsTitle || 'Settings'}
              safeSpaceLabel={
                localization.appkeys?.manageAccount ||
                'Manage your account and preferences'
              }
              viewStyle={{
                marginBottom: 20,
                marginTop: 10,
              }}
            />

            {settingItems.map(item => {
              const isNotification =
                item === (localization.appkeys?.biometricAuth || 'Biometric');
              const isPersonalInfo =
                item ===
                (localization.appkeys?.personalInfo || 'Personal Information');
              const isLanguage =
                item === (localization.appkeys?.language || 'Language');
              const isPrivacy =
                item ===
                (localization.appkeys?.privacySecurity || 'Privacy & Security');
              const isHelp =
                item === (localization.appkeys?.contactUs || 'Contact Us');
              const isAbout =
                item === (localization.appkeys?.aboutHeal || 'About HEAL');
              const isTerms =
                item ===
                (localization.appkeys?.termsOfService || 'Terms of Service');
              const isPolicy =
                item ===
                (localization.appkeys?.privacyPolicy || 'Privacy Policy');
              const isLogout =
                item === (localization.appkeys?.logout || 'Logout');
              let rightIcon = undefined;
              let rightIconStyle = undefined;
              if (isNotification) {
                rightIcon = isNotificationEnabled
                  ? images.toggleOn
                  : images.toggleOff;
              } else if (isLogout) {
                rightIcon = images.logout;
                rightIconStyle = styles.logoutIcon;
              }

              return (
                <SettingItem
                  key={item}
                  label={item}
                  rightIcon={rightIcon}
                  rightIconStyle={rightIconStyle}
                  onPress={() => {
                    // triggerHaptic('impactHeavy');
                    if (isNotification) {
                      setIsNotificationEnabled(!isNotificationEnabled);
                    } else if (isPersonalInfo) {
                      navigation.navigate(AppRoutes.EditProfile as never);
                    } else if (isLanguage) {
                      navigation.navigate(
                        AppRoutes.SelectLanguage as never,
                        {
                          from: 'Settings',
                        } as never,
                      );
                    } else if (isPrivacy) {
                      navigation.navigate(
                        AppRoutes.PrivacyAndSecurity as never,
                      );
                    } else if (isHelp) {
                      navigation.navigate(AppRoutes.HelpAndSupport as never);
                    } else if (isAbout) {
                      navigation.navigate(AppRoutes.aboutHeal as never);
                    } else if (isTerms) {
                      navigation.navigate(AppRoutes.Terms as never);
                    } else if (isPolicy) {
                      navigation.navigate(AppRoutes.PrivacyPolicy as never);
                    } else if (isLogout) {
                      setvisible(true);
                    }
                  }}
                />
              );
            })}

            {/* <SettingItem
             label={
              localization.appkeys?.emergencyResources || 'Emergency Resources'
             }
             isPink
             onPress={() =>
              navigation.navigate(AppRoutes.EmergencyResources as never)
             }
             /> */}

            {/* <SettingsPremiumCard
             description={
              localization.appkeys?.unlockPremium ||
              'Unlock all premium features to support your healing journey'
             }
             priceLabel="€6.99/month"
             discoverLabel={
              localization.appkeys?.discoverPremium || 'Discover Premium'
             }
             onDiscoverPress={() =>
              // navigation.navigate(AppRoutes.Premium as never)
              setShowCreditsModal(true)
             }
             /> */}
            <SolidText
              style={[
                styles.subtitle,
                {
                  fontSize: AppUtils.fontSize(12),
                  fontFamily: AppFonts.bold,
                  marginBottom: 10,
                  marginTop: 10,
                },
              ]}
            >
              {localization.appkeys?.followUs || 'FOLLOW US'}
            </SolidText>
            <SettingItem
              label="Instagram"
              leftIcon={images.insta}
              rightIcon={images.arrowRight}
              onPress={() => {
                // triggerHaptic('impactHeavy');
                // add instagram link later
              }}
            />
            <SettingItem
              label="TikTok"
              leftIcon={images.tiktok}
              rightIcon={images.arrowRight}
              onPress={() => {
                // triggerHaptic('impactHeavy');
                // add tiktok link later
              }}
            />
          </View>

          <View style={styles.footer}>
            <SolidText style={styles.footerText}>
              HEAL - Safe Place v1.0.0
            </SolidText>
            <PremiumFooter
              localization={localization}
              styles={styles}
              navigation={navigation}
              appLanguage={appLanguage}
              hideRestore
            />
          </View>
          <LogoutModal
            visible={visible}
            onConfirm={() => {
              dispatch(setAuth(false));
              dispatch(setUser(null));
              dispatch(setToken(null));
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.AuthStack as never,
                    params: {
                      screen: AppRoutes.AccessScreen,
                    },
                  },
                ],
              });
            }}
            onClose={() => setvisible(false)}
          />

          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};
export default Settings;
