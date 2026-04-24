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
import LogoutModal from '../../../../modals/LogoutModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import GetCreditsModal from '../../../../modals/GetCreditsModal';

const Settings = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [visible, setvisible] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const settingItems = [
    localization.appkeys?.personalInfo || 'Personal Information',
    localization.appkeys?.notifications || 'Notifications',
    localization.appkeys?.language || 'Language',
    localization.appkeys?.privacySecurity || 'Privacy & Security',
    localization.appkeys?.helpSupport || 'Help & Support',
    localization.appkeys?.aboutHeal || 'About HEAL',
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
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
            viewStyle={{ marginBottom: 20, marginTop: 10 }}
          />

          <SettingsProfileCard
            userName="John Doe"
            userEmail="Johndoe911@gmail.com"
            onLogoutPress={() => setvisible(true)}
          />

          {settingItems.map(item => {
            const isNotification =
              item === (localization.appkeys?.notifications || 'Notifications');
            const isPersonalInfo =
              item ===
              (localization.appkeys?.personalInfo || 'Personal Information');
            const isLanguage =
              item === (localization.appkeys?.language || 'Language');

            const isPrivacy =
              item ===
              (localization.appkeys?.privacySecurity || 'Privacy & Security');
            const isHelp =
              item === (localization.appkeys?.helpSupport || 'Help & Support');
            const isAbout =
              item === (localization.appkeys?.aboutHeal || 'About HEAL');

            return (
              <SettingItem
                key={item}
                label={item}
                rightIcon={
                  isNotification
                    ? isNotificationEnabled
                      ? images.toggleOn
                      : images.toggleOff
                    : undefined
                }
                onPress={() => {
                  if (isNotification) {
                    setIsNotificationEnabled(!isNotificationEnabled);
                  } else if (isPersonalInfo) {
                    navigation.navigate(AppRoutes.EditProfile as never);
                  } else if (isLanguage) {
                    navigation.navigate(AppRoutes.SelectLanguage as never);
                  } else if (isPrivacy) {
                    navigation.navigate(AppRoutes.PrivacyAndSecurity as never);
                  } else if (isHelp) {
                    navigation.navigate(AppRoutes.HelpAndSupport as never);
                  } else if (isAbout) {
                    navigation.navigate(AppRoutes.aboutHeal as never);
                  }
                }}
              />
            );
          })}

          <SettingItem
            label={
              localization.appkeys?.emergencyResources || 'Emergency Resources'
            }
            isPink
            onPress={() => navigation.navigate(AppRoutes.EmergencyResources as never)}
          />

          <SettingsPremiumCard
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
          />

          <View style={styles.footer}>
            <SolidText style={styles.footerText}>
              HEAL - Safe Place v1.0.0
            </SolidText>
          </View>
          <LogoutModal
            visible={visible}
            onConfirm={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.AuthStack as never,
                    params: { screen: AppRoutes.AccessScreen },
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
