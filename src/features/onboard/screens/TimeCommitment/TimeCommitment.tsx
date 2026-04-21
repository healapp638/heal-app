import React, { useState, useContext } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderProgress from '../../../../components/HeaderProgress';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';

const TimeCommitment = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: '1', label: localization.appkeys?.option2Min },
    { id: '2', label: localization.appkeys?.option5Min },
    { id: '3', label: localization.appkeys?.option10MinPlus },
    { id: '4', label: localization.appkeys?.optionWhenNeeded },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <HeaderProgress progress={0.8} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.timeCommitmentTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.timeCommitmentSub}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isSelected = selected === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => setSelected(option.id)}
                    activeOpacity={0.7}
                  >
                    <SolidText
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </SolidText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ flex: 1 }} />
            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              disabled={!selected}
              onPress={() =>
                navigation.navigate(AppRoutes.ReadyToStart as never)
              }
            />
          </View>
        </View>
      }
    />
  );
};

export default TimeCommitment;
