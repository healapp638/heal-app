import { Image, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderProgress from '../../../../components/HeaderProgress';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';

const TimeCommitment = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const styles = style(colors);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: '1', label: 'Just 2 minutes' },
    { id: '2', label: 'Around 5 minutes' },
    { id: '3', label: '10 minutes or more' },
    { id: '4', label: 'Only when I need it' },
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
              How much time can you commit?
            </SolidText>
            <SolidText style={styles.subtitle}>
              Choose the amount of time that feels comfortable for you.
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
