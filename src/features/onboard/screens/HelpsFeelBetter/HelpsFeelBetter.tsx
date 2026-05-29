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

const HelpsFeelBetter = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const savedSelection = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.helpFeelBetter,
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
      dispatch(setOnboardingCurrentScreen(AppRoutes.HelpsFeelBetter));
    }, [dispatch]),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const options = [
    {
      id: 'goingOutside',
      label: localization.appkeys?.optGoingOutside || 'Going outside',
    },
    {
      id: 'therapy',
      label: localization.appkeys?.optTherapy || 'Therapy / Professional help',
    },
    {
      id: 'journaling',
      label:
        localization.appkeys?.optJournaling || 'Journaling / Self-reflection',
    },
    {
      id: 'nature',
      label: localization.appkeys?.optNature || 'Spending time in nature',
    },
    {
      id: 'talkingSomeone',
      label:
        localization.appkeys?.optTalkingSomeone || 'Talking to someone I trust',
    },
    {
      id: 'listeningMusic',
      label:
        localization.appkeys?.optListeningMusic ||
        'Listening to music / podcasts',
    },
    {
      id: 'other',
      label: localization.appkeys?.optOther || 'Other / None of the above',
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
        key: 'helpFeelBetter',
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
          <HeaderProgress progress={0.8} onBackPress={handleBackPress} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.helpsFeelBetterTitle ||
                'What helps you feel better?'}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.helpsFeelBetterSub ||
                'You can select more than one option.'}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isCurrentSelected = selectedList.includes(option.label);

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
                  AppRoutes.StopsFeelingBetter as never,
                );
              }}
            />
          </View>
        </View>
      }
    />
  );
};

export default HelpsFeelBetter;
