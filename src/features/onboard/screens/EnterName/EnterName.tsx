import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Image, Keyboard, View } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import HeaderCommon from '../../../../components/HeaderCommon';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { LocalizationContext } from '../../../../localization/localization';
import { setOnboardingAnswer, setOnboardingCurrentScreen } from '../../../../redux/Reducers/userData';
import AppUtils from '../../../../utils/appUtils';
import style from './style';

const EnterName = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const savedName = useSelector(
    (state: any) => state.userData?.onboarding?.answers?.fullName ?? ''
  );

  const [name, setName] = useState<string>(savedName);

  useEffect(() => {
    setName(savedName);
  }, [savedName]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setOnboardingCurrentScreen(AppRoutes.EnterName));
    }, [dispatch])
  );

  const handleContinue = () => {
    Keyboard.dismiss();
    const trimmedName = name.trim();
    if (!trimmedName) {
      const toastMessage = localization.appkeys?.toastEnterFullName || 'Please enter your name.';
      AppUtils.showToast(toastMessage);
      return;
    }

    dispatch(setOnboardingAnswer({ key: 'fullName', value: trimmedName }));
    navigation.navigate(AppRoutes.HelpsFeelBetter as never);
  };

  const handleBackPress = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: -50,
              zIndex: 999,
            }}
          >
            <HeaderCommon title={''} onBackPress={handleBackPress} />
          </View>

          <Image
            source={images.heartRope}
            style={styles.heartRope}
            resizeMode="stretch"
          />

          <View style={styles.mainContainer}>
            <SolidText style={styles.title}>
              {localization.appkeys?.whatBeCalled}
            </SolidText>

            <SolidText style={styles.subtitle}>
              {localization.appkeys?.nameAppearSpace}
            </SolidText>

            <View style={styles.inputContainer}>
              <SolidInput
                placeholder={localization.appkeys?.yourName || 'Your name'}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                viewStyle={styles.inputStyle}
                textInputStyle={styles.inputText}
                maxLength={40}
              />
            </View>

            <View style={{ flex: 1 }} />

            <SolidBtn
              titleTxt={localization.appkeys?.continue || 'Continue'}
              btnStyle={styles.btn}
              onPress={handleContinue}
            />
          </View>
        </View>
      }
    />
  );
};

export default EnterName;
