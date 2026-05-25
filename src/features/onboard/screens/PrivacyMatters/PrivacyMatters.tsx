import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
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
import HeaderCommon from '../../../../components/HeaderCommon';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const PrivacyMatters = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const savedAccepted = useSelector(
    (state: any) =>
      state.userData?.onboarding?.answers?.privacyAccepted ?? false,
  );
  const [accepted, setAccepted] = useState(savedAccepted);
  useEffect(() => {
    setAccepted(savedAccepted);
  }, [savedAccepted]);
  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.PrivacyMatters));
    }, [dispatch]),
  );
  const renderClickableTerms = () => {
    const text = localization.appkeys?.privacyAcceptTerms || '';
    const parts = text.split(/(\{terms\}|\{privacy\})/g);
    return parts.map((part: string, index: number) => {
      if (part === '{terms}') {
        return (
          <SolidText
            key={`terms-${index}`}
            onPress={() => {
              triggerHaptic('impactMedium');
              return navigation.navigate(AppRoutes.Terms as never);
            }}
            style={{
              ...styles.checkboxText,
              textDecorationLine: 'underline',
            }}
          >
            {localization.appkeys?.termsOfService}
          </SolidText>
        );
      }
      if (part === '{privacy}') {
        return (
          <SolidText
            key={`privacy-${index}`}
            onPress={() => {
              triggerHaptic('impactMedium');
              return navigation.navigate(AppRoutes.PrivacyPolicy as never);
            }}
            style={{
              ...styles.checkboxText,
              textDecorationLine: 'underline',
            }}
          >
            {localization.appkeys?.privacyPolicy}
          </SolidText>
        );
      }
      return part;
    });
  };
  const privacyItems = [
    {
      id: '1',
      icon: images.must,
      text: localization.appkeys?.privacyItem1,
      bg: '#E2EBD3', // Light green
    },
    {
      id: '2',
      icon: images.lock,
      text: localization.appkeys?.privacyItem2,
      bg: '#FCE7E7', // Light pink
    },
    {
      id: '3',
      icon: images.private,
      text: localization.appkeys?.privacyItem3,
      bg: '#E1F0FF', // Light blue
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
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: -50,
            }}
          >
            <HeaderCommon title={''} />
          </View>

          <Image
            source={images.door}
            style={styles.doorImage}
            resizeMode="contain"
          />

          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.privacyTitle}
            </SolidText>

            {privacyItems.map(item => (
              <View key={item.id} style={styles.privacyCard}>
                <Image
                  source={item.icon}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />

                <Text maxFontSizeMultiplier={1} style={styles.cardText}>
                  {item.text}
                </Text>
              </View>
            ))}

            <View style={styles.checkboxContainer}>
              <Pressable
                onPress={() => {
                  triggerHaptic('impactMedium');

                  const nextAccepted = !accepted;
                  setAccepted(nextAccepted);
                  dispatch(
                    setOnboardingAnswer({
                      key: 'privacyAccepted',
                      value: nextAccepted,
                    }),
                  );
                }}
              >
                <Image
                  source={accepted ? images.tickbox : images.uncheck}
                  style={styles.checkboxImage}
                  resizeMode="contain"
                />
              </Pressable>
              <SolidText style={styles.checkboxText}>
                {renderClickableTerms()}
              </SolidText>
            </View>

            <View
              style={{
                flex: 1,
              }}
            />

            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              disabled={!accepted}
              onPress={() => {
                return navigation.navigate(AppRoutes.Warning as never);
              }}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('impactMedium');

                  return navigation.navigate(AppRoutes.PrivacyPolicy as never);
                }}
              >
                <SolidText maxFontScale={1} style={styles.footerText}>
                  {localization.appkeys?.privacyPolicy}
                </SolidText>
              </TouchableOpacity>
              <View style={styles.dot} />
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic('impactMedium');

                  return navigation.navigate(AppRoutes.Terms as never);
                }}
              >
                <SolidText maxFontScale={1} style={styles.footerText}>
                  {localization.appkeys?.termsOfService}
                </SolidText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
};
export default PrivacyMatters;
