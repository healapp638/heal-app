import React, { useState, useContext } from 'react';
import { View, Image, TouchableOpacity, Platform, Linking } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import HomeHeader from '../../../../components/HomeHeader';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const AboutHeal = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [creditsVisible, setCreditsVisible] = useState(false);

  const ValueCard = ({
    icon,
    title,
    desc,
  }: {
    icon: any;
    title: string;
    desc: string;
  }) => (
    <View style={styles.valueCard}>
      <Image source={icon} style={styles.valueIcon} resizeMode="contain" />

      <SolidText style={styles.valueTitle}>{title}</SolidText>
      <SolidText style={styles.valueDesc}>{desc}</SolidText>
    </View>
  );

  const BulletPoint = ({ text }: { text: string }) => (
    <View style={styles.bulletItem}>
      <SolidText style={styles.bulletText}>• {text}</SolidText>
    </View>
  );

  const LinkItem = ({
    label,
    icon,
    onPress,
  }: {
    label: string;
    icon: any;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.linkCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <SolidText style={styles.linkText}>{label}</SolidText>
      <Image source={icon} style={styles.linkIcon} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.aboutHealHeader || 'About HEAL'}
            onBackPress={() => navigation.goBack()}
            rightIcon={images.crown}
            onRightPress={() => setCreditsVisible(true)}
          />

          <HomeHeader
            viewStyle={{
              marginTop: -12,
              marginBottom: Platform.OS == 'ios' ? 18 : 16,
            }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={localization.appkeys?.aboutHeader || 'About'}
            safeSpaceLabel={
              localization.appkeys?.ourMissionValues || 'Our mission and values'
            }
            subStyle={{ marginTop: 5 }}
          />

          <View style={styles.heroCard}>
            <Image
              source={images.logo}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <SolidText style={styles.heroTitle}>
              {localization.appkeys?.yourSafePlace || 'YOUR SAFE PLACE'}
            </SolidText>
            <SolidText style={styles.heroSubtitle}>
              {localization.appkeys?.companionDesc ||
                'Your companion for emotional healing and personal reconstruction'}
            </SolidText>
          </View>

          <SolidText style={styles.sectionTitle}>
            {localization.appkeys?.ourMission || 'Our Mission'}
          </SolidText>
          <View style={styles.whiteCard}>
            <SolidText style={styles.missionText}>
              {localization.appkeys?.missionText1 ||
                'HEAL was created to accompany people going through breakups, emotional upheaval, or any difficult life transition. We believe everyone deserves a safe space to express their emotions, progress at their own pace, and rediscover their inner balance.'}
            </SolidText>
            <SolidText style={[styles.missionText, styles.missionTextMargin]}>
              {localization.appkeys?.missionText2 ||
                'This app provides emotional support and guidance, but is not a medical or therapeutic service.'}
            </SolidText>
          </View>

          <SolidText style={styles.sectionTitle}>
            {localization.appkeys?.ourValues || 'Our Values'}
          </SolidText>
          <View style={styles.gridContainer}>
            <ValueCard
              icon={images.care}
              title={localization.appkeys?.careTitle || 'Care & Compassion'}
              desc={
                localization.appkeys?.careDesc ||
                'A safe, judgment-free space for your emotional healing'
              }
            />
            <ValueCard
              icon={images.privacy2}
              title={
                localization.appkeys?.privacyTitleValue || 'Privacy & Security'
              }
              desc={
                localization.appkeys?.privacyDescValue ||
                'Your data and journal remain completely private and secure'
              }
            />
            <ValueCard
              icon={images.ethical}
              title={localization.appkeys?.ethicalTitle || 'Ethical Boundaries'}
              desc={
                localization.appkeys?.ethicalDesc ||
                'We are clear about our limits - this is not therapy'
              }
            />
            <ValueCard
              icon={images.human}
              title={localization.appkeys?.humanTitle || 'Human-Centered'}
              desc={
                localization.appkeys?.humanDesc ||
                'Built with respect for your journey and your autonomy'
              }
            />
          </View>

          <View style={styles.importantCard}>
            <SolidText style={styles.importantTitle}>
              {localization.appkeys?.importantTitle ||
                'Important: What HEAL Is Not'}
            </SolidText>
            <BulletPoint
              text={
                localization.appkeys?.notTherapy ||
                'HEAL does not replace professional therapy or medical treatment'
              }
            />
            <BulletPoint
              text={
                localization.appkeys?.notCrisis ||
                'HEAL is not for crisis intervention (please use our SOS resources)'
              }
            />
            <BulletPoint
              text={
                localization.appkeys?.notDiagnosis ||
                'HEAL does not diagnose or treat mental health conditions'
              }
            />
            <BulletPoint
              text={
                localization.appkeys?.notGuarantee ||
                'HEAL does not guarantee specific healing outcomes'
              }
            />

            <View style={styles.separator} />

            <SolidText style={styles.footerTextImportant}>
              {localization.appkeys?.needClinicalSupport ||
                'If you need clinical support, please reachout to a licensed therapist or counselor.'}
            </SolidText>
          </View>

          <LinkItem
            label={localization.appkeys?.website || 'Website'}
            icon={images.open}
            onPress={() => Linking.openURL('https://www.heal-app.com/')}
          />
          <LinkItem
            label={localization.appkeys?.termsOfService || 'Terms of Service'}
            icon={images.open}
            onPress={() => navigation.navigate(AppRoutes.Terms as never)}
          />
          <LinkItem
            label={localization.appkeys?.privacyPolicy || 'Privacy Policy'}
            icon={images.open}
            onPress={() =>
              navigation.navigate(AppRoutes.PrivacyPolicy as never)
            }
          />

          <View style={styles.footerContainer}>
            <SolidText style={styles.versionText}>
              {localization.appkeys?.version || 'Version 1.0.0'}
            </SolidText>
            <SolidText style={styles.copyrightText}>
              {localization.appkeys?.copyright ||
                '© 2026 HEAL - Safe Place. All rights reserved.'}
            </SolidText>
            <SolidText style={styles.madeWithText}>
              {localization.appkeys?.madeWith ||
                'Made with 🤍 to support your healing'}
            </SolidText>
          </View>

          <GetCreditsModal
            visible={creditsVisible}
            onClose={() => setCreditsVisible(false)}
          />
        </View>
      }
    />
  );
};

export default AboutHeal;
