import React from 'react';
import { View, Image } from 'react-native';
import SolidText from './SolidText';

interface TimelineCardProps {
  localization: any;
  styles: any;
  images: any;
  trialReminderDate: string;
  becomeMemberDate: string;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  localization,
  styles,
  images,
  trialReminderDate,
  becomeMemberDate,
}) => {
  return (
    <View style={styles.timelineCard}>
      <View style={styles.timelineLeft}>
        <Image
          source={images.premium}
          style={styles.premiumImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.timelineRight}>
        <View style={styles.timelineItem}>
          <SolidText style={styles.timelineTitle}>
            {localization.appkeys?.todayFreeTrialStarts}
          </SolidText>
          <SolidText style={styles.timelineSub}>
            {localization.appkeys?.enjoyFullAccess}
          </SolidText>
        </View>

        <View style={{ ...styles.timelineItem, marginVertical: 20 }}>
          <SolidText style={styles.timelineTitle}>
            {trialReminderDate} -{' '}
            {localization.appkeys?.trialReminderDate?.split(' - ')[1] ||
              'Trial reminder'}
          </SolidText>
          <SolidText style={styles.timelineSub}>
            {localization.appkeys?.endingSoon}
          </SolidText>
        </View>

        <View style={styles.timelineItem}>
          <SolidText style={styles.timelineTitle}>
            {becomeMemberDate} -{' '}
            {localization.appkeys?.becomeMemberDate?.split(' - ')[1] ||
              'Become member'}
          </SolidText>
          <SolidText style={styles.timelineSub}>
            {localization.appkeys?.endsUnlessCanceled}
          </SolidText>
        </View>
      </View>
    </View>
  );
};

export default TimelineCard;
