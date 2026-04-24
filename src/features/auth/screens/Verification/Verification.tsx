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

const Verification = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const from = route.params?.from;

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
      setTimer(60);
      setCanResend(false);
      // Logic to resend OTP
    }
  };

  const handleVerify = () => {
    if (from === 'ForgotPassword') {
      navigation.navigate(AppRoutes.ResetPassword as never);
    } else {
      // Simulate successful verification for SignUp
      setSuccessVisible(true);
    }
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
            label={localization.appkeys?.email}
            placeholder="666 ---"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            rightImg={images.mail}
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
              <TouchableOpacity onPress={handleResend}>
                <SolidText style={styles.resendText}>
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
