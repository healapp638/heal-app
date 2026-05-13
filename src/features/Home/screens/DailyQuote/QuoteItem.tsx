import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import SolidText from '../../../../components/SolidText';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QuoteItemProps {
  item: any;
  index: number;
  styles: any;
  homeThemeUrl: string | null;
  activeColor: string;
  images: any;
  handleShare: (item: any) => void;
  handleLike: (index: number) => void;
  viewShotRefs: any;
}

const QuoteItem = ({
  item,
  index,
  styles,
  homeThemeUrl,
  activeColor,
  images,
  handleShare,
  handleLike,
  viewShotRefs,
}: QuoteItemProps) => {
  const isLiked = !!item.is_liked;
  const quoteContent = item.affirmation;

  return (
    <View style={styles.slideContainer}>
      <ViewShot
        ref={ref => {
          if (ref) viewShotRefs.current[index] = ref;
        }}
        options={{
          format: 'png',
          quality: 0.9,
        }}
        style={[
          styles.captureContainer,
          {
            height: SCREEN_HEIGHT,
          },
        ]}
      >
        {homeThemeUrl ? (
          <>
            <ImageBackground
              source={{
                uri: homeThemeUrl,
              }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
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
        ) : null}

        <View
          style={[
            styles.quoteContainer,
            {
              width: '100%',
            },
          ]}
        >
          <SolidText
            style={[
              styles.quoteText,
              {
                color: activeColor,
                textShadowColor:
                  activeColor === '#FFFFFF'
                    ? 'rgba(0, 0, 0, 0.4)'
                    : 'transparent',
                textShadowOffset: {
                  width: 0,
                  height: 1,
                },
                textShadowRadius: 10,
              },
            ]}
          >
            {quoteContent.startsWith('"') ? quoteContent : `"${quoteContent}"`}
          </SolidText>
        </View>
      </ViewShot>

      <View style={styles.footerContainer}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              handleShare(item);
            }}
          >
            <Image
              source={images.share}
              style={[
                styles.bottomIcon,
                {
                  tintColor: activeColor,
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              handleLike(index);
            }}
          >
            <Image
              source={isLiked ? images.heartFill : images.like}
              style={[
                styles.bottomIcon,
                {
                  tintColor: activeColor,
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(QuoteItem);
