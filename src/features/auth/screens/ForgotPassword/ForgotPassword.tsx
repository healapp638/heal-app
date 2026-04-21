import { View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import { useContext, useState } from 'react';

const ForgotPassword = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [email, setEmail] = useState('');

  const handleVerify = () => {
    // if (!email) return;
    // For Forgot Password flow, we navigate to Verification
    // We can pass a param to indicate it's for recovery or just handle the title inside Verification
    navigation.navigate(
      AppRoutes.Verification as never,
      { from: 'ForgotPassword' } as never,
    );
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.forgotPassHeader} />

          <SolidText style={styles.welcomeTitle}>
            {localization.appkeys?.forgotPassHeader}
          </SolidText>
          <SolidText style={styles.welcomeSubtitle}>
            {localization.appkeys?.verificationCodeSent}
          </SolidText>

          <SolidInput
            label={localization.appkeys?.email}
            placeholder="Johnsmith911@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            rightImg={images.mail}
            rightImgTintColor={colors.primary}
          />
          <View style={{ flex: 1 }} />
          <SolidBtn
            titleTxt={localization.appkeys?.verifyAndContinue}
            btnStyle={styles.verifyBtn}
            onPress={handleVerify}
          />
        </View>
      }
    />
  );
};

export default ForgotPassword;
