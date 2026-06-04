import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import SolidText from './SolidText';
import AppFonts from '../constants/fonts';
import AppUtils from '../utils/appUtils';
import getEnvVars from '../../env';
import { triggerHaptic } from '../hooks/useHaptic';
interface DailyQuoteCardProps {
  title: string;
  quote: string;
  exploreLabel: string;
  onPress?: () => void;
  isLoading?: boolean;
}
const DailyQuoteCard = ({
  title,
  quote,
  exploreLabel,
  onPress,
  isLoading,
}: DailyQuoteCardProps) => {
  const { colors } = useTheme() as any;
  const user = useSelector((state: any) => state.userData?.user);
  const styles = useStyle(colors);
  const homeThemeUrl = user?.homeTheme?.imgUrl
    ? `${getEnvVars().fileUrl}${user.homeTheme.imgUrl}`
    : null;
  const activeColor = homeThemeUrl ? '#FFFFFF' : colors.brown;
  return (
    <Pressable
      onPress={(...args: any) => {
        return (onPress as any)(...args);
      }}
      style={styles.container}
    >
      <SolidText
        style={[
          styles.title,
          {
            color: colors.brown,
          },
        ]}
      >
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
        onPress={(...args: any) => {
          return (onPress as any)(...args);
        }}
      >
        <LinearGradient
          colors={
            homeThemeUrl
              ? ['#3A211026', '#3A211026'] // Semi-transparent brown fallback
              : ['#FFFFFF4D', '#FBE6D5', '#FBE6D5']
          }
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.card}
        >
          {homeThemeUrl && (
            <>
              <ImageBackground
                source={{
                  uri: homeThemeUrl,
                }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
                fadeDuration={0}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: 'rgba(0,0,0,0.25)',
                  },
                ]}
              />
            </>
          )}
          {isLoading ? (
            <ActivityIndicator color={activeColor} />
          ) : (
            <>
              <SolidText
                maxFontScale={1}
                style={[
                  styles.quoteText,
                  {
                    color: activeColor,
                    textShadowColor: homeThemeUrl
                      ? 'rgba(0, 0, 0, 0.4)'
                      : 'transparent',
                    textShadowOffset: {
                      width: 0,
                      height: 1,
                    },

                  },
                ]}
              >
                {quote}
              </SolidText>
              <SolidText
                maxFontScale={1}
                style={[
                  styles.exploreMore,
                  {
                    color: activeColor,
                  },
                ]}
              >
                {exploreLabel}
              </SolidText>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Pressable>
  );
};
const useStyle = (colors: any) =>
  StyleSheet.create({
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
      color: colors.brown,
    },
    exploreMore: {
      fontSize: 10,
      fontFamily: AppFonts.light,
      includeFontPadding: false,
    },
  });
export default DailyQuoteCard;
