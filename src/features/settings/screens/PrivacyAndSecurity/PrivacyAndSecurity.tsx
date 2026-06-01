import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import style from './style';
import { LocalizationContext } from '../../../../localization/localization';
import HomeHeader from '../../../../components/HomeHeader';
import DeleteAccountModal from '../../../../modals/DeleteAccountModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { useSelector } from 'react-redux';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const PrivacyAndSecurity = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const user = useSelector((state: any) => state?.userData?.user);
  const [authToggles, setAuthToggles] = useState({
    biometric: false,
    twoFactor: true,
    autoLock: true,
  });
  const [dataToggles, setDataToggles] = useState({
    encryption: false,
    privateDiary: true,
    sharing: true,
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const toggleAuth = (key: keyof typeof authToggles) => {
    setAuthToggles(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const toggleData = (key: keyof typeof dataToggles) => {
    setDataToggles(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const renderSettingItem = (
    icon: any,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: () => void,
    isLast: boolean = false,
  ) => (
    <View style={styles.settingItemContainer}>
      <View style={styles.settingItemContent}>
        <Image
          source={icon}
          style={{
            width: 40,
            height: 40,
            marginRight: 12,
            borderRadius: 22,
          }}
          resizeMode="contain"
        />
        <View style={styles.settingItemTextContainer}>
          <SolidText style={styles.settingItemTitle}>{title}</SolidText>
          <SolidText style={styles.settingItemSubtitle}>{subtitle}</SolidText>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={(...args: any) => {
          return (onToggle as any)(...args);
        }}
      >
        <Image
          source={value ? images.toggleOn : images.toggleOff}
          style={styles.toggleIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={
              localization.appkeys?.privacyAndSecurityHeader ||
              'Privacy and security'
            }
          />
          <HomeHeader
            viewStyle={{
              marginTop: -8,
              marginBottom: Platform.OS == 'ios' ? 18 : 16,
            }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={
              localization.appkeys?.privacyAndSecurityHeader ||
              'Privacy and security'
            }
            safeSpaceLabel={
              localization.appkeys?.protectInformation ||
              'Protect your information'
            }
            subStyle={{
              marginTop: 5,
            }}
          />

          {/* Security Level Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image
                source={images.security}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 12,
                  borderRadius: 22,
                }}
                resizeMode="contain"
              />
              <View>
                <SolidText style={styles.securityLevelTitle}>
                  {localization.appkeys?.securityLevel || 'Security level'}
                </SolidText>
                <SolidText style={styles.securityLevelSubtitle}>
                  {localization.appkeys?.pupil || 'Pupil'}
                </SolidText>
              </View>
            </View>
            <SolidText style={styles.securityLevelDesc}>
              {localization.appkeys?.securityLevelDesc ||
                'Your personal data and your journal are protected with end-to-end encryption.'}
            </SolidText>
          </View>

          {/* Authentication Section */}

          <View style={styles.card}>
            <SolidText style={styles.sectionTitle}>
              {localization.appkeys?.authentication || 'Authentication'}
            </SolidText>
            {renderSettingItem(
              images.secure,
              localization.appkeys?.biometricAuth || 'Biometric authentication',
              localization.appkeys?.biometricAuthDesc ||
                'Face ID or fingerprint',
              authToggles.biometric,
              () => toggleAuth('biometric'),
            )}
            {renderSettingItem(
              images.security,
              localization.appkeys?.twoFactorAuth ||
                'Two-factor authentication',
              localization.appkeys?.twoFactorAuthDesc ||
                'Enhanced security for the connection',
              authToggles.twoFactor,
              () => toggleAuth('twoFactor'),
            )}
            {renderSettingItem(
              images.autoLock,
              localization.appkeys?.autoLock || 'Automatic lock',
              localization.appkeys?.autoLockDesc ||
                'After 5 minutes of inactivity',
              authToggles.autoLock,
              () => toggleAuth('autoLock'),
              true,
            )}
          </View>

          {/* Data Privacy Section */}

          <View style={styles.card}>
            <SolidText style={styles.sectionTitle}>
              {localization.appkeys?.dataPrivacy || 'Data privacy'}
            </SolidText>
            {renderSettingItem(
              images.data,
              localization.appkeys?.dataEncryption || 'Data encryption',
              localization.appkeys?.dataEncryptionDesc ||
                'All your data is secure.',
              dataToggles.encryption,
              () => toggleData('encryption'),
            )}
            {renderSettingItem(
              images.privacy,
              localization.appkeys?.privateDiary || 'Private diary',
              localization.appkeys?.privateDiaryDesc ||
                'Your journal remains completely private.',
              dataToggles.privateDiary,
              () => toggleData('privateDiary'),
            )}
            {renderSettingItem(
              images.analytic,
              localization.appkeys?.sharingAnalyticData ||
                'Sharing analytical data',
              localization.appkeys?.sharingAnalyticDataDesc ||
                'Help improve the application',
              dataToggles.sharing,
              () => toggleData('sharing'),
              true,
            )}
          </View>

          {/* Data Management Section */}
          <SolidText style={styles.sectionTitleManagement}>
            {localization.appkeys?.dataManagement || 'Data management'}
          </SolidText>
          <TouchableOpacity activeOpacity={0.8} style={styles.managementCard}>
            <SolidText style={styles.managementTitle}>
              {localization.appkeys?.downloadMyData || 'Download my data'}
            </SolidText>
            <SolidText style={styles.managementSubtitle}>
              {localization.appkeys?.downloadMyDataDesc ||
                'Export a copy of all your information'}
            </SolidText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.managementCard}
            onPress={() => {
              return setIsDeleteModalVisible(true);
            }}
          >
            <SolidText style={styles.managementTitle}>
              {localization.appkeys?.deleteMyAccount || 'Delete my account'}
            </SolidText>
            <SolidText style={styles.managementSubtitle}>
              {localization.appkeys?.deleteMyAccountDesc ||
                'This action is irreversible'}
            </SolidText>
          </TouchableOpacity>

          <View
            style={{
              height: 40,
            }}
          />

          <DeleteAccountModal
            visible={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            onConfirm={() => setIsDeleteModalVisible(false)}
          />
        </View>
      }
    />
  );
};
export default PrivacyAndSecurity;
