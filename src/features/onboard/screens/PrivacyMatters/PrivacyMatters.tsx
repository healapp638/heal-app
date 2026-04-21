import React, { useState, useContext } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import { useNavigation, useTheme } from '@react-navigation/native';
import style from './style';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';

const PrivacyMatters = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [accepted, setAccepted] = useState(false);

  const privacyItems = [
    {
      id: '1',
      icon: images.must,
      text: localization.appkeys?.privacyItem1,
      bg: '#E2EBD3', // Light green
    },
    {
      id: '2',
      icon: images.lock,
      text: localization.appkeys?.privacyItem2,
      bg: '#FCE7E7', // Light pink
    },
    {
      id: '3',
      icon: images.private,
      text: localization.appkeys?.privacyItem3,
      bg: '#E1F0FF', // Light blue
    },
  ];

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={{ flex: 1 }}>
          <Image
            source={images.door}
            style={styles.doorImage}
            resizeMode="contain"
          />

          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.privacyTitle}
            </SolidText>

            {privacyItems.map(item => (
              <View key={item.id} style={styles.privacyCard}>
                <Image
                  source={item.icon}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />

                <SolidText style={styles.cardText}>{item.text}</SolidText>
              </View>
            ))}

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAccepted(!accepted)}
              activeOpacity={0.8}
            >
              <Image
                source={accepted ? images.tickbox : images.uncheck}
                style={styles.checkboxImage}
                resizeMode="contain"
              />
              <SolidText style={styles.checkboxText}>
                {localization.appkeys?.privacyAcceptTerms}
              </SolidText>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <SolidBtn
              titleTxt={localization.appkeys?.continue}
              btnStyle={styles.btn}
              disabled={!accepted}
              onPress={() => navigation.navigate(AppRoutes.Warning as never)}
            />

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(AppRoutes.PrivacyPolicy as never)
                }
              >
                <SolidText style={styles.footerText}>
                  {localization.appkeys?.privacyPolicy}
                </SolidText>
              </TouchableOpacity>
              <View style={styles.dot} />
              <TouchableOpacity
                onPress={() => navigation.navigate(AppRoutes.Terms as never)}
              >
                <SolidText style={styles.footerText}>
                  {localization.appkeys?.termsOfService}
                </SolidText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
};

export default PrivacyMatters;
