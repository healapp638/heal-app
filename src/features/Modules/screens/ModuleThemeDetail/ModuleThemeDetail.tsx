import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const sections = [
  {
    title: 'Understanding Your Friendships',
    colorText: '#986455',
    colorBorder: '#E2D2CA',
    items: [
      'What is a True Friendship',
      'My History with Friendship',
      'Making New Friends as an Adult',
      "What I'm Really Looking for in Friendship",
      'Long-Distance Friendships',
    ],
  },
  {
    title: 'Navigating Friendship Difficulties',
    colorText: '#776151',
    colorBorder: '#C8BDB2',
    items: [
      'Managing Conflict with a Friend',
      'Recognizing a Toxic Friendship',
      'Friendship Betrayal',
      'When Friendships Evolve',
      'Friendship Loneliness',
    ],
  },
  {
    title: 'Building a Fulfilling Friendship Life',
    colorText: '#F66F76',
    colorBorder: '#F6C1C5',
    items: [
      'Intergenerational Friendship',
      'Friendship Between People of Different Genders',
      'When Friendship Becomes Family',
      'Friendship Through Major Life Challenges',
      'Building a Fulfilling Friendship Life',
    ],
  },
];

const ModuleThemeDetail = () => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title="Modules" />

          <SolidText style={styles.title}>Friendship</SolidText>
          <SolidText style={styles.subtitle}>
            Understanding, healing and building your friendships
          </SolidText>

          <ProgressTrackerCard
            viewStyle={styles.progressCardMargin}
            title="Progress Tracker"
            percentage="30%"
            level="Level 2"
            points="145/500 PTS"
            onPress={() => {
              navigation.navigate(AppRoutes.ProgressTracker as never);
            }}
          />

          {sections.map((section, sIndex) => (
            <View key={sIndex}>
              <SolidText style={styles.sectionTitle}>{section.title}</SolidText>
              {section.items.map((item, iIndex) => (
                <TouchableOpacity
                  key={iIndex}
                  onPress={() =>
                    navigation.navigate(AppRoutes.StartedModule as never)
                  }
                  style={styles.itemCard}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.itemCircle,
                      { borderColor: section.colorBorder },
                    ]}
                  >
                    <SolidText
                      style={[styles.circleText, { color: section.colorText }]}
                    >
                      0/5
                    </SolidText>
                  </View>

                  <SolidText style={styles.itemLabel}>{item}</SolidText>

                  <Image
                    source={images.forward2}
                    style={styles.forwardIcon}
                    resizeMode="contain"
                    tintColor={colors.brown || '#333'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </View>
      }
    />
  );
};

export default ModuleThemeDetail;
