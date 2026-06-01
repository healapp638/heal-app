import React, { useState, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
  TextInput,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidBtn from '../../../../components/SolidBtn';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import HomeHeader from '../../../../components/HomeHeader';
import SolidInput from '../../../../components/SolidInput';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import PremiumModal from '../../../../modals/PremiumModal';
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const HelpAndSupport = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const { mutate: contactUsApi, isPending } = usePostApi();

  const handleSendFeedback = () => {
    if (!name.trim()) {
      AppUtils.showToast(
        localization.appkeys?.enterName || 'Please enter your name',
      );
      return;
    }
    if (!email.trim()) {
      AppUtils.showToast(
        localization.appkeys?.enterEmail || 'Please enter your email',
      );
      return;
    }
    if (!AppUtils.validateEmail(email)) {
      AppUtils.showToast(
        localization.appkeys?.invalidEmail || 'Please enter a valid email',
      );
      return;
    }
    if (!feedback.trim()) {
      AppUtils.showToast(
        localization.appkeys?.enterFeedback || 'Please enter your feedback',
      );
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: feedback.trim(),
    };

    contactUsApi(
      {
        endpoint: endpoints.contact_us,
        data: payload,
      },
      {
        onSuccess: () => {
          AppUtils.showToast(
            localization.appkeys?.feedbackSent || 'Feedback sent successfully',
          );
          setName('');
          setEmail('');
          setFeedback('');
          navigation.goBack();
        },
        onError: error => {
          AppUtils.showToast(error.message || 'Failed to send feedback');
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
            title={localization.appkeys?.contactUs || 'Contact Us'}
            onBackPress={() => navigation.goBack()}
          />

          <HomeHeader
            viewStyle={{
              marginTop: -12,
              marginBottom: Platform.OS == 'ios' ? 18 : 16,
            }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={localization.appkeys?.contactUsTitle || 'Contact Us'}
            safeSpaceLabel={
              localization.appkeys?.faqSubtitle || 'We are here for you'
            }
            subStyle={{
              marginTop: 5,
            }}
          />

          <SolidInput
            label={localization.appkeys?.name || 'Name'}
            placeholder={localization.appkeys?.yourName || 'Your name'}
            value={name}
            onChangeText={setName}
            viewStyle={{
              borderColor: '#EAE0D5',
            }}
          />

          <SolidInput
            label={localization.appkeys?.email || 'Email'}
            placeholder={localization.appkeys?.yourEmail || 'your@email.com'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            viewStyle={{
              borderColor: '#EAE0D5',
            }}
          />

          <SolidText style={styles.inputLabel}>
            {localization.appkeys?.feedback || 'Feedback'}
          </SolidText>
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              placeholderTextColor="#999"
              placeholder={
                localization.appkeys?.howCanWeImprove || 'How can we improve?'
              }
              multiline
              value={feedback}
              onChangeText={setFeedback}
              maxFontSizeMultiplier={1.4}
              textAlignVertical="top"
            />
          </View>
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.sendFeedback || 'Send feedback'}
            btnStyle={[styles.sendFeedbackBtn]}
            onPress={() => {
              triggerHaptic('impactMedium');
              handleSendFeedback();
            }}
            isLoading={isPending}
            disabled={isPending}
          />
          <PremiumModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};
export default HelpAndSupport;
