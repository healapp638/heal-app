import React, { useContext, useEffect, useState } from 'react';
import { View, Linking, ScrollView } from 'react-native';
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
  setBiometric,
  getUserDetail,
  clearOnboardingProgress,
} from '../../../../redux/Reducers/userData';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import getEnvVars from '../../../../../env';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import AppUtils from '../../../../utils/appUtils';
import AppFonts from '../../../../constants/fonts';
import PremiumModal from '../../../../modals/PremiumModal';
const Settings = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [visible, setvisible] = useState(false);
  const biometric = useSelector((state: any) => state.userData?.biometric);
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const user = useSelector((state: any) => state.userData?.user);
  const { mutate: toggleBioApi } = usePostApi();
  const [isBioEnabled, setIsBioEnabled] = useState(!!biometric);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    setIsBioEnabled(!!biometric);
  }, [biometric]);

  const isSocialUser = user?.account_type == 'social';

  const settingItems = [
    localization.appkeys?.personalInfo || 'Personal Information',
    // !isSocialUser && (localization.appkeys?.biometricAuth || 'Biometric'),
    localization.appkeys?.language || 'Language',
    localization.appkeys?.contactUs || 'Contact Us',
    localization.appkeys?.logout || 'Logout',
  ].filter(Boolean) as string[];

  return (
    <SolidView
      isScrollEnabled={false}
      view={
        <View style={styles.mainContainer}>
          <View style={{}}>
            <HomeHeader
              showCrown
              showStreak={false}
              onCrownPress={() => {
                triggerHaptic('impactMedium');
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
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View
              style={{
                flex: 1,
                paddingHorizontal: 2,
              }}
            >
              {settingItems?.map(item => {
                const isBiometric =
                  item === (localization.appkeys?.biometricAuth || 'Biometric');
                const isPersonalInfo =
                  item ===
                  (localization.appkeys?.personalInfo ||
                    'Personal Information');
                const isLanguage =
                  item === (localization.appkeys?.language || 'Language');
                const isPrivacy =
                  item ===
                  (localization.appkeys?.privacySecurity ||
                    'Privacy & Security');
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
                if (isBiometric) {
                  rightIcon = isBioEnabled ? images.toggleOn : images.toggleOff;
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
                      triggerHaptic('impactMedium');
                      if (isBiometric) {
                        const newVal = !isBioEnabled;
                        setIsBioEnabled(newVal);
                        dispatch(setBiometric(newVal));
                        toggleBioApi(
                          {
                            endpoint: endpoints.toggle_biometric,
                            data: { is_biometric: newVal },
                          },
                          {
                            onSuccess: (res: any) => {
                              // If server returns updated user, use it
                              if (res?.data) {
                                dispatch(setUser(res.data));
                              } else {
                                dispatch(getUserDetail() as any);
                              }
                            },
                            onError: error => {
                              const errorMsg =
                                error?.message ||
                                (typeof error === 'string' ? error : '');
                              // If the message says "successfully", it's a success in disguise
                              if (
                                errorMsg
                                  ?.toLowerCase()
                                  ?.includes('successfully')
                              ) {
                                dispatch(getUserDetail() as any);
                              } else {
                                // Real error, rollback
                                setIsBioEnabled(!newVal);
                                dispatch(setBiometric(!newVal));
                              }
                            },
                          },
                        );
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
                  triggerHaptic('impactMedium');
                  Linking.openURL('https://www.instagram.com/heal.safespace');
                }}
              />
              <SettingItem
                label="TikTok"
                leftIcon={images.tiktok}
                rightIcon={images.arrowRight}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  Linking.openURL('https://www.tiktok.com/@heal.safespace');
                }}
              />
            </View>

            <View style={styles.footer}>
              <SolidText style={styles.footerText}>
                HEAL - Safe Place {localization.appkeys?.versionText || 'Version'} 1.0.0
              </SolidText>
              <PremiumFooter
                localization={localization}
                styles={styles}
                navigation={navigation}
                appLanguage={appLanguage}
                hideRestore
              />
            </View>
          </ScrollView>

          <LogoutModal
            visible={visible}
            onConfirm={() => {
              dispatch(clearOnboardingProgress());
              dispatch(setAuth(false));
              dispatch(setUser({}));
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

          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};
export default Settings;
