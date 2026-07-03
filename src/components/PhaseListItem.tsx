import React, { useCallback } from 'react';
import PhaseCard from './PhaseCard';

interface PhaseListItemProps {
  item: any;
  index: number;
  localization: any;
  onPress: (item: any, index: number) => void;
}

const PhaseListItem = ({
  item,
  index,
  localization,
  onPress,
}: PhaseListItemProps) => {
  const handlePress = useCallback(() => {
    onPress(item, index);
  }, [item, index, onPress]);

  return (
    <PhaseCard
      phase={`${localization.appkeys?.phase || 'Phase'} ${item.phaseNumber}`}
      title={item.title}
      points={`${item.points || 0} ${localization.appkeys?.pts || 'Pts'}`}
      isLocked={item?.isLocked}
      isCompleted={item.isCompleted}
      onPress={handlePress}
    />
  );
};

export default React.memo(PhaseListItem);
