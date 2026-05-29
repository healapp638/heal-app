import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import SolidText from '../../../../../components/SolidText';

interface WelcomeViewProps {
  logoSource: any;
  logoColor: string;
  welcomeText: string;
  styles: any;
}

const WelcomeViewComponent: React.FC<WelcomeViewProps> = ({
  logoSource,
  logoColor,
  welcomeText,
  styles,
}) => {
  return (
    <View style={styles.welcomeContainer}>
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        tintColor={logoColor}
      />
      <SolidText style={styles.welcomeText}>{welcomeText}</SolidText>
    </View>
  );
};

export const WelcomeView = React.memo(WelcomeViewComponent);
