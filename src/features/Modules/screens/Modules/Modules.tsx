import React, { useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import HomeHeader from '../../../../components/HomeHeader';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import StartedModuleCard from '../../../../components/StartedModuleCard';
import ModuleThemeCard from '../../../../components/ModuleThemeCard';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const Modules = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const navigation = useNavigation();
  const styles = style(colors);

  const themes = [
    {
      id: 'romantic',
      label: localization.appkeys?.optionRomantic || 'Romantic relationships',
      icon: images.romantic,
    },
    {
      id: 'family',
      label: localization.appkeys?.optionFamily || 'Family',
      icon: images.family,
    },
    {
      id: 'friendship',
      label: localization.appkeys?.optionFriendship || 'Friendship',
      icon: images.friendship,
    },
    {
      id: 'loneliness',
      label: localization.appkeys?.optionLoneliness || 'Loneliness',
      icon: images.loneliness,
    },
    {
      id: 'selfconfident',
      label: localization.appkeys?.optionSelfConfident || 'Self Confident',
      icon: images.selfconfident,
    },
    {
      id: 'needtotalk',
      label: localization.appkeys?.optionNeedToTalk || 'Just need to talk',
      icon: images.needtotalk,
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      showChat
      view={
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <HomeHeader
            showStreak={false}
            onCrownPress={() => {}}
            userName={localization.appkeys?.tabModules || 'Modules'}
            safeSpaceLabel={
              localization.appkeys?.modulesSubtitle || 'Choose guided support'
            }
            onStreakPress={() => {}}
          />

          {/* Progress Tracker Card */}
          <ProgressTrackerCard
            viewStyle={styles.progressCardMargin}
            title={
              localization.appkeys?.homeProgressTracker || 'Progress Tracker'
            }
            percentage="30%"
            level={localization.appkeys?.homeLevel2?.split(' ')[1] || 'Level 2'}
            points="145/500 PTS"
            onPress={() =>
              navigation.navigate(AppRoutes.ProgressTracker as never)
            }
          />

          {/* Started Modules */}
          <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
            {localization.appkeys?.startedModules || 'Started Modules'}
          </SolidText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            style={styles.horizontalList}
          >
            <StartedModuleCard
              title={
                localization.appkeys?.moduleRedFlags || 'Red Flags I Ignored'
              }
              subtitle={
                localization.appkeys?.moduleRelationshipBasics ||
                'RELATIONSHIP BASICS'
              }
              progressText="2/7"
              isFinished={false}
              onPress={() =>
                navigation.navigate(AppRoutes.StartedModule as never)
              }
            />
            {/* Adding a second one to show scrollability */}
            <StartedModuleCard
              title={
                localization.appkeys?.moduleFindingYourself ||
                'Finding Yourself'
              }
              subtitle={
                localization.appkeys?.moduleSelfDiscovery || 'SELF DISCOVERY'
              }
              progressText="1/5"
              isFinished={false}
              onPress={() =>
                navigation.navigate(AppRoutes.StartedModule as never)
              }
            />
          </ScrollView>

          {/* Modules Themes */}
          <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
            {localization.appkeys?.modulesThemes || 'Modules Themes'}
          </SolidText>
          <View style={styles.themesList}>
            {themes.map(theme => (
              <ModuleThemeCard
                key={theme.id}
                item={theme}
                onPress={() =>
                  navigation.navigate(AppRoutes.ModuleThemeDetail as never)
                }
              />
            ))}
          </View>

          {/* Finished Modules */}
          <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
            {localization.appkeys?.finishedModules || 'Finished Modules'}
          </SolidText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            style={styles.horizontalList}
          >
            <StartedModuleCard
              title={
                localization.appkeys?.moduleRedFlags || 'Red Flags I Ignored'
              }
              subtitle={
                localization.appkeys?.moduleRelationshipBasics ||
                'RELATIONSHIP BASICS'
              }
              isFinished={true}
              onPress={() =>
                navigation.navigate(AppRoutes.StartedModule as never)
              }
            />
            <StartedModuleCard
              title={
                localization.appkeys?.moduleRedFlags || 'Red Flags I Ignored'
              }
              subtitle={
                localization.appkeys?.moduleRelationshipBasics ||
                'RELATIONSHIP BASICS'
              }
              isFinished={true}
              onPress={() =>
                navigation.navigate(AppRoutes.StartedModule as never)
              }
            />
          </ScrollView>
        </ScrollView>
      }
    />
  );
};

export default Modules;
