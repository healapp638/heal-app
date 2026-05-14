import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderProgress from '../../../../components/HeaderProgress';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { useHaptic } from '../../../../hooks/useHaptic';
import { useDispatch, useSelector } from 'react-redux';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import {
  setOnboardingAnswer,
  setOnboardingCurrentScreen,
} from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const BringYouHere = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const savedSelection = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.bringYouHere ?? null,
  );
  const [selected, setSelected] = useState<string | null>(savedSelection);
  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.BringYouHere));
    }, [dispatch]),
  );
  const handleBackPress = () => {
    const routes = (navigation as any)?.getState?.()?.routes || [];
    const previousRouteName =
      routes.length > 1 ? routes[routes.length - 2]?.name : null;
    if (previousRouteName === AppRoutes.HearAboutUs) {
      navigation.goBack();
      return;
    }
    navigation.navigate(AppRoutes.HearAboutUs as never);
  };
  useEffect(() => {
    setSelected(savedSelection);
  }, [savedSelection]);
  const options = [
    {
      id: 'romantic',
      label: localization.appkeys?.optionRomantic,
      icon: images.romantic,
    },
    {
      id: 'family',
      label: localization.appkeys?.optionFamily,
      icon: images.family,
    },
    {
      id: 'friendship',
      label: localization.appkeys?.optionFriendship,
      icon: images.friendship,
    },
    {
      id: 'loneliness',
      label: localization.appkeys?.optionLoneliness,
      icon: images.loneliness,
    },
    {
      id: 'selfconfident',
      label: localization.appkeys?.optionSelfConfident,
      icon: images.selfconfident,
    },
    {
      id: 'needtotalk',
      label: localization.appkeys?.optionNeedToTalk,
      icon: images.needtotalk,
    },
  ];
  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View
          style={{
            flex: 1,
          }}
        >
          <HeaderProgress progress={0.4} onBackPress={handleBackPress} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.bringYouTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSub}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isSelected =
                  selected === option.id || selected === option.label;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => {
                      triggerHaptic('impactLight');
                      setSelected(option.label);
                      dispatch(
                        setOnboardingAnswer({
                          key: 'bringYouHere',
                          value: option.label,
                        }),
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={option.icon}
                      style={styles.icon}
                      resizeMode="contain"
                    />
                    <SolidText
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        {
                          width: '70%',
                        },
                      ]}
                      maxFontScale={1.2}
                    >
                      {option.label}
                    </SolidText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={{
                flex: 1,
              }}
            />
            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              disabled={!selected}
              onPress={() => {
                return navigation.navigate(AppRoutes.FeelingsLately as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default BringYouHere;
