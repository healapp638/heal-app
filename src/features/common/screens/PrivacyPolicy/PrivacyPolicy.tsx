import React, { useContext } from 'react';
import HeaderCommon from '../../../../components/HeaderCommon';
import style from './style';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { useTheme } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { LocalizationContext } from '../../../../localization/localization';

const PrivacyPolicy = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const placeholderText = localization.appkeys?.legalPlaceholder;

  return (
    <SolidView
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.privacyPolicy} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <SolidText style={styles.text}>{placeholderText}</SolidText>
            <SolidText style={styles.text}>{placeholderText}</SolidText>
          </ScrollView>
        </View>
      }
    />
  );
};

export default PrivacyPolicy;
