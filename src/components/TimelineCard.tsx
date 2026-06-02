import React from 'react';
import { View, Image, Platform } from 'react-native';
import SolidText from './SolidText';

interface TimelineCardProps {
  localization: any;
  styles: any;
  images: any;
  trialReminderDate: string;
  becomeMemberDate: string;
  selectedPlan: 'monthly' | 'yearly';
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  localization,
  styles,
  images,
  trialReminderDate,
  becomeMemberDate,
  selectedPlan,
}) => {
  return (
    <View style={styles.timelineCard}>
      <View style={styles.timelineLeft}>
        <Image
          source={selectedPlan === 'monthly' ? images.premium2 : images.premium}
          style={
            selectedPlan === 'monthly'
              ? styles.premiumImage2
              : styles.premiumImage
          }
          resizeMode="contain"
        />
      </View>

      <View style={styles.timelineRight}>
        {selectedPlan === 'monthly' ? (
          <>
            <View
              style={{
                ...styles.timelineItem,
                marginTop: Platform.OS == 'ios' ? 1 : 3,
              }}
            >
              <SolidText maxFontScale={1} style={styles.timelineTitle}>
                {localization.appkeys?.feelBetterEveryDay ||
                  'Feel Better Every Day'}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.feelBetterEveryDaySub ||
                  'Small daily actions designed to help you feel more balanced, calm and fulfilled.'}
              </SolidText>
            </View>

            <View style={styles.timelineItemCenter}>
              <SolidText maxFontScale={1} style={styles.timelineTitle}>
                {localization.appkeys?.buildBetterHabits ||
                  'Build Better Habits'}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.buildBetterHabitsSub ||
                  'Create simple habits that support your mental wellbeing and personal growth.'}
              </SolidText>
            </View>

            <View style={styles.timelineItem}>
              <SolidText maxFontScale={1} style={styles.timelineTitle}>
                {localization.appkeys?.becomeBestSelf ||
                  'Become Your Best Self'}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.becomeBestSelfSub ||
                  'Unlock your potential and grow into the person you want to be.'}
              </SolidText>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                ...styles.timelineItem,
                marginTop: Platform.OS == 'ios' ? 1 : 3,
              }}
            >
              <SolidText
                maxFontScale={1}
                style={{
                  ...styles.timelineTitle,
                  textDecorationLine: 'line-through',
                }}
              >
                {localization.appkeys?.installTheApp || 'Install the app'}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.setUpToMatchGoals ||
                  'Set it up to match your goals'}
              </SolidText>
            </View>

            <View style={{ ...styles.timelineItemCenter, marginBottom: 0 }}>
              <SolidText maxFontScale={1} style={styles.timelineTitle}>
                {localization.appkeys?.todayFreeTrialStarts}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.enjoyFullAccess}
              </SolidText>
            </View>

            <View style={styles.timelineItemCenter}>
              <SolidText maxFontScale={1} style={styles.timelineTitle}>
                {trialReminderDate} -{' '}
                {localization.appkeys?.trialReminderDate?.split(' - ')[1] ||
                  'Trial reminder'}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.endingSoon}
              </SolidText>
            </View>

            <View style={styles.timelineItem}>
              <SolidText maxFontScale={1} style={styles.timelineTitle}>
                {becomeMemberDate} -{' '}
                {localization.appkeys?.becomeMemberDate?.split(' - ')[1] ||
                  'Become member'}
              </SolidText>
              <SolidText maxFontScale={1} style={styles.timelineSub}>
                {localization.appkeys?.endsUnlessCanceled}
              </SolidText>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default TimelineCard;
