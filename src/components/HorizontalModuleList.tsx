import React, { useCallback } from 'react';
import { FlatList, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import StartedModuleCard from './StartedModuleCard';
import { triggerHaptic } from '../hooks/useHaptic';

interface HorizontalModuleListProps {
  data: any[];
  isLoading: boolean;
  onPress: (item: any) => void;
  localization: any;
  isFinished?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}

const HorizontalModuleList: React.FC<HorizontalModuleListProps> = ({
  data,
  isLoading,
  onPress,
  localization,
  isFinished = false,
  contentContainerStyle,
  style,
}) => {
  const { colors } = useTheme() as any;

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <StartedModuleCard
        title={item.title}
        subtitle={
          item.description ||
          localization.appkeys?.moduleRelationshipBasics ||
          'RELATIONSHIP BASICS'
        }
        progressText={`${item.completed_phase_count}/${item.total_phase_count}`}
        isFinished={isFinished}
        // disabled={isFinished}
        onPress={() => {
          triggerHaptic('impactHeavy');
          onPress(item);
        }}
      />
    ),
    [isFinished, localization.appkeys, onPress],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) => (item._id || index).toString(),
    [],
  );

  if (isLoading) {
    return (
      <ActivityIndicator
        size="small"
        color={colors.brown}
        style={{ marginLeft: 20, marginVertical: 20 }}
      />
    );
  }

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={contentContainerStyle}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
};

export default React.memo(HorizontalModuleList);
