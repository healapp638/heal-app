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

const ResetPassword = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleConfirm = () => {
    // Simulate password reset logic
    setSuccessVisible(true);
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
          />

          <SuccessModal
            visible={successVisible}
            onClose={() => setSuccessVisible(false)}
            title={localization.appkeys?.passChangedSuccess}
            subtitle={localization.appkeys?.passChangedSubtitle}
            btnLabel={localization.appkeys?.logInBtn}
            onPressBtn={navigateToLogin}
          />
        </View>
      }
    />
  );
};

export default ResetPassword;
