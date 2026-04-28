import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import SuccessModal from '../../../../modals/SuccessModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { useDispatch } from 'react-redux';
import {
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
} from '../../../../redux/Reducers/userData';

const Verification = () => {
  const dispatch = useDispatch();
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const { email, password, from } = route.params || {};

  const styles = style(colors);

  const { mutate: verifyMutate, isPending: isVerifying } = usePostApi();
  const { mutate: resendMutate, isPending: isResending } = usePostApi();

  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (canResend) {
      resendMutate(
        {
          endpoint: endpoints.resendOtp,
          data: { email: email?.trim()?.toLowerCase() },
        },
        {
          onSuccess: () => {
            setTimer(60);
            setCanResend(false);
            AppUtils.showToast(
              localization.appkeys?.otpSentSuccess || 'OTP Sent Successfully',
            );
          },
          onError: (error: any) => {
            AppUtils.showToast(error.message || 'Failed to resend OTP');
          },
        },
      );
    }
  };

  const handleVerify = () => {
    if (otpCode.length < 6) {
      AppUtils.showToast(
        localization.appkeys?.enterValidOtp || 'Please enter a valid OTP',
      );
      return;
    }
    verifyMutate(
      {
        endpoint: endpoints.verifyOtp,
        data: {
          email: email?.trim()?.toLowerCase(),
          ...(from !== 'ForgotPassword' &&
            from !== 'SocialLogin' && { password }),
          otp: String(otpCode),
        },
      },
      {
        onSuccess: (response: any) => {
          if (from === 'ForgotPassword') {
            navigation.navigate(
              AppRoutes.ResetPassword as never,
              {
                email: email?.trim()?.toLowerCase(),
                otp: String(otpCode),
              } as never,
            );
          } else if (
            from === 'SignIn' ||
            from === 'SocialLogin' ||
            from === 'SignUp'
          ) {
            dispatch(setUser(response?.data));
            dispatch(setToken(response?.data?.access_token));
            dispatch(setRefreshToken(response?.data?.refresh_token));
            dispatch(setAuth(true));

            if (response?.data?.is_profile_completed === false) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.CompleteProfile,
                    params: { userData: response?.data },
                  } as never,
                ],
              });
            } else {
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
          } else {
            setSuccessVisible(true);
          }
        },
        onError: (error: any) => {
          console.log('erro', error);
          AppUtils.showToast(error.message || 'OTP Verification Failed');
        },
      },
    );
  };

  const navigateToSignIn = () => {
    setSuccessVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoutes.SignIn as never }],
    });
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.verificationHeader} />

          <SolidText style={styles.welcomeTitle}>
            {localization.appkeys?.verificationHeader}
          </SolidText>
          <SolidText style={styles.welcomeSubtitle}>
            {localization.appkeys?.verificationCodeSent}
          </SolidText>

          <SolidInput
            label={localization.appkeys?.verificationCode}
            placeholder="666 ---"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            // rightImg={images.mail}
            rightImgTintColor={colors.primary}
          />

          <View style={styles.timerRow}>
            <SolidText style={styles.timerText}>
              {localization.appkeys?.didNotReceiveCode}
            </SolidText>
            {timer > 0 ? (
              <SolidText style={[styles.resendText]}>
                {timer} {localization.appkeys?.sec}
              </SolidText>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <SolidText
                  style={[styles.resendText, isResending && { opacity: 0.5 }]}
                >
                  {localization.appkeys?.resendCode}
                </SolidText>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.verifyAndContinue}
            btnStyle={styles.verifyBtn}
            onPress={handleVerify}
            isLoading={isVerifying}
            disabled={isVerifying}
          />

          <SuccessModal
            visible={successVisible}
            onClose={() => setSuccessVisible(false)}
            title={localization.appkeys?.accountCreatedSuccess}
            subtitle={localization.appkeys?.confirmationEmailSent}
            btnLabel={localization.appkeys?.logInBtn}
            onPressBtn={navigateToSignIn}
            btnStyle={{ marginTop: -6 }}
          />
        </View>
      }
    />
  );
};

export default Verification;
