import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderProgress from '../../../../components/HeaderProgress';
import { useHaptic } from '../../../../hooks/useHaptic';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOnboardingAnswer,
  setOnboardingCurrentScreen,
} from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const FeelingsLately = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const savedSelection = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.howFellingLately,
  );

  const selectedList = typeof savedSelection === 'string'
    ? savedSelection.split(', ').filter(Boolean)
    : Array.isArray(savedSelection)
      ? savedSelection
      : savedSelection
        ? [savedSelection]
        : [];

  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.FeelingsLately));
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

  const options = [
    {
      id: 'calm',
      label: localization.appkeys?.feelingCalm || 'Calm',
      icon: images.calmS,
    },
    {
      id: 'sad',
      label: localization.appkeys?.feelingSad || 'Sad',
      icon: images.sadS,
    },
    {
      id: 'happy',
      label: localization.appkeys?.feelingHappy || 'Happy',
      icon: images.happyS,
    },
    {
      id: 'sorrow',
      label: localization.appkeys?.feelingSorrow || 'Sorrow',
      icon: images.sorrowS,
    },
    {
      id: 'thoughtful',
      label: localization.appkeys?.feelingThoughtful || 'Thoughtful',
      icon: images.thoughtfulS,
    },
    {
      id: 'hopeful',
      label: localization.appkeys?.feelingHopeful || 'Hopeful',
      icon: images.hopeS,
    },
    {
      id: 'other',
      label: localization.appkeys?.optionOther || 'Other',
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
        key: 'howFellingLately',
        value: updatedSelection.join(', '),
      }),
    );
  };

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
          <HeaderProgress progress={0.2} onBackPress={handleBackPress} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.feelingsTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.chooseMood || "Choose a mood that suits you."}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isCurrentSelected = selectedList.includes(option.label) || selectedList.includes(option.id);
                const isOther = option.id === 'other';

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isCurrentSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => handleOptionPress(option.label)}
                    activeOpacity={0.7}
                  >
                    {!isOther ? (
                      <>
                        <View style={styles.optionContentLeft}>
                          {option.icon && (
                            <Image
                              source={option.icon}
                              style={styles.icon}
                              resizeMode="contain"
                            />
                          )}
                          <SolidText
                            style={[
                              styles.optionText,
                              styles.optionTextLeft,
                              isCurrentSelected && styles.optionTextSelected,
                            ]}
                          >
                            {option.label}
                          </SolidText>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <SolidText
                            style={[
                              styles.optionText,
                              isCurrentSelected && styles.optionTextSelected,
                            ]}
                          >
                            {option.label}
                          </SolidText>
                        </View>
                        {/* {isCurrentSelected && (
                          <Image
                            source={images.tick}
                            style={[styles.tickIcon, { position: 'absolute', right: 16 }]}
                            resizeMode="contain"
                          />
                        )} */}
                      </>
                    )}
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
              disabled={selectedList.length === 0}
              onPress={() => {
                return navigation.navigate(AppRoutes.BringYouHere as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default FeelingsLately;
