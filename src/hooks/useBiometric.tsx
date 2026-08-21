import React, { useEffect, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setBiometric, getUserDetail } from '../redux/Reducers/userData';
import AppRoutes from '../routes/RouteKeys/appRoutes';
import { Alert } from 'react-native';
import AppUtils from '../utils/appUtils';

const useBiometric = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const biometric = useSelector((state: any) => state.userData?.biometric);
  const email = useSelector((state: any) => state.userData?.email);
  const password = useSelector((state: any) => state.userData?.password);

  const handleBiometricAuth = async (onSuccess?: () => void) => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      return;
    }
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage:
          biometryType === 'FaceID'
            ? 'Verify Face'
            : 'Scan fingerprint to login',
      });

      if (success) {
        if (onSuccess) {
          onSuccess();
        } else {
          dispatch(setBiometric(true));
          // If we have credentials, we could auto-login here if needed
          // but for now let's just navigate to the main app if already logged in
          // or stay on screen if it's just enabling.
        }
      }
    } catch (e: any) {
      AppUtils.showLog('Biometric auth error:', e);
    }
  };

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
    rnBiometrics.isSensorAvailable().then(({ available }) => {
      setIsSupported(available);
    });
  }, []);

  const lastLoginType = useSelector((state: any) => state.userData?.lastLoginType);
  const socialEmail = useSelector((state: any) => state.userData?.socialEmail);

  return { handleBiometricAuth, biometric, email, password, lastLoginType, socialEmail, isSupported };
};

export default useBiometric;
