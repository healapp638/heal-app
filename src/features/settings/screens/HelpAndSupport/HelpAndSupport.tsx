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

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.contactUs || 'Contact Us'}
            onBackPress={() => navigation.goBack()}
            rightIcon={images.crown}
            onRightPress={() => {
              setShowCreditsModal(true);
            }}
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
            subStyle={{ marginTop: 5 }}
          />



          <View style={{ marginTop: 10 }}>
            <SolidText style={[styles.feedbackTitle, { fontSize: 20 }]}>
              {localization.appkeys?.getInTouch || 'Get in touch'}
            </SolidText>
            <SolidText style={[styles.feedbackSubtitle, { marginBottom: 20 }]}>
              {localization.appkeys?.contactUsDesc ||
                'Have a question or feedback? We would love to hear from you and help you with anything you need.'}
            </SolidText>

            <SolidInput
              label={localization.appkeys?.subject || 'Subject'}
              placeholder={localization.appkeys?.enterSubject || 'Enter subject...'}
              value={subject}
              onChangeText={setSubject}
              viewStyle={{ borderColor: '#EAE0D5' }}
            />

            <SolidText style={styles.inputLabel}>
              {localization.appkeys?.message || 'Message'}
            </SolidText>
            <View style={styles.messageContainer}>
              <TextInput
                style={styles.messageInput}
                placeholderTextColor="#999"
                placeholder={localization.appkeys?.enterMessage || 'Type your message here...'}
                multiline
                value={message}
                onChangeText={setMessage}
                maxFontSizeMultiplier={1.4}
              />
            </View>

            <SolidBtn
              titleTxt={localization.appkeys?.sendMessage || 'Send message'}
              btnStyle={[styles.sendFeedbackBtn, { marginTop: 10, width: '100%' }]}
              onPress={() => {
                // Handle form submission
                setSubject('');
                setMessage('');
              }}
            />
          </View>
          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default HelpAndSupport;
