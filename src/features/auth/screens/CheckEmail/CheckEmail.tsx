import React, { useContext, useState, useEffect } from 'react';
import { View, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { triggerHaptic } from '../../../../hooks/useHaptic';

const CheckEmail = () => {
  const { colors } = useTheme() as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { email } = route.params || {};
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [timer, setTimer] = useState(30);
  const { mutate: resendMagicLink, isPending } = usePostApi();

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
    const mailUrl = Platform.OS === 'ios' ? 'message://' : 'mailto:';
    try {
      const supported = await Linking.canOpenURL(mailUrl);
      if (supported) {
        await Linking.openURL(mailUrl);
      } else {
        await Linking.openURL('mailto:');
      }
    } catch (err) {
      console.log('Error opening mail app:', err);
      // Fallback: try opening standard mailto scheme
      Linking.openURL('mailto:').catch((e) => console.log('Mailto fallback failed:', e));
    }
  };

  const handleResend = () => {
    if (isPending) return;
    triggerHaptic('impactMedium');

    resendMagicLink(
      {
        endpoint: endpoints.forgot_password,
        data: {
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
      isScrollEnabled={false}
      containerStyle={{ backgroundColor: '#F7F4EB' }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title="Check Email"
            onBackPress={() => {
              triggerHaptic('impactMedium');
              navigation.goBack();
            }}
          />

          <View style={styles.content}>
            <SolidText style={styles.title}>
              We’ve sent you an email
            </SolidText>
            <SolidText style={styles.subtitle}>
              Tap the link sent <SolidText style={styles.boldText}>{email}</SolidText>
              {'\n'}Check spam or junk if you can’t find it.
            </SolidText>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleOpenEmailApp}
              activeOpacity={0.8}
            >
              <SolidText style={styles.submitBtnText}>
                Open email app
              </SolidText>
            </TouchableOpacity>

            {timer > 0 ? (
              <SolidText style={styles.timerText}>
                Resend in 0:{timer < 10 ? '0' : ''}{timer}
              </SolidText>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isPending}>
                {isPending ? (
                  <ActivityIndicator color={colors.brown || '#3A2110'} size="small" />
                ) : (
                  <SolidText style={styles.resendLink}>
                    Resend link
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
