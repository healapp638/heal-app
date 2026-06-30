import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
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
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOnboardingAnswer,
  setOnboardingCurrentScreen,
} from '../../../../redux/Reducers/userData';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const TimeCommitment = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { triggerHaptic } = useHaptic();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const savedSelection = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.timeYouCommit ?? null,
  );
  const [selected, setSelected] = useState<string | null>(savedSelection);
  useEffect(() => {
    setSelected(savedSelection);
  }, [savedSelection]);
  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.TimeCommitment));
    }, [dispatch]),
  );
  const handleBackPress = () => {
    const routes = (navigation as any)?.getState?.()?.routes || [];
    const previousRouteName =
      routes.length > 1 ? routes[routes.length - 2]?.name : null;
    if (previousRouteName === AppRoutes.UnderstandYourself) {
      navigation.goBack();
      return;
    }
    navigation.navigate(AppRoutes.UnderstandYourself as never);
  };
  const options = [
    {
      id: '1',
      label: localization.appkeys?.option2Min,
    },
    {
      id: '2',
      label: localization.appkeys?.option5Min,
    },
    {
      id: '3',
      label: localization.appkeys?.option10MinPlus,
    },
    {
      id: '4',
      label: localization.appkeys?.optionWhenNeeded,
    },
  ];
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
            <HeaderProgress progress={0.8} onBackPress={handleBackPress} />

            <Image
              source={images.heartRope}
              style={styles.heartRope}
              resizeMode="stretch"
            />
            <View style={styles.mainContainer}>
              <SolidText style={styles.title}>
                {localization.appkeys?.timeCommitmentTitle}
              </SolidText>
              <SolidText style={styles.subtitle}>
                {localization.appkeys?.timeCommitmentSub}
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
                        triggerHaptic('impactMedium');
                        setSelected(option.label);
                        dispatch(
                          setOnboardingAnswer({
                            key: 'timeYouCommit',
                            value: option.label,
                          }),
                        );
                      }}
                      activeOpacity={0.7}
                    >
                      <SolidText
                        maxFontScale={1.2}
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
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
              disabled={!selected}
              onPress={() => {
                return navigation.navigate(AppRoutes.StartGoal as never);
              }}
            />
          </View>
        </View>
      }
    />
  );
};
export default TimeCommitment;
