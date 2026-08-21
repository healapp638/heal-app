import React, { useContext, useState, useEffect } from 'react';
import { View, TouchableOpacity, Linking, Platform, ActivityIndicator, NativeModules } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import SolidBtn from '../../../../components/SolidBtn';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import { useSelector, useDispatch } from 'react-redux';
import { setOnboardingAnswers } from '../../../../redux/Reducers/userData';

const CheckEmail = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme() as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { email, payload } = route.params || {};
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [timer, setTimer] = useState(30);
  const { mutate: resendMagicLink, isPending } = usePostApi();

  useEffect(() => {
    return () => {
      if (payload) {
        dispatch(setOnboardingAnswers(payload));
      }
    };
  }, [payload, dispatch]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOpenEmailApp = async () => {
    triggerHaptic('impactMedium');

    try {
      if (Platform.OS === 'android') {
        // Use native module to fire ACTION_MAIN + CATEGORY_APP_EMAIL intent
        // — the only reliable way to open inbox (not compose) on Android.
        await NativeModules.EmailInboxModule.openEmailInbox();
      } else {
        // iOS: try known inbox URL schemes in priority order
        const iosSchemes = [
          'message://',           // Apple Mail
          'googlegmail://',       // Gmail
          'ms-outlook://',        // Outlook
          'readdle-spark://',     // Spark
          'ymail://',             // Yahoo Mail
        ];
        for (const scheme of iosSchemes) {
          const supported = await Linking.canOpenURL(scheme);
          if (supported) {
            await Linking.openURL(scheme);
            return;
          }
        }
        AppUtils.showLog('No email app found on this device');
      }
    } catch (err) {
      AppUtils.showLog('Error opening email app:', err);
    }
  };

  const handleResend = () => {
    if (isPending) return;
    triggerHaptic('impactMedium');

    resendMagicLink(
      {
        endpoint: endpoints.sendMagicLink,
        data: payload || {
          email: email?.trim()?.toLowerCase(),
        },
      },
      {
        onSuccess: () => {
          setTimer(30);
          AppUtils.showToast('Magic link resent successfully');
        },
        onError: (error: any) => {
          AppUtils.showToast(error.message || 'Failed to resend magic link');
        },
      },
    );
  };

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.checkEmail || 'Check Email'}
            onBackPress={() => {
              triggerHaptic('impactMedium');
              navigation.goBack();
            }}
          />

          <View style={styles.content}>
            <SolidText style={styles.title}>
              {localization.appkeys?.weHaveSentEmail || 'We’ve sent you an email'}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.tapLinkSent || 'Tap the link sent to'} <SolidText style={styles.boldText}>{email}</SolidText>
              {'\n'}{localization.appkeys?.checkSpamJunk || 'Check spam or junk if you can’t find it.'}
            </SolidText>
          </View>

          <View style={styles.footerContainer}>
            <SolidBtn
              titleTxt={localization.appkeys?.openEmailApp || 'Open email app'}
              btnStyle={styles.submitBtn}
              txtStyle={styles.submitBtnText}
              onPress={handleOpenEmailApp}
            />

            {timer > 0 ? (
              <SolidText style={styles.timerText}>
                {localization.appkeys?.resendIn || 'Resend in'} 0:{timer < 10 ? '0' : ''}{timer}
              </SolidText>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isPending}>
                {isPending ? (
                  <ActivityIndicator color={colors.brown || '#3A2110'} size="small" />
                ) : (
                  <SolidText style={styles.resendLink}>
                    {localization.appkeys?.resendLink || 'Resend link'}
                  </SolidText>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
    />
  );
};

export default CheckEmail;
