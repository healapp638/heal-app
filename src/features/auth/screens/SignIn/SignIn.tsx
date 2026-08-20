import React, { useEffect, useState, useContext } from 'react';
import {
  BackHandler,
  Image,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import useBiometric from '../../../../hooks/useBiometric';
import SolidView from '../../../../components/SolidView';
import { useNavigation, useTheme } from '@react-navigation/native';
import HeaderCommon from '../../../../components/HeaderCommon';
import style from './style';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import localStore from '../../../../localStorage/asyncStore';
import { storeKeys } from '../../../../localStorage/storeKeys';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
  getUserDetail,
  setBiometric,
  setEmail as setReduxEmail,
  setPassword as setReduxPassword,
  setLastLoginType,
  setRememberMe as setReduxRememberMe,
} from '../../../../redux/Reducers/userData';
import useSocialLogin from '../../../../hooks/useSocialLogin';
import SuccessModal from '../../../../modals/SuccessModal';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { setSuperwallUserAttributes } from '../../../../utils/superwallService';

const SignIn = () => {
  const dispatch = useDispatch();
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate: loginUser, isPending } = usePostApi();
  const { googleLogin, appleLogin, isSocialPending } = useSocialLogin();
  const {
    handleBiometricAuth,
    biometric,
    email: bioEmail,
    password: bioPass,
    lastLoginType,
    isSupported,
  } = useBiometric();
  const reduxRememberMe = useSelector(
    (state: any) => state?.userData?.rememberMe,
  );

  const onBiometricSuccess = () => {
    dispatch(setBiometric(true));
    if (bioEmail && bioPass) {
      handleLogin(bioEmail, bioPass);
    } else {
      onEnableBiometricSuccess();
    }
  };

  const onEnableBiometricSuccess = () => {
    dispatch(setBiometric(true));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: AppRoutes.NonAuthStack,
          params: {
            screen: AppRoutes.Offer,
          },
        } as never,
      ],
    });
  };

  const handleLogin = (ema?: string, pass?: string) => {
    let finalEmail = ema || email;
    let finalPass = pass || password;

    if (!finalEmail) {
      AppUtils.showToast(
        localization.appkeys?.enterEmail || 'Please enter email',
      );
      return;
    }
    if (!AppUtils.validateEmail(finalEmail)) {
      AppUtils.showToast(
        localization.appkeys?.toastInvalidEmail ||
          'Please enter a valid email address.',
      );
      return;
    }
    if (!finalPass) {
      AppUtils.showToast(
        localization.appkeys?.toastEnterPassword || 'Please enter password',
      );
      return;
    }

    loginUser(
      {
        endpoint: endpoints.login,
        data: {
          email: finalEmail?.trim()?.toLowerCase(),
          password: finalPass,
          language: AppUtils.getLanguageCode(appLanguage),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      {
        onSuccess: async (response: any) => {
          // console.log('response', response?.data?.is_after_social_login);

          if (response?.data?.is_after_social_login) {
            navigation.navigate(
              AppRoutes.Verification as never,
              {
                email: finalEmail?.trim()?.toLowerCase(),
                password: finalPass,
                from: 'SignIn',
              } as never,
            );
          } else {
            dispatch(setUser(response?.data));
            dispatch(setToken(response?.data?.access_token));
            dispatch(setRefreshToken(response?.data?.refresh_token));
            dispatch(setAuth(true));
            dispatch(getUserDetail() as any);
            dispatch(setReduxEmail(finalEmail));
            dispatch(setReduxPassword(finalPass));
            if (response?.data?.is_biometric) {
              dispatch(setBiometric(true));
            }
            dispatch(setLastLoginType('manual'));
            dispatch(setReduxRememberMe(rememberMe));

            const rawData = response?.data?.data || response?.data?.user || response?.data;
            const userObj = rawData?.user || rawData;
            const isOnboardingDone =
              rawData?.is_onboarding === 1 ||
              rawData?.is_onboarding === true ||
              rawData?.is_onboarding === '1' ||
              rawData?.is_onboarding === 'true' ||
              userObj?.is_onboarding === 1 ||
              userObj?.is_onboarding === true ||
              userObj?.is_onboarding === '1' ||
              userObj?.is_onboarding === 'true';

            console.log('📱 [SIGN IN DEBUG] Email Login Success!');
            console.log('   - isOnboardingDone:', isOnboardingDone);

            const navigateToNextScreen = () => {
              if (!isOnboardingDone) {
                console.log('🔑 [SIGN IN DEBUG] Onboarding not done. Setting setSuperwallUserAttributes({ has_signed_up: true })...');
                setSuperwallUserAttributes({ has_signed_up: true });
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: AppRoutes.AuthStack,
                      params: { screen: AppRoutes.Welcome },
                    } as never,
                  ],
                });
              } else if (response?.data?.user_subscription?.is_subscribed == 1) {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: AppRoutes.NonAuthStack,
                      params: { screen: AppRoutes.BottomTab },
                    } as never,
                  ],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: AppRoutes.NonAuthStack,
                      params: {
                        screen: AppRoutes.Offer,
                      },
                    } as never,
                  ],
                });
              }
            };

            const isBioEnabled = !!response?.data?.is_biometric || !!biometric;

            if (!isBioEnabled) {
              Alert.alert(
                localization?.appkeys?.enableBiometric || 'Enable Biometric',
                localization?.appkeys?.wouldYouLike ||
                  'Would you like to enable biometric login for next time?',
                [
                  {
                    text: localization?.appkeys?.skip || 'Skip',
                    onPress: () => {
                      navigateToNextScreen();
                    },
                    style: 'cancel',
                  },
                  {
                    text: localization?.appkeys?.yes || 'Yes',
                    onPress: () => {
                      handleBiometricAuth(() => {
                        dispatch(setBiometric(true));
                        navigateToNextScreen();
                      });
                    },
                  },
                ],
              );
            } else {
              navigateToNextScreen();
            }
          }
        },
        onError: (error: any) => {
          AppUtils.showToast(error.message || 'Login failed');
        },
      },
    );
  };
  useEffect(() => {
    checkRememberMe();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: AppRoutes.AccessScreen as never,
            },
          ],
        });
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  const checkRememberMe = async () => {
    setRememberMe(reduxRememberMe);
    if (reduxRememberMe) {
      setEmail(bioEmail);
      setPassword(bioPass);
    }
  };
  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.login}
            onBackPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.AccessScreen as never,
                  },
                ],
              });
            }}
          />

          <View
            style={{
              flex: 1,
            }}
          >
            <SolidText style={styles.welcomeTitle}>
              {localization.appkeys?.welcomeBack}
            </SolidText>
            <SolidText style={styles.welcomeSubtitle}>
              {localization.appkeys?.gladToSeeYou}
            </SolidText>

            {/* Email Field */}
            <SolidInput
              label={localization.appkeys?.email}
              placeholder={localization.appkeys?.enterEmail}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              rightImg={images.mail}
              rightImgTintColor={colors.primary}
            />

            {/* Password Field */}
            <SolidInput
              label={localization.appkeys?.password}
              placeholder={localization.appkeys?.enterPassword}
              value={password}
              onChangeText={setPassword}
              isSecure={!isPasswordVisible}
              rightImg={isPasswordVisible ? images.eyeOpen : images.eyeClose}
              onRightPress={() => setIsPasswordVisible(!isPasswordVisible)}
              rightImgTintColor={colors.primary}
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  return setRememberMe(!rememberMe);
                }}
                activeOpacity={0.8}
              >
                <Image
                  source={rememberMe ? images.tickbox : images.uncheck}
                  style={styles.checkboxImage}
                  resizeMode="contain"
                />
                <SolidText style={styles.rememberMeText}>
                  {localization.appkeys?.rememberMe}
                </SolidText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  return navigation.navigate(AppRoutes.ForgotPassword as never);
                }}
              >
                <SolidText style={styles.forgotPasswordText}>
                  {localization.appkeys?.forgotPassword}
                </SolidText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
              }}
            >
              <View style={styles.loginRow}>
                <SolidBtn
                  titleTxt={localization.appkeys?.logInBtn}
                  btnStyle={[styles.loginBtn, biometric ? { flex: 1 } : {}]}
                  onPress={() => {
                    return handleLogin();
                  }}
                  isLoading={isPending}
                  disabled={isPending}
                />

                {isSupported && !!biometric && (
                  <TouchableOpacity
                    style={styles.bioContainer}
                    onPress={() => handleBiometricAuth(onBiometricSuccess)}
                  >
                    <Image
                      source={
                        Platform.OS === 'ios' ? images.iosBio : images.andBio
                      }
                      style={styles.bioIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <SolidText style={styles.dividerText}>
                  {localization.appkeys?.orContinueWith}
                </SolidText>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={(...args: any) => {
                    return (googleLogin as any)(...args);
                  }}
                  disabled={isSocialPending}
                >
                  <Image
                    source={images.google2}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <SolidText style={styles.socialBtnTxt}>
                    {localization.appkeys?.google}
                  </SolidText>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={(...args: any) => {
                      triggerHaptic('impactHeavy');
                      return (appleLogin as any)(...args);
                    }}
                    disabled={isSocialPending}
                  >
                    <Image
                      source={images.apple}
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                    <SolidText style={styles.socialBtnTxt}>
                      {localization.appkeys?.apple}
                    </SolidText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
            }}
          />

          {/* Footer */}
          <TouchableOpacity
            onPress={() => {
              return navigation.navigate(AppRoutes.SignUp as never);
            }}
            style={styles.footer}
          >
            <SolidText style={styles.footerText}>
              {localization.appkeys?.dontHaveAccount}
            </SolidText>

            <SolidText style={styles.signUpText}>
              {localization.appkeys?.signUp}
            </SolidText>
          </TouchableOpacity>
        </View>
      }
    />
  );
};
export default SignIn;
