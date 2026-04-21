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

const SignIn = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
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
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: AppRoutes.NonAuthStack,
                        params: { screen: AppRoutes.Offer },
                      } as never,
                    ],
                  });
                }}
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
                <TouchableOpacity style={styles.socialBtn} onPress={() => {}}>
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
