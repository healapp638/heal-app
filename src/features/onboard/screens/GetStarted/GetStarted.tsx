import React, { useContext, useRef, useState, useEffect, useCallback } from 'react';
import { FlatList, Dimensions, Image, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { useDispatch } from 'react-redux';
import { setOnboardingCurrentScreen } from '../../../../redux/Reducers/userData';
import HeaderCommon from '../../../../components/HeaderCommon';

const { width } = Dimensions.get('window');

const GetStarted = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { images, colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    localization.appkeys?.testimonial1,
    localization.appkeys?.testimonial2,
    localization.appkeys?.testimonial3,
    localization.appkeys?.testimonial4,
    localization.appkeys?.testimonial5,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials.length]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.GetStarted));
    }, [dispatch]),
  );

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <View style={{ marginBottom: -60 }}>
            <HeaderCommon title={''} />
          </View>
          <Image
            resizeMode="contain"
            source={images.logo}
            style={styles.logo}
          />
          <Image
            source={images.start}
            resizeMode="contain"
            style={styles.startImage}
          />
          <SolidText style={styles.description}>
            {localization.appkeys?.reCenterSubtitle}
          </SolidText>

          <View style={styles.testimonialContainer}>
            <FlatList
              ref={flatListRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={testimonials}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.testimonialSlide}>
                  <Image
                    source={images.stars}
                    resizeMode="contain"
                    style={styles.starsImage}
                  />
                  <SolidText style={styles.quote}>{item}</SolidText>
                </View>
              )}
              onMomentumScrollEnd={event => {
                const index = Math.floor(
                  event.nativeEvent.contentOffset.x / (width * 0.9),
                );
                setCurrentIndex(index);
              }}
            />
          </View>

          <SolidBtn
            titleTxt={localization.appkeys?.getStarted}
            btnStyle={styles.btn}
            onPress={() => navigation.navigate(AppRoutes.HearAboutUs as never)}
          />
        </View>
      }
    />
  );
};

export default GetStarted;
