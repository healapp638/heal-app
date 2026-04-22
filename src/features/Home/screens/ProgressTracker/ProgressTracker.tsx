import React, { useContext, useState } from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import ProgressStatsCard from '../../../../components/ProgressStatsCard';
import JourneyModuleItem from '../../../../components/JourneyModuleItem';
import { LocalizationContext } from '../../../../localization/localization';
import GetCreditsModal from '../../../../modals/GetCreditsModal';
import style from './style';

const ProgressTracker = () => {
  const { colors, images } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const modules = [
    {
      id: '1',
      title: localization.appkeys.firstSteps,
      subtitle: localization.appkeys.firstStepsSub,
      progress: 30,
      level: 1,
      isLocked: false,
    },
    {
      id: '2',
      title: localization.appkeys.findingGround,
      subtitle: localization.appkeys.findingGroundSub,
      progress: 0,
      level: 2,
      isLocked: true,
    },
    {
      id: '3',
      title: localization.appkeys.growingRoots,
      subtitle: localization.appkeys.growingRootsSub,
      progress: 0,
      level: 3,
      isLocked: true,
    },
    {
      id: '4',
      title: localization.appkeys.blooming,
      subtitle: localization.appkeys.bloomingSub,
      progress: 0,
      level: 4,
      isLocked: true,
    },
    {
      id: '5',
      title: localization.appkeys.flourishing,
      subtitle: localization.appkeys.flourishingSub,
      progress: 0,
      level: 5,
      isLocked: true,
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
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

          {/* Stats Card */}
          <ProgressStatsCard
            level={1}
            progress="0/5"
            pts="0/500"
            lvText={localization.appkeys.lv}
            levelLabel={localization.appkeys.level}
            progressLabel={localization.appkeys.progress}
            ptsLabel={localization.appkeys.pts}
          />

          {/* Journey Modules */}
          <View style={styles.moduleList}>
            {modules.map(item => (
              <JourneyModuleItem
                key={item.id}
                item={item}
                localization={localization}
              />
            ))}
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

export default ProgressTracker;
