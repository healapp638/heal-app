import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, BackHandler, Image, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import CountryDropdown from '../../../../components/CountryDropdown';
import { LocalizationContext } from '../../../../localization/localization';
import DobPickerModal, {
  DobDateParts,
} from '../../../../modals/DobPickerModal';
import InfoModal from '../../../../modals/InfoModal';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import style from './style';
import AppUtils from '../../../../utils/appUtils';
import { validateSignUpForm } from '../../utils/SignUp/signUpValidation';
import {
  getLocalizedMonthName,
  getLocalizedMonths,
  monthToNumber,
} from '../../utils/SignUp/signUpHelpers';
import { useSelector } from 'react-redux';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import useSocialLogin from '../../../../hooks/useSocialLogin';

const SignUp = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const answers = useSelector(
    (state: any) => state?.userData?.onboarding?.answers,
  );
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  // console.log('onboarding answers in sign up', answers);
  const styles = style(colors);
  const { mutate: registerUser, isPending: isRegistering } = usePostApi();
  const { googleLogin, isSocialPending } = useSocialLogin();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    isoCode: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<DobDateParts>({
    month: 'January',
    day: '01',
    year: '2000',
  });

  // Visibility & Modal State
  const [isDobSelected, setIsDobSelected] = useState(false);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Info Modal States
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [countryInfoVisible, setCountryInfoVisible] = useState(false);

  const localizedMonths = getLocalizedMonths(localization);

  const dobDisplay = isDobSelected
    ? `${selectedDate.day} - ${getLocalizedMonthName(
        selectedDate.month,
        localization,
      )} - ${selectedDate.year}`
    : localization.appkeys?.selectBirthDate;

  const handleSignUp = () => {
    const validation = validateSignUpForm({
      fullName,
      email,
      password,
      confirmPassword,
      selectedCountry,
      isDobSelected,
      selectedDate,
      localizedMonths,
      appkeys: localization.appkeys,
    });

    if (!validation.isValid) {
      AppUtils.showToast(validation.message, validation.duration);
      return;
    }

    const formattedDob = `${selectedDate.year}-${
      monthToNumber[selectedDate.month]
    }-${selectedDate.day}`;

    const registrationData = {
      fullName,
      email: email?.trim()?.toLowerCase(),
      password,
      country: selectedCountry?.name || '',
      dob: formattedDob,
      bringsYouHere: answers?.bringYouHere || '',
      likeToFellMore: answers?.feelMore || '',
      howFellingLately: answers?.feelingsLately || '',
      hearAboutUs: answers?.hearAboutUs || '',
      startShowingOfYourSelf: answers?.readyToStart || '',
      timeYouCommit: answers?.timeCommitment || '',
      language: AppUtils.getLanguageCode(appLanguage),
    };

    registerUser(
      { endpoint: endpoints.register, data: registrationData },
      {
        onSuccess: (response: any) => {
          navigation.navigate(
            AppRoutes.Verification as never,
            { email: email, password: password } as never,
          );
        },
        onError: error => {
          console.log('Error during registration:', error);
          AppUtils.showToast(error.message || 'Registration failed');
        },
      },
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SolidView
      isScrollEnabled={true}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.signUpHeader} />

          <View style={styles.formContainer}>
            <SolidText style={styles.welcomeTitle}>
              {localization.appkeys?.createAccount}
            </SolidText>
            <SolidText style={styles.welcomeSubtitle}>
              {localization.appkeys?.createAccountSubtitle}
            </SolidText>

            <SolidInput
              label={localization.appkeys?.fullName}
              placeholder={localization.appkeys?.enterNamePlaceholder}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <CountryDropdown
              label={localization.appkeys?.selectCountry}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
              onInfoPress={() => setCountryInfoVisible(true)}
            />

            <SolidInput
              label={localization.appkeys?.email}
              placeholder="Johnsmith911@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              rightImg={images.mail}
              rightImgTintColor={colors.primary}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setDobModalVisible(true)}
            >
              <SolidInput
                mainStyle={{ marginBottom: -1 }}
                label={localization.appkeys?.whenBorn}
                value={dobDisplay}
                placeholder={localization.appkeys?.selectBirthDate}
                editable={false}
                pointerEvents="none"
                rightImg={images.dob}
                rightImgTintColor={colors.primary}
                textInputStyle={{
                  color: isDobSelected ? colors.brown : '#999',
                }}
              />
            </TouchableOpacity>

            <SolidInput
              mainStyle={{ marginTop: 21 }}
              label={localization.appkeys?.password}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              isSecure={!passwordVisible}
              rightImg={passwordVisible ? images.eyeOpen : images.eyeClose}
              onRightPress={() => setPasswordVisible(!passwordVisible)}
              rightImgTintColor={colors.primary}
              onInfoPress={() => setInfoModalVisible(true)}
            />

            <SolidInput
              label={localization.appkeys?.confirmPassword}
              placeholder="********"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isSecure={!confirmPasswordVisible}
              rightImg={
                confirmPasswordVisible ? images.eyeOpen : images.eyeClose
              }
              onRightPress={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              rightImgTintColor={colors.primary}
            />

            <SolidBtn
              titleTxt={localization.appkeys?.signUpHeader}
              btnStyle={styles.signUpBtn}
              onPress={handleSignUp}
              isLoading={isRegistering}
              disabled={isRegistering || isSocialPending}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <SolidText style={styles.dividerText}>
                {localization.appkeys?.orContinueWith}
              </SolidText>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={googleLogin}
                disabled={isSocialPending || isRegistering}
              >
                <Image
                  source={images.google2}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <SolidText style={styles.socialBtnTxt}>
                  {localization.appkeys?.google}
                </SolidText>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => {}}
                  disabled={isSocialPending || isRegistering}
                >
                  <Image
                    source={images.apple}
                    style={styles.socialIcon}
                    resizeMode="contain"
                  />
                  <SolidText style={styles.socialBtnTxt}>
                    {localization.appkeys?.apple}
                  </SolidText>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.footer}>
              <SolidText style={styles.footerText}>
                {localization.appkeys?.alreadyAccount}
              </SolidText>
              <TouchableOpacity
                onPress={() => navigation.navigate(AppRoutes.SignIn as never)}
              >
                <SolidText style={styles.signInText}>
                  {localization.appkeys?.signIn}
                </SolidText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modals */}
          <DobPickerModal
            visible={dobModalVisible}
            date={selectedDate}
            setDate={setSelectedDate}
            setIsDobSelected={setIsDobSelected}
            onClose={() => setDobModalVisible(false)}
          />

          <InfoModal
            visible={countryInfoVisible}
            onClose={() => setCountryInfoVisible(false)}
            title={localization.appkeys?.selectWhereLive}
            message={localization.appkeys?.helpResourcesMsg}
          />

          <InfoModal
            visible={infoModalVisible}
            onClose={() => setInfoModalVisible(false)}
            title={localization.appkeys?.passwordRequirementTitle}
            requirements={[
              localization.appkeys?.passwordReq1,
              localization.appkeys?.passwordReq2,
              localization.appkeys?.passwordReq3,
              localization.appkeys?.passwordReq4,
            ]}
          />
        </View>
      }
    />
  );
};

export default SignUp;
