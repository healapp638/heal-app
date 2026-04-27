import React, { useEffect, useState, useContext } from 'react';
import { BackHandler, Image, TouchableOpacity, View } from 'react-native';
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
import { useDispatch } from 'react-redux';
import {
  setAuth,
  setToken,
  setUser,
} from '../../../../redux/Reducers/userData';
import useSocialLogin from '../../../../hooks/useSocialLogin';

const SignIn = () => {
  const dispatch = useDispatch();
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutate: loginUser, isPending } = usePostApi();
  const { googleLogin, isSocialPending } = useSocialLogin();

  const handleLogin = () => {
    if (!email) {
      AppUtils.showToast(
        localization.appkeys?.enterEmail || 'Please enter email',
      );
      return;
    }
    if (!AppUtils.validateEmail(email)) {
      AppUtils.showToast(
        localization.appkeys?.toastInvalidEmail ||
          'Please enter a valid email address.',
      );
      return;
    }
    if (!password) {
      AppUtils.showToast(
        localization.appkeys?.toastEnterPassword || 'Please enter password',
      );
      return;
    }

    loginUser(
      {
        endpoint: endpoints.login,
        data: {
          email: email?.trim()?.toLowerCase(),
          password: password,
        },
      },
      {
        onSuccess: async (response: any) => {
          // console.log('response', response?.data?.is_after_social_login);

          if (response?.data?.is_after_social_login) {
            navigation.navigate(
              AppRoutes.Verification as never,
              {
                email: email?.trim()?.toLowerCase(),
                password: password,
                from: 'SignIn',
              } as never,
            );
          } else {
            dispatch(setUser(response?.data));
            dispatch(setToken(response?.data?.access_token));
            dispatch(setAuth(true));
            if (rememberMe) {
              await localStore.storeData(storeKeys.rememberMe, {
                email,
                password,
                rememberMe: true,
              });
            } else {
              await localStore.removeData(storeKeys.rememberMe);
            }
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: AppRoutes.NonAuthStack,
                  params: { screen: AppRoutes.Offer },
                } as never,
              ],
            });
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
          routes: [{ name: AppRoutes.AccessScreen as never }],
        });
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const checkRememberMe = async () => {
    const res = await localStore.getData(storeKeys.rememberMe);
    if (res?.status && res?.value) {
      setEmail(res.value.email);
      setPassword(res.value.password);
      setRememberMe(res.value.rememberMe);
    }
  };
  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.login}
            onBackPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: AppRoutes.AccessScreen as never }],
              });
            }}
          />

          <View style={{ flex: 1 }}>
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
                onPress={() => setRememberMe(!rememberMe)}
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
                onPress={() =>
                  navigation.navigate(AppRoutes.ForgotPassword as never)
                }
              >
                <SolidText style={styles.forgotPasswordText}>
                  {localization.appkeys?.forgotPassword}
                </SolidText>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <SolidBtn
                titleTxt={localization.appkeys?.logInBtn}
                btnStyle={styles.loginBtn}
                onPress={handleLogin}
                isLoading={isPending}
                disabled={isPending}
              />

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
                  onPress={googleLogin}
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

                <TouchableOpacity style={styles.socialBtn} onPress={() => {}}>
                  <Image
                    source={images.apple}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <SolidText style={styles.socialBtnTxt}>
                    {localization.appkeys?.apple}
                  </SolidText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />

          {/* Footer */}
          <TouchableOpacity
            onPress={() => navigation.navigate(AppRoutes.SignUp as never)}
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
