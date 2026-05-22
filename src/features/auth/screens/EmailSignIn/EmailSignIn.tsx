import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidInput from '../../../../components/SolidInput';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { triggerHaptic } from '../../../../hooks/useHaptic';

import { useSelector } from 'react-redux';

const EmailSignIn = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [email, setEmail] = useState('');
  const { mutate: sendMagicLink, isPending } = usePostApi();

  const answers = useSelector(
    (state: any) => state?.userData?.onboarding?.answers,
  );
  const appLanguage = useSelector(
    (state: any) => state?.userData?.appLanguage,
  );

  const handleSendLink = () => {
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

    triggerHaptic('impactMedium');

    const payload = {
      language: AppUtils.getLanguageCode(appLanguage) || 'en',
      email: email?.trim()?.toLowerCase(),
      fullName: answers?.fullName || '',
      goalStartWith: answers?.goalStartWith || '',
      timeYouCommit: answers?.timeYouCommit || '',
      stopFeelBetter: answers?.stopFeelBetter || '',
      helpFeelBetter: answers?.helpFeelBetter || '',
      likeToFellMore: answers?.likeToFellMore || '',
      feelThatWay: answers?.feelThatWay || '',
      howFellingLately: answers?.howFellingLately || '',
      hearAboutUs: answers?.hearAboutUs || '',
    };
    console.log(payload)
    sendMagicLink(
      {
        endpoint: endpoints.sendMagicLink,
        data: payload,
      },
      {
        onSuccess: () => {
          navigation.navigate(
            AppRoutes.CheckEmail as never,
            {
              email: email?.trim()?.toLowerCase(),
            } as never,
          );
        },
        onError: (error: any) => {
          AppUtils.showToast(error.message || 'Failed to send magic link');
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
            title="Email"
            onBackPress={() => {
              triggerHaptic('impactMedium');
              navigation.goBack();
            }}
          />

          <View style={styles.content}>
            <SolidText style={styles.title}>
              What’s your email?
            </SolidText>
            <SolidText style={styles.subtitle}>
              We’ll email you a link to sign in.
            </SolidText>

            <SolidInput
              label="Email"
              placeholder="Johnsmith911@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              rightImg={images.mail}
              rightImgTintColor="#FF8383" // Coral pink tint matching mockup
              autoCapitalize="none"
              labelRow={false} // Ensure custom label is styled
              viewStyle={styles.inputContainer}
              textInputStyle={styles.textInput}
            />
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[styles.submitBtn, isPending && { opacity: 0.7 }]}
              onPress={handleSendLink}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <SolidText style={styles.submitBtnText}>
                  Email me a magic link
                </SolidText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

export default EmailSignIn;
