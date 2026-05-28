import React, { useContext, useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import JourneyModuleItem from '../../../../components/JourneyModuleItem';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import PremiumModal from '../../../../modals/PremiumModal';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';

const PAGE_SIZE = 10;

const ProgressTracker = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: progressData, isLoading, error } = useGetApi(
    endpoints.progress_tracker_list,
    ['progress_tracker_list'],
  );

  const mappedModules = useMemo(() => {
    const rawListing = progressData?.data?.progressListing || [];
    if (!Array.isArray(rawListing)) return [];

    return rawListing.map((item: any) => ({
      ...item,
      isLocked: item.level_status === 'pending',
      level: item.level_number,
      pts: item.earned_point,
      totalPoints: item.total_points,
      title: `${localization.appkeys.level} ${item.level_number}`,
      subtitle: '',
    }));
  }, [progressData, localization]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [mappedModules.length]);

  const visibleModules = useMemo(() => {
    return mappedModules.slice(0, visibleCount);
  }, [mappedModules, visibleCount]);

  const loadMoreLocal = useCallback(() => {
    if (visibleCount < mappedModules.length) {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, mappedModules.length));
    }
  }, [visibleCount, mappedModules.length]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <JourneyModuleItem item={item} localization={localization} />
  ), [localization]);

  const keyExtractor = useCallback((item: any, index: number) =>
    item.id || item._id || String(index),
  []);

  const ListHeader = useMemo(() => (
    <View>
      <HeaderCommon
        title={localization.appkeys.homeProgressTracker}
        rightIcon={images.crown}
        onRightPress={() => setShowCreditsModal(true)}
      />

      <SolidText style={styles.journeyTitle}>
        {localization.appkeys.yourProgressJourney}
      </SolidText>
      <SolidText style={styles.journeySub}>
        {localization.appkeys.progressJourneySub}
      </SolidText>
    </View>
  ), [localization, images, styles]);

  const ListEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
          }}
        >
          <ActivityIndicator size="large" color={colors.brown} />
        </View>
      );
    }
    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            paddingHorizontal: 20,
          }}
        >
          <SolidText style={{ color: 'red', textAlign: 'center' }}>
            {(error as any)?.message || 'Something went wrong'}
          </SolidText>
        </View>
      );
    }
    return null;
  }, [isLoading, error, colors.brown]);

  const ListFooter = useCallback(() => {
    if (visibleCount >= mappedModules.length) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.brown} />
      </View>
    );
  }, [visibleCount, mappedModules.length, colors.brown]);

  return (
    <SolidView
      edges={['top']}
      containerStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <FlatList
            data={visibleModules}
            style={styles.mainContainer}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeader}
            renderItem={renderItem}
            ListEmptyComponent={ListEmpty}
            ListFooterComponent={ListFooter}
            onEndReached={loadMoreLocal}
            onEndReachedThreshold={0.4}
            initialNumToRender={PAGE_SIZE}
            maxToRenderPerBatch={PAGE_SIZE}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
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

export default ProgressTracker;
