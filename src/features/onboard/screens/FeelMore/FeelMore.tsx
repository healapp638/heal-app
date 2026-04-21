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

const FeelMore = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: '1', label: localization.appkeys?.optionPeaceOfMind },
    { id: '2', label: localization.appkeys?.optionConfidence },
    { id: '3', label: localization.appkeys?.optionEmotionalStrength },
    { id: '4', label: localization.appkeys?.optionLifeClarity },
    { id: '5', label: localization.appkeys?.optionBalance },
    { id: '6', label: localization.appkeys?.optionMotivation },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <HeaderProgress progress={0.65} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.feelMoreTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.safeSpaceSub}
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
                navigation.navigate(AppRoutes.TimeCommitment as never)
              }
            />
          </View>
        </View>
      }
    />
  );
};

export default FeelMore;
