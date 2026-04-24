import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import SuccessModal from '../../../../modals/SuccessModal';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const ChangePassword = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [oldVisible, setOldVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleConfirm = () => {
    setSuccessVisible(true);
  };

  const navigateToSettings = () => {
    setSuccessVisible(false);
    navigation.goBack();
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.changePassword || 'Change password'}
            onBackPress={() => navigation.goBack()}
          />

          <SolidInput
            mainStyle={{ marginTop: -10 }}
            label={localization.appkeys?.oldPassword || 'Old Password'}
            placeholder="********"
            value={oldPassword}
            onChangeText={setOldPassword}
            isSecure={!oldVisible}
            rightImg={oldVisible ? images.eyeOpen : images.eyeClose}
            onRightPress={() => setOldVisible(!oldVisible)}
            rightImgTintColor={colors.primary}
          />

          <SolidInput
            label={localization.appkeys?.newPassword || 'New Password'}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            isSecure={!passwordVisible}
            rightImg={passwordVisible ? images.eyeOpen : images.eyeClose}
            onRightPress={() => setPasswordVisible(!passwordVisible)}
            rightImgTintColor={colors.primary}
          />

          <SolidInput
            label={localization.appkeys?.confirmPassword || 'Confirm Password'}
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
            titleTxt={localization.appkeys?.confirm || 'Confirm'}
            btnStyle={styles.confirmBtn}
            onPress={handleConfirm}
          />

          <SuccessModal
            btnStyle={{ marginTop: -10 }}
            visible={successVisible}
            onClose={() => setSuccessVisible(false)}
            title={
              localization.appkeys?.passChangedSuccess ||
              'Password Changed Successfully!'
            }
            subtitle={
              localization.appkeys?.passChangedSubtitleSettings ||
              'You can use your New Password to login to your account.'
            }
            btnLabel={localization.appkeys?.login || 'Ok'}
            onPressBtn={navigateToSettings}
          />
        </View>
      }
    />
  );
};

export default ChangePassword;
