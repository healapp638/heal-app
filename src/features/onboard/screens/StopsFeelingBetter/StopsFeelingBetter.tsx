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

const normalizeString = (str: string) => {
  return str.replace(/’/g, "'").trim();
};

const StopsFeelingBetter = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const savedSelection = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.stopFeelBetter,
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
      dispatch(setOnboardingCurrentScreen(AppRoutes.StopsFeelingBetter));
    }, [dispatch]),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const options = [
    {
      id: 'overthink',
      label: localization.appkeys?.optOverthink || 'I overthink things',
    },
    {
      id: 'loseMotivation',
      label: localization.appkeys?.optLoseMotivation || 'I lose motivation',
    },
    {
      id: 'stuckHead',
      label: localization.appkeys?.optStuckHead || 'I get stuck in my head',
    },
    {
      id: 'isolate',
      label: localization.appkeys?.optIsolate || 'I isolate myself',
    },
    {
      id: 'dontKnow',
      label: localization.appkeys?.optDontKnow || "I don't know what helps",
    },
    {
      id: 'unhealthyPatterns',
      label:
        localization.appkeys?.optUnhealthyPatterns ||
        'Falling into unhealthy patterns',
    },
  ];

  const handleOptionPress = (optionId: string, optionLabel: string) => {
    triggerHaptic('impactMedium');
    let updatedSelection: string[];
    const normalizedOptionLabel = normalizeString(optionLabel);

    const isAlreadySelected = selectedList.some(
      item => normalizeString(item) === normalizedOptionLabel,
    );

    if (isAlreadySelected) {
      updatedSelection = selectedList.filter(
        item => normalizeString(item) !== normalizedOptionLabel,
      );
    } else {
      updatedSelection = [...selectedList, optionLabel];
    }

    dispatch(
      setOnboardingAnswer({
        key: 'stopFeelBetter',
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
          <HeaderProgress progress={0.9} onBackPress={handleBackPress} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.stopsFeelingBetterTitle ||
                'What usually stops you from feeling better?'}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.stopsFeelingBetterSub ||
                'You can select more than one option.'}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isCurrentSelected = selectedList.some(
                  item =>
                    normalizeString(item) === normalizeString(option.label),
                );

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isCurrentSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => handleOptionPress(option.id, option.label)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
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
                        style={styles.tickIcon}
                        resizeMode="contain"
                      />
                    )} */}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={{
                flex: 1,
                minHeight: 20,
              }}
            />
            <SolidBtn
              titleTxt={localization.appkeys?.continue || 'Continue'}
              btnStyle={styles.btn}
              disabled={selectedList.length === 0}
              onPress={() => {
                return navigation.navigate(
                  AppRoutes.UnderstandYourself as never,
                );
              }}
            />
          </View>
        </View>
      }
    />
  );
};

export default StopsFeelingBetter;
