import React, { useState, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
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

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    {
      question:
        localization.appkeys?.faqQ1 || 'How does progress tracking work?',
      answer:
        localization.appkeys?.faqA1 ||
        'Your evolution is tracked automatically through your activities: journal writing, completed challenges, and finished healing modules. You can see your progress in the "Evolution" section.',
    },
    {
      question: localization.appkeys?.faqQ2 || 'Are my data secure?',
      answer: localization.appkeys?.faqA2 || 'Yes, your data is secure.',
    },
    {
      question:
        localization.appkeys?.faqQ3 || 'How to use Mel, the virtual assistant?',
      answer:
        localization.appkeys?.faqA3 ||
        'You can chat with Mel anytime by pressing the AI button.',
    },
    {
      question:
        localization.appkeys?.faqQ4 || 'What to do if I feel distressed?',
      answer:
        localization.appkeys?.faqA4 ||
        'Please navigate to emergency resources in Settings or contact a professional.',
    },
    {
      question:
        localization.appkeys?.faqQ5 || 'How to cancel my Premium subscription?',
      answer:
        localization.appkeys?.faqA5 ||
        'You can manage your subscription from the settings page under Subscription.',
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.faqsHeader || "FAQ's"}
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
            userName={
              localization.appkeys?.faqTitle || 'Frequently asked questions'
            }
            safeSpaceLabel={
              localization.appkeys?.faqSubtitle || 'We are here for you'
            }
            subStyle={{ marginTop: 5 }}
          />

          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={0.8}
                onPress={() => toggleAccordion(index)}
                style={styles.accordionCard}
              >
                <View style={styles.accordionHeader}>
                  <SolidText style={styles.accordionTitle}>
                    {faq.question}
                  </SolidText>
                  <Image
                    source={isExpanded ? images.downArr : images.forward2}
                    style={[
                      styles.accordionIcon,
                      isExpanded && {
                        tintColor: colors.brown,
                        transform: [{ rotate: '0deg' }],
                      },
                    ]}
                    resizeMode="contain"
                  />
                </View>
                {isExpanded && (
                  <SolidText style={styles.accordionBody}>
                    {faq.answer}
                  </SolidText>
                )}
              </TouchableOpacity>
            );
          })}

          <View style={styles.feedbackCard}>
            <SolidText style={styles.feedbackTitle}>
              {localization.appkeys?.feedbackTitle || 'Your feedback matters'}
            </SolidText>
            <SolidText style={styles.feedbackSubtitle}>
              {localization.appkeys?.feedbackSubtitle ||
                'Help us improve Mel by sharing your suggestions and experience feedback.'}
            </SolidText>
            <SolidBtn
              titleTxt={localization.appkeys?.sendFeedback || 'Send feedback'}
              btnStyle={styles.sendFeedbackBtn}
              onPress={() => {}}
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
