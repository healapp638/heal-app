import React, { useContext, useEffect } from 'react';
import { Image, TouchableOpacity, View, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';
import useSocialLogin from '../../../../hooks/useSocialLogin';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import useBiometric from '../../../../hooks/useBiometric';
import {
  setAuth,
  setBiometric,
  setRefreshToken,
  setToken,
  setUser,
  getUserDetail,
} from '../../../../redux/Reducers/userData';
import { useDispatch, useSelector } from 'react-redux';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
const AccessScreen = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const onboardingAnswers = useSelector(
    (state: any) => state.userData?.onboarding?.answers,
  );

  useEffect(() => {
    console.log('📱 [Native AccessScreen Mounted] Current Redux Onboarding Answers:');
    console.log(JSON.stringify(onboardingAnswers || {}, null, 2));
  }, [onboardingAnswers]);

  const { googleLogin, appleLogin, isSocialPending } = useSocialLogin();

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View style={styles.mainContainer}>
          {/* <HeaderCommon title="Welcome!" /> */}

          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />

            <SolidText style={styles.title}>
              {localization.appkeys?.welcomeHeader}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSubtitle}
            </SolidText>

            <View style={styles.socialButtonsContainer}>
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={(...args: any) => {
                    triggerHaptic('impactMedium');
                    return (appleLogin as any)(...args);
                  }}
                  disabled={isSocialPending}
                >
                  <Image
                    source={images.apple}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <SolidText maxFontScale={1} style={styles.socialBtnTxt}>
                    {localization.appkeys?.continueWithApple}
                  </SolidText>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={(...args: any) => {
                  triggerHaptic('impactMedium');
                  return (googleLogin as any)(...args);
                }}
                disabled={isSocialPending}
              >
                <Image
                  source={images.google2}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <SolidText maxFontScale={1} style={styles.socialBtnTxt}>
                  {localization.appkeys?.continueWithGoogle}
                </SolidText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  navigation.navigate(AppRoutes.EmailSignIn as never);
                }}
              >
                <Image
                  source={images.mail}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <SolidText maxFontScale={1} style={styles.socialBtnTxt}>
                  {localization.appkeys?.continueWithEmail}
                </SolidText>
              </TouchableOpacity>
              {/* {!!biometric && (
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    handleBiometricAuth(onBiometricSuccess);
                  }}
                >
                  <Image
                    source={
                      Platform.OS === 'ios' ? images.iosBio : images.andBio
                    }
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <SolidText maxFontScale={1} style={styles.socialBtnTxt}>
                    {localization.appkeys?.biometricAuth || 'Biometric'}
                  </SolidText>
                </TouchableOpacity>
              )} */}
            </View>

            <View
              style={{
                flex: 1,
              }}
            />
            {/* 
            <View style={styles.bottomButtonsContainer}>
              <SolidBtn
                titleTxt={localization.appkeys?.logInBtn}
                btnStyle={styles.loginBtn}
                onPress={() => {
                  navigation.navigate(AppRoutes.SignIn as never);
                }}
              />
              <SolidBtn
                titleTxt={localization.appkeys?.createAccountBtn}
                btnStyle={styles.createAccountBtn}
                onPress={() => {
                  return navigation.navigate(AppRoutes.SignUp as never);
                }}
              />
            </View> */}

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => {
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
export default AccessScreen;
