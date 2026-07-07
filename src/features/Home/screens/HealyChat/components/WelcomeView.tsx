import React from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import SolidText from '../../../../../components/SolidText';

interface WelcomeViewProps {
  logoSource: any;
  logoColor: string;
  welcomeText: string;
  styles: any;
  isLoadingQuestion?: boolean;
}

const WelcomeViewComponent: React.FC<WelcomeViewProps> = ({
  logoSource,
  logoColor,
  welcomeText,
  styles,
  isLoadingQuestion,
}) => {
  return (
    <View style={styles.welcomeContainer}>
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        tintColor={logoColor}
      />
      {isLoadingQuestion ? (
        <ActivityIndicator size="small" color={logoColor} style={{ marginTop: 12 }} />
      ) : (
        <SolidText style={styles.welcomeText}>{welcomeText}</SolidText>
      )}
    </View>
  );
};

export const WelcomeView = React.memo(WelcomeViewComponent);
