import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';

const EmergencyResources = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const ResourceCard = ({
    title,
    status,
    number,
  }: {
    title: string;
    status: string;
    number: string;
  }) => (
    <View style={styles.resourceCard}>
      <View style={styles.resourceHeader}>
        <View style={styles.resourceInfo}>
          <SolidText style={styles.resourceTitle}>{title}</SolidText>
          <SolidText style={styles.resourceStatus}>{status}</SolidText>
        </View>
        <Image
          source={images.call}
          style={styles.callIcon}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        style={styles.callButton}
        activeOpacity={0.8}
        onPress={() => {
          if (number.includes('Text')) {
            Linking.openURL('sms:85258?body=SHOUT');
          } else {
            Linking.openURL(`tel:${number.replace(/\s/g, '')}`);
          }
        }}
      >
        <SolidText style={styles.callButtonText}>{number}</SolidText>
      </TouchableOpacity>
    </View>
  );

  const LinkCard = ({ label }: { label: string }) => (
    <TouchableOpacity style={styles.linkCard} activeOpacity={0.7}>
      <SolidText style={styles.linkText}>{label}</SolidText>
      <Image
        source={images.open}
        style={styles.openIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={
              localization.appkeys?.emergencyHeader || 'Emergency Resources'
            }
            onBackPress={() => navigation.goBack()}
            rightIcon={images.crown}
            onRightPress={() => {}}
          />

          <HomeHeader
            viewStyle={{
              marginTop: -12,
              marginBottom: Platform.OS == 'ios' ? 18 : 16,
            }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={localization.appkeys?.helpTitle || 'Help'}
            safeSpaceLabel={
              localization.appkeys?.hereForYou || 'We are here for you'
            }
            subStyle={{ marginTop: 5 }}
          />

          <View style={styles.heroCard}>
            <SolidText style={styles.heroTitle}>
              {localization.appkeys?.immediateDanger ||
                "If you're in immediate danger"}
            </SolidText>
            <SolidText style={styles.heroDesc}>
              {localization.appkeys?.emergencyDesc ||
                'Please call emergency services (911, 112, or your local emergency number) or go to your nearest emergency room.'}
            </SolidText>
          </View>

          <SolidText style={styles.countryTitle}>
            {localization.appkeys?.france || 'France'}
          </SolidText>
          <ResourceCard
            title={localization.appkeys?.sosAmitie || 'SOS Amitié'}
            status={localization.appkeys?.available247 || 'Available 24/7'}
            number="09 72 39 40 50"
          />
          <ResourceCard
            title={localization.appkeys?.suicideEcoute || 'Suicide Écoute'}
            status={localization.appkeys?.available247 || 'Available 24/7'}
            number="01 45 39 40 00"
          />

          <SolidText style={styles.countryTitle}>
            {localization.appkeys?.unitedStates || 'United States'}
          </SolidText>
          <ResourceCard
            title={
              localization.appkeys?.suicideCrisisLifeline ||
              '988 Suicide & Crisis Lifeline'
            }
            status={localization.appkeys?.available247 || 'Available 24/7'}
            number="988"
          />

          <SolidText style={styles.countryTitle}>
            {localization.appkeys?.unitedKingdom || 'United Kingdom'}
          </SolidText>
          <ResourceCard
            title={localization.appkeys?.crisisTextLine || 'Crisis Text Line'}
            status={localization.appkeys?.available247 || 'Available 24/7'}
            number="Text SHOUT to 85258"
          />
          <View style={{ height: 20 }} />
          {/* <View style={styles.additionalSection}>
            <SolidText style={styles.countryTitle}>
              {localization.appkeys?.additionalSupport || 'Additional Support'}
            </SolidText>
            <LinkCard
              label={
                localization.appkeys?.onlineCrisisChat ||
                'Online Crisis Chat Resources'
              }
            />
            <LinkCard
              label={
                localization.appkeys?.findTherapist ||
                'Find a Therapist Near You'
              }
            />
            <LinkCard
              label={
                localization.appkeys?.mentalHealthFirstAid ||
                'Mental Health First Aid'
              }
            />
          </View> */}
        </View>
      }
    />
  );
};

export default EmergencyResources;
