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
    (state: any) => state.userData?.onboarding?.answers?.feelingsLately ?? null,
  );
  const [selected, setSelected] = useState<string | null>(savedSelection);
  useEffect(() => {
    setSelected(savedSelection);
  }, [savedSelection]);
  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.FeelingsLately));
    }, [dispatch]),
  );
  const handleBackPress = () => {
    const routes = (navigation as any)?.getState?.()?.routes || [];
    const previousRouteName =
      routes.length > 1 ? routes[routes.length - 2]?.name : null;
    if (previousRouteName === AppRoutes.BringYouHere) {
      navigation.goBack();
      return;
    }
    navigation.navigate(AppRoutes.BringYouHere as never);
  };
  const options = [
    {
      id: '1',
      label: localization.appkeys?.optionOverwhelmed,
    },
    {
      id: '2',
      label: localization.appkeys?.optionDrained,
    },
    {
      id: '3',
      label: localization.appkeys?.optionOverthinking,
    },
    {
      id: '4',
      label: localization.appkeys?.optionStuck,
    },
    {
      id: '5',
      label: localization.appkeys?.optionLost,
    },
    {
      id: '6',
      label: localization.appkeys?.optionClarity,
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
          <HeaderProgress progress={0.5} onBackPress={handleBackPress} />

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
              {localization.appkeys?.safeSpaceSub}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isSelected = selected === option.id;
                const isSelectedByText = selected === option.label;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      (isSelected || isSelectedByText) &&
                        styles.optionCardSelected,
                    ]}
                    onPress={() => {
                      triggerHaptic('impactMedium');
                      setSelected(option.label);
                      dispatch(
                        setOnboardingAnswer({
                          key: 'feelingsLately',
                          value: option.label,
                        }),
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <SolidText
                      style={[
                        styles.optionText,
                        (isSelected || isSelectedByText) &&
                          styles.optionTextSelected,
                      ]}
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
                return navigation.navigate(AppRoutes.FeelMore as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default FeelingsLately;
