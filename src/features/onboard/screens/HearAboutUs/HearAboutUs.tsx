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

const HearAboutUs = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { id: 'tiktok', label: localization.appkeys?.optionTikTok, icon: images.tiktok },
    { id: 'insta', label: localization.appkeys?.optionInsta, icon: images.insta },
    { id: 'apple', label: localization.appkeys?.optionAppStore, icon: images.apple },
    { id: 'group', label: localization.appkeys?.optionGroup, icon: images.group },
    { id: 'fb', label: localization.appkeys?.optionFB, icon: images.fb },
    { id: 'youtube', label: localization.appkeys?.optionYoutube, icon: images.youtube },
    { id: 'twitter', label: localization.appkeys?.optionTwitter, icon: images.twitter },
    { id: 'google', label: localization.appkeys?.optionGoogleS, icon: images.google },
    { id: 'other', label: localization.appkeys?.optionOther, icon: images.other },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <HeaderProgress progress={0.2} />

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="contain"
          />
          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.hearAboutTitle}
            </SolidText>
            <SolidText style={styles.subtitle}>
              {localization.appkeys?.seeBetterSubtitle}
            </SolidText>

            <View style={styles.listContainer}>
              {options.map(option => {
                const isSelected = selected === option.id;
                const isOther = option.id === 'other';

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isOther && styles.optionCardFull,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => setSelected(option.id)}
                    activeOpacity={0.7}
                  >
                    {!isOther ? (
                      <>
                        <View style={styles.iconWrap}>
                          <Image
                            source={option.icon}
                            style={
                              option?.id == 'group'
                                ? { height: 44, width: 44, marginLeft: -4 }
                                : styles.icon
                            }
                            resizeMode="contain"
                          />
                          {isSelected && (
                            <Image
                              source={images.tick}
                              style={styles.tickIcon}
                              resizeMode="contain"
                            />
                          )}
                        </View>
                        <SolidText
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                          maxFontScale={1}
                        >
                          {option.label}
                        </SolidText>
                      </>
                    ) : (
                      <>
                        <View style={styles.optionCardFullLeft}>
                          <Image
                            source={option.icon}
                            style={[styles.icon, styles.optionCardFullIcon]}
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
                        </View>
                        {isSelected && (
                          <Image
                            source={images.tick}
                            style={styles.tickIcon}
                            resizeMode="contain"
                          />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              disabled={!selected}
              onPress={() =>
                navigation.navigate(AppRoutes.BringYouHere as never)
              }
            />
          </View>
        </View>
      }
    />
  );
};

export default HearAboutUs;
