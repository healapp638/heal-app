import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
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
    (state: any) => state.userData?.onboarding?.answers?.feelThatWay,
  );

  const selectedList =
    typeof savedSelection === 'string'
      ? savedSelection.split(', ').filter(Boolean)
      : Array.isArray(savedSelection)
      ? savedSelection
      : savedSelection
      ? [savedSelection]
      : [];

  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.BringYouHere));
    }, [dispatch]),
  );

  const handleBackPress = () => {
    const routes = (navigation as any)?.getState?.()?.routes || [];
    const previousRouteName =
      routes.length > 1 ? routes[routes.length - 2]?.name : null;
    if (previousRouteName === AppRoutes.FeelingsLately) {
      navigation.goBack();
      return;
    }
    navigation.navigate(AppRoutes.FeelingsLately as never);
  };

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

  const handleOptionPress = (optionLabel: string) => {
    triggerHaptic('impactMedium');
    let updatedSelection: string[];
    if (selectedList.includes(optionLabel)) {
      updatedSelection = selectedList.filter(item => item !== optionLabel);
    } else {
      updatedSelection = [...selectedList, optionLabel];
    }
    dispatch(
      setOnboardingAnswer({
        key: 'feelThatWay',
        value: updatedSelection.join(', '),
      }),
    );
  };

  return (
    <SolidView
      isScrollEnabled={false}
      viewStyle={{
        flex: 1,
      }}
      view={
        <View
          style={{
            flex: 1,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
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
                    selectedList.includes(option.label) ||
                    selectedList.includes(option.id);
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => handleOptionPress(option.label)}
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
            </View>
          </ScrollView>

          <View style={styles.btnContainer}>
            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              disabled={selectedList.length === 0}
              onPress={() => {
                return navigation.navigate(AppRoutes.FeelMore as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default BringYouHere;
