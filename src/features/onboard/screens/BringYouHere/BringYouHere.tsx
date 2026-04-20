import { Image, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import HeaderProgress from '../../../../components/HeaderProgress';
import { useNavigation, useTheme } from '@react-navigation/native';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

const BringYouHere = () => {
  const navigation = useNavigation();
  const { colors, images } = useTheme() as any;
  const styles = style(colors);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: 'romantic', label: 'Romantic relationships', icon: images.romantic },
    { id: 'family', label: 'Family', icon: images.family },
    { id: 'friendship', label: 'Friendship', icon: images.friendship },
    { id: 'loneliness', label: 'Loneliness', icon: images.loneliness },
    {
      id: 'selfconfident',
      label: 'Self Confident',
      icon: images.selfconfident,
    },
    { id: 'needtotalk', label: 'Just need to talk', icon: images.needtotalk },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <HeaderProgress progress={0.4} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>What brings you here?</SolidText>
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
                    <Image
                      source={option.icon}
                      style={styles.icon}
                      resizeMode="contain"
                    />
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

            <SolidBtn
              titleTxt="Continue"
              btnStyle={styles.btn}
              disabled={!selected}
              onPress={() =>
                navigation.navigate(AppRoutes.FeelingsLately as never)
              }
            />
          </View>
        </View>
      }
    />
  );
};

export default BringYouHere;
