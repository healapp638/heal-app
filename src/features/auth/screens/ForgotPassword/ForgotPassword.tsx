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
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
const ForgotPassword = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const [email, setEmail] = useState('');
  const { mutate: forgotPassword, isPending } = usePostApi();
  const handleVerify = () => {
    if (!email) {
      AppUtils.showToast(
        localization.appkeys?.enterEmail || 'Please enter email',
      );
      return;
    }
    if (!AppUtils.validateEmail(email)) {
      AppUtils.showToast(
        localization.appkeys?.toastInvalidEmail ||
          'Please enter a valid email address.',
      );
      return;
    }

    forgotPassword(
      {
        endpoint: endpoints.forgot_password,
        data: {
          email: email?.trim()?.toLowerCase(),
        },
      },
      {
        onSuccess: () => {
          navigation.navigate(
            AppRoutes.Verification as never,
            {
              from: 'ForgotPassword',
              email,
            } as never,
          );
        },
        onError: (error: any) => {
          AppUtils.showToast(error.message || 'Failed to send reset code');
        },
      },
    );
  };
  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.forgotPassHeader} />

          <SolidText style={styles.welcomeTitle}>
            {localization.appkeys?.forgotPassHeader}
          </SolidText>
          <SolidText style={styles.welcomeSubtitle}>
            {localization.appkeys?.forgotPassSubtitle}
          </SolidText>

          <SolidInput
            label={localization.appkeys?.email}
            placeholder="Johnsmith911@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            rightImg={images.mail}
            rightImgTintColor={colors.primary}
            autoCapitalize="none"
          />
          <View
            style={{
              flex: 1,
            }}
          />
          <SolidBtn
            titleTxt={localization.appkeys?.verifyAndContinue}
            btnStyle={styles.verifyBtn}
            onPress={(...args: any) => {
              return (handleVerify as any)(...args);
            }}
            isLoading={isPending}
            disabled={isPending}
          />
        </View>
      }
    />
  );
};
export default ForgotPassword;
