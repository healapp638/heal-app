import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import SolidText from './SolidText';
import ProgressCircleItem from './ProgressCircleItem';

interface StartedModuleHeaderProps {
  subModuleDetail: any;
  phases: any[];
  localization: any;
  colors: any;
  styles: any;
}

const StartedModuleHeader = ({
  subModuleDetail,
  phases,
  localization,
  colors,
  styles,
}: StartedModuleHeaderProps) => {
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isCompleted = item?.isCompleted;
      const step = index + 1;
      const isLast = index === phases.length - 1;

      return (
        <ProgressCircleItem
          step={step}
          isCompleted={isCompleted}
          isLast={isLast}
          styles={styles}
        />
      );
    },
    [phases.length, styles],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item?._id ? `${item._id}_${index}` : (index + 1).toString(),
    [],
  );

  return (
    <>
      <View style={styles.headerTextContainer}>
        <SolidText style={[styles.title, { color: colors.brown }]}>
          {subModuleDetail?.title ||
            localization.appkeys?.trueFriendshipTitle ||
            'What is a True Friendship?'}
        </SolidText>
        <SolidText style={[styles.subtitle, { color: colors.brown }]}>
          {subModuleDetail?.description ||
            localization.appkeys?.trueFriendshipDesc ||
            'We often say we have friends — but what does that really mean?'}
        </SolidText>
      </View>

      {phases.length > 0 && (
        <FlatList
          horizontal
          data={phases}
          showsHorizontalScrollIndicator={false}
          style={styles.progressRowContainer}
          contentContainerStyle={styles.progressRowContent}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      )}

      <SolidText style={[styles.sectionTitle, { color: colors.brown }]}>
        {localization.appkeys?.phases || 'Phases'}
      </SolidText>
    </>
  );
};

export default React.memo(StartedModuleHeader);
