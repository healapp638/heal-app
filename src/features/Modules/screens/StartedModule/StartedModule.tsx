import React, { useEffect } from 'react';
import { View, FlatList, BackHandler } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import ProgressTrackerCard from '../../../../components/ProgressTrackerCard';
import PhaseCard from '../../../../components/PhaseCard';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const StartedModule = () => {
  const { colors } = useTheme() as any;
  const { localization } = React.useContext(LocalizationContext) as any;
  const styles = style(colors);
  const navigation = useNavigation();

  const phasesData = [
    {
      id: '1',
      phase: localization.appkeys?.phase1 || 'Phase 1',
      title:
        localization.appkeys?.phase1Title || 'Defining Friendship for Yourself',
      points: '10 Pts',
      isLocked: false,
    },
    {
      id: '2',
      phase: localization.appkeys?.phase2 || 'Phase 2',
      title: localization.appkeys?.phase2Title || 'Reciprocity in Friendship',
      points: '10 Pts',
      isLocked: true,
    },
    {
      id: '3',
      phase: localization.appkeys?.phase3 || 'Phase 3',
      title: localization.appkeys?.phase3Title || 'Different Types of Friends',
      points: '10 Pts',
      isLocked: true,
    },
  ];

  const renderHeader = () => (
    <>
      <HeaderCommon title={localization.appkeys?.tabModules || 'Modules'} />

      <View style={styles.headerTextContainer}>
        <SolidText style={[styles.title, { color: colors.brown }]}>
          {localization.appkeys?.trueFriendshipTitle ||
            'What is a True Friendship?'}
        </SolidText>
        <SolidText style={[styles.subtitle, { color: colors.brown }]}>
          {localization.appkeys?.trueFriendshipDesc ||
            'We often say we have friends — but what does that really mean? This module helps you clarify what friendship represents for you and what you expect from it'}
        </SolidText>
      </View>

      <ProgressTrackerCard
        viewStyle={styles.progressCardMargin}
        title={localization.appkeys?.homeProgressTracker || 'Progress Tracker'}
        percentage="30%"
        level={localization.appkeys?.homeLevel2?.split(' ')[1] || 'Level 2'}
        points="145/500 PTS"
        onPress={() => navigation.navigate(AppRoutes.ProgressTracker as never)}
      />

      <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
        {localization.appkeys?.phases || 'Phases'}
      </SolidText>
    </>
  );
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SolidView
      view={
        <View style={styles.mainContainer}>
          <FlatList
            data={phasesData}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <PhaseCard
                phase={item.phase}
                title={item.title}
                points={item.points}
                isLocked={item.isLocked}
                onPress={() => {
                  if (!item.isLocked) {
                    navigation.navigate(AppRoutes.PhaseDetail as never);
                  }
                }}
              />
            )}
          />
        </View>
      }
    />
  );
};

export default StartedModule;
