import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';

interface DailyQuoteCardProps {
  title: string;
  quote: string;
  exploreLabel: string;
  onPress?: () => void;
}

const DailyQuoteCard = ({
  title,
  quote,
  exploreLabel,
  onPress,
}: DailyQuoteCardProps) => {
  const { colors } = useTheme() as any;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <SolidText style={[styles.title, { color: colors.brown }]}>
        {title}
      </SolidText>
      <TouchableOpacity
        style={{
          height: 100,
          width: '100%',

          borderWidth: 1,
          borderColor: '#3A21101A',
          borderRadius: 18,
        }}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <LinearGradient
          colors={['#FFFFFF4D', '#FBE6D5', '#FBE6D5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <SolidText
            maxFontScale={1}
            style={[styles.quoteText, { color: colors.brown }]}
          >
            "{quote}"
          </SolidText>
          <SolidText
            maxFontScale={1}
            style={[styles.exploreMore, { color: colors.brown }]}
          >
            {exploreLabel}
          </SolidText>
        </LinearGradient>
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: AppFonts.semiBold,
    marginBottom: 10,
    includeFontPadding: false,
  },
  card: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 18,

    // ✅ removed overflow: 'hidden' — it was clipping text inside
  },
  quoteText: {
    fontSize: AppUtils.fontSize(16),
    fontFamily: AppFonts.reco,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 14,
    includeFontPadding: false,
    width: '94%',
    color: 'black',
  },
  exploreMore: {
    fontSize: 10,
    fontFamily: AppFonts.light,

    includeFontPadding: false,
  },
});

export default DailyQuoteCard;
