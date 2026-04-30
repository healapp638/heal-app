import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import SuccessModal from '../../../../modals/SuccessModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useRoute } from '@react-navigation/native';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { isPasswordValid } from '../../utils/SignUp/signUpValidation';

const ResetPassword = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const route = useRoute() as any;
  const { email, otp } = route.params || {};
  const { mutate: resetPassword, isPending } = usePostApi();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleConfirm = () => {
    if (!password) {
      AppUtils.showToast(
        localization.appkeys?.toastEnterPassword ||
          'Please enter your password.',
      );
      return;
    }

    if (!isPasswordValid(password)) {
      AppUtils.showToast(
        localization.appkeys?.toastPasswordRequirementsDetailed ||
          'Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.',
        4500,
      );
      return;
    }

    if (!confirmPassword) {
      AppUtils.showToast(
        localization.appkeys?.toastEnterConfirmPassword ||
          'Please confirm your password.',
      );
      return;
    }

    if (password !== confirmPassword) {
      AppUtils.showToast(
        localization.appkeys?.toastPasswordMismatch ||
          'Passwords do not match.',
      );
      return;
    }
    resetPassword(
      {
        endpoint: endpoints.reset_password,
        data: {
          email: email?.trim()?.toLowerCase(),
          otp: String(otp),
          new_password: password,
        },
      },
      {
        onSuccess: () => {
          setSuccessVisible(true);
        },
        onError: (error: any) => {
          AppUtils.showToast(error.message || 'Failed to reset password');
        },
      },
    );
  };

  const navigateToLogin = () => {
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
          <HeaderCommon
            title={localization.appkeys?.newPassHeader}
            onBackPress={() => navigation.goBack()}
          />

          <SolidText style={styles.welcomeTitle}>
            {localization.appkeys?.newPassHeader}
          </SolidText>
          <SolidText style={styles.welcomeSubtitle}>
            {localization.appkeys?.newPassSubtitle}
          </SolidText>

          <SolidInput
            label={localization.appkeys?.password}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            isSecure={!passwordVisible}
            rightImg={passwordVisible ? images.eyeOpen : images.eyeClose}
            onRightPress={() => setPasswordVisible(!passwordVisible)}
            rightImgTintColor={colors.primary}
          />

          <SolidInput
            label={localization.appkeys?.confirmPassword}
            placeholder="********"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isSecure={!confirmVisible}
            rightImg={confirmVisible ? images.eyeOpen : images.eyeClose}
            onRightPress={() => setConfirmVisible(!confirmVisible)}
            rightImgTintColor={colors.primary}
          />
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.confirm}
            btnStyle={styles.confirmBtn}
            onPress={handleConfirm}
            isLoading={isPending}
            disabled={isPending}
          />

          <SuccessModal
            visible={successVisible}
            onClose={() => setSuccessVisible(false)}
            title={localization.appkeys?.passCahangeSucess}
            subtitle={localization.appkeys?.passChangedSubtitle}
            btnLabel={localization.appkeys?.logInBtn}
            onPressBtn={navigateToLogin}
            btnStyle={{ marginTop: -4 }}
          />
        </View>
      }
    />
  );
};

export default ResetPassword;
