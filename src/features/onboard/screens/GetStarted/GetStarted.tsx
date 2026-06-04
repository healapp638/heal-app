import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
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
import { triggerHaptic } from '../../../../hooks/useHaptic';
const { width } = Dimensions.get('window');
const GetStarted = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { images, colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const flatListRef = useRef<FlatList>(null);
  const testimonials = [
    localization.appkeys?.testimonial1,
    localization.appkeys?.testimonial2,
    localization.appkeys?.testimonial3,
    localization.appkeys?.testimonial4,
    localization.appkeys?.testimonial5,
  ];
  const testimonialsCount = testimonials.length;
  const extendedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  const [currentIndex, setCurrentIndex] = useState(testimonialsCount);

  const handleScrollEnd = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const itemWidth = width * 0.9;
      const index = Math.round(contentOffset / itemWidth);

      if (index < testimonialsCount) {
        const newIndex = index + testimonialsCount;
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
        setCurrentIndex(newIndex);
      } else if (index >= 2 * testimonialsCount) {
        const newIndex = index - testimonialsCount;
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
        setCurrentIndex(newIndex);
      } else {
        setCurrentIndex(index);
      }
    },
    [testimonialsCount],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 2000); // 2000ms to slide faster
    return () => clearInterval(timer);
  }, [currentIndex, testimonialsCount]);

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
          <View
            style={{
              marginBottom: -60,
            }}
          >
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
              data={extendedTestimonials}
              keyExtractor={(_, index) => index.toString()}
              initialScrollIndex={testimonialsCount}
              getItemLayout={(_, index) => ({
                length: width * 0.9,
                offset: width * 0.9 * index,
                index,
              })}
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
              onMomentumScrollEnd={handleScrollEnd}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          />
          <SolidBtn
            titleTxt={localization.appkeys?.getStarted}
            btnStyle={styles.btn}
            onPress={() => {
              return navigation.navigate(AppRoutes.HearAboutUs as never);
            }}
          />
        </View>
      }
    />
  );
};
export default GetStarted;
