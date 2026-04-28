import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import SolidBtn from '../../../../components/SolidBtn';
import GetCreditsModal from '../../../../modals/GetCreditsModal';

const ChallengeDetail = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate(AppRoutes.Exercise as never);
  };
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.tabChallenges || 'Challenges'}
            rightIcon={images.crown}
            onRightPress={() => setShowCreditsModal(true)}
          />

          <View style={styles.headerTextContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.challenge2Title || 'Moment of gratitude'}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.emotionalWellbeing ||
                'Emotional well-being'}
            </SolidText>
          </View>

          <View style={styles.taskCard}>
            <View style={styles.badgeWrapper}>
              <View style={styles.badgeCircle}>
                <Image
                  source={images.star1}
                  style={styles.badgeIcon}
                  resizeMode="contain"
                  tintColor={colors.brown}
                />
              </View>
            </View>

            <Text maxFontSizeMultiplier={1.4} style={styles.taskText}>
              {localization.appkeys?.challenge2Desc ||
                'Write 3 things you are grateful for today'}
            </Text>

            <View style={styles.pointsBadge}>
              <Image
                source={images.point}
                style={styles.pointsIcon}
                resizeMode="contain"
                tintColor="white"
              />
              <SolidText style={styles.pointsText}>
                {localization.appkeys?.tenPoints || '10 points'}
              </SolidText>
            </View>
          </View>

          <View style={styles.aboutCard}>
            <SolidText style={styles.aboutTitle}>
              {localization.appkeys?.aboutChallenge || 'About this challenge'}
            </SolidText>
            <SolidText style={styles.aboutText}>
              {localization.appkeys?.gratitudeChallengeAbout ||
                'Gratitude is a powerful healing tool. By taking the time to acknowledge the positive aspects of your life, even the smallest ones, you train your mind to see beyond the pain and appreciate what surrounds you.'}
            </SolidText>
          </View>
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.start || 'Start'}
            btnStyle={{ marginBottom: 40 }}
            onPress={handleStart}
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

export default ChallengeDetail;
