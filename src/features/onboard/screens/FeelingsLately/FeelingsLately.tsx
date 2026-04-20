import { Image, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderProgress from '../../../../components/HeaderProgress';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const FeelingsLately = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: '1', label: 'Overwhelmed' },
    { id: '2', label: 'Emotionally drained' },
    { id: '3', label: 'Overthinking everything' },
    { id: '4', label: 'Feeling stuck' },
    { id: '5', label: 'Lost or unsure about life' },
    { id: '6', label: 'Just looking for more clarity' },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <HeaderProgress progress={0.5} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              How have you been feeling lately?
            </SolidText>
            <SolidText style={styles.subtitle}>
              Your answers help us personalize your safe space.
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
              titleTxt="Continue"
              btnStyle={styles.btn}
              disabled={!selected}
              onPress={() => navigation.navigate(AppRoutes.FeelMore as never)}
            />
          </View>
        </View>
      }
    />
  );
};

export default FeelingsLately;
