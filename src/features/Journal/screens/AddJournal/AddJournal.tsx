import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderCommon from '../../../../components/HeaderCommon';
import { LocalizationContext } from '../../../../localization/localization';

import GetCreditsModal from '../../../../modals/GetCreditsModal';
import style from './AddJournalStyle';

const AddJournal = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const [selectedEmotion, setSelectedEmotion] = useState<string>('hope');
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');

  const emotions = [
    {
      id: 'calm',
      label: localization.appkeys?.feelingCalm || 'Calm',
      image: images.calm,
    },
    {
      id: 'sad',
      label: localization.appkeys?.feelingSad || 'Sad',
      image: images.sad,
    },
    {
      id: 'happy',
      label: localization.appkeys?.feelingHappy || 'Happy',
      image: images.happy,
    },
    {
      id: 'sorrow',
      label: localization.appkeys?.feelingSorrow || 'Sorrow',
      image: images.sorrow,
    },
    {
      id: 'thoughtful',
      label: localization.appkeys?.feelingThoughtful || 'Thoughtful',
      image: images.thoughtful,
    },
    {
      id: 'hope',
      label: localization.appkeys?.feelingHope || 'Hope',
      image: images.hope,
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          {/* Header */}
          <HeaderCommon
            title={localization.appkeys?.addJournalHeaderTitle || 'New Entry'}
            rightIcon={images.crown}
            onRightPress={() => setShowCreditsModal(true)}
          />

          {/* Titles */}
          <SolidText style={styles.title}>
            {localization.appkeys?.addJournalTitle || 'New entry'}
          </SolidText>
          <SolidText style={styles.dateText}>April 20, 2026</SolidText>

          {/* Emotions Section */}
          <SolidText style={styles.sectionTitle}>
            {localization.appkeys?.howAreYouFeeling || 'How are you feeling?'}
          </SolidText>
          <View style={styles.gridContainer}>
            {emotions.map(emotion => (
              <TouchableOpacity
                key={emotion.id}
                activeOpacity={0.8}
                onPress={() => setSelectedEmotion(emotion.id)}
                style={[
                  styles.emotionCard,
                  selectedEmotion === emotion.id && styles.emotionCardSelected,
                ]}
              >
                <Image
                  source={emotion.image}
                  style={styles.emotionImage}
                  resizeMode="cover"
                  defaultSource={emotion.image}
                />
                <SolidText style={styles.emotionText}>
                  {emotion.label}
                </SolidText>
                {selectedEmotion === emotion.id && (
                  <Image
                    source={images.selected}
                    style={styles.selectedOverlay}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            maxFontSizeMultiplier={1.4}
            placeholder={
              localization.appkeys?.entryTitlePlaceholder ||
              'Title of your entry...'
            }
            placeholderTextColor="black"
            value={titleText}
            onChangeText={setTitleText}
          />

          {/* Body Input */}
          <View style={styles.bodyContainer}>
            <TextInput
              style={styles.bodyInput}
              maxFontSizeMultiplier={1.4}
              placeholder={
                localization.appkeys?.entryBodyPlaceholder ||
                'Express what you feel... This space is yours, without judgment. 🤍'
              }
              placeholderTextColor="black"
              multiline
              value={bodyText}
              onChangeText={setBodyText}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.micIconContainer}>
              <Image
                source={images.microphone2}
                style={styles.micIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <SolidBtn
            titleTxt={localization.appkeys?.saveMyEntry || 'Save my entry'}
            btnStyle={styles.saveButton}
            onPress={() => {
              // Save logic
            }}
          />
          <GetCreditsModal
            visible={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
          />
        </View>
      }
    />
  );
};

export default AddJournal;
