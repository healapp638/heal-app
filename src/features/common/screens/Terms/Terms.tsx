import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useTheme } from '@react-navigation/native';
import style from './style';
import { LocalizationContext } from '../../../../localization/localization';

const Terms = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const placeholderText = localization.appkeys?.legalPlaceholder;

  return (
    <SolidView
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.termsOfService} />

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

export default Terms;
