import React, { useContext } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import { LocalizationContext } from '../../../../localization/localization';

const ModuleThemeDetail = () => {
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;

  const sections = [
    {
      title:
        localization.appkeys?.sectionUnderstandingFriendships ||
        'Understanding Your Friendships',
      colorText: '#986455',
      colorBorder: '#E2D2CA',
      items: [
        localization.appkeys?.itemWhatIsTrueFriendship ||
          'What is a True Friendship',
        localization.appkeys?.itemMyHistoryWithFriendship ||
          'My History with Friendship',
        localization.appkeys?.itemMakingNewFriendsAdult ||
          'Making New Friends as an Adult',
        localization.appkeys?.itemWhatImReallyLookingFor ||
          "What I'm Really Looking for in Friendship",
        localization.appkeys?.itemLongDistanceFriendships ||
          'Long-Distance Friendships',
      ],
    },
    {
      title:
        localization.appkeys?.sectionNavigatingDifficulties ||
        'Navigating Friendship Difficulties',
      colorText: '#776151',
      colorBorder: '#C8BDB2',
      items: [
        localization.appkeys?.itemManagingConflict ||
          'Managing Conflict with a Friend',
        localization.appkeys?.itemRecognizingToxic ||
          'Recognizing a Toxic Friendship',
        localization.appkeys?.itemFriendshipBetrayal || 'Friendship Betrayal',
        localization.appkeys?.itemWhenFriendshipsEvolve ||
          'When Friendships Evolve',
        localization.appkeys?.itemFriendshipLoneliness ||
          'Friendship Loneliness',
      ],
    },
    {
      title:
        localization.appkeys?.sectionBuildingFulfilling ||
        'Building a Fulfilling Friendship Life',
      colorText: '#F66F76',
      colorBorder: '#F6C1C5',
      items: [
        localization.appkeys?.itemIntergenerational ||
          'Intergenerational Friendship',
        localization.appkeys?.itemDifferentGenders ||
          'Friendship Between People of Different Genders',
        localization.appkeys?.itemFriendshipBecomesFamily ||
          'When Friendship Becomes Family',
        localization.appkeys?.itemThroughLifeChallenges ||
          'Friendship Through Major Life Challenges',
        localization.appkeys?.itemBuildingFulfillingLife ||
          'Building a Fulfilling Friendship Life',
      ],
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.tabModules || 'Modules'}
          />

          <SolidText style={styles.title}>
            {localization.appkeys?.friendship || 'Friendship'}
          </SolidText>
          <SolidText style={styles.subtitle}>
            {localization.appkeys?.friendshipSubtitle ||
              'Understanding, healing and building your friendships'}
          </SolidText>

          <ProgressTrackerCard
            viewStyle={styles.progressCardMargin}
            title={
              localization.appkeys?.homeProgressTracker || 'Progress Tracker'
            }
            percentage="30%"
            level={localization.appkeys?.level || 'Level 2'}
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
