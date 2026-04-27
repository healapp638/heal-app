import React, { useState, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
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
import style from './style';
import AppUtils from '../../../../utils/appUtils';
import {
  getLocalizedMonthName,
  getLocalizedMonths,
  monthToNumber,
} from '../../utils/SignUp/signUpHelpers';
import { isAtLeast13YearsOld } from '../../utils/SignUp/signUpValidation';
import { useDispatch, useSelector } from 'react-redux';
import usePostApi from '../../../../hooks/usePostApi';
import api from '../../../../api/Manager/manager';
import { endpoints } from '../../../../api/Services/endpoints';
import {
  setAuth,
  setToken,
  setUser,
} from '../../../../redux/Reducers/userData';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';

import LogoutModal from '../../../../modals/LogoutModal';

const CompleteProfile = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const route = useRoute() as any;
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const answers = useSelector(
    (state: any) => state?.userData?.onboarding?.answers,
  );
  const appLanguage = useSelector((state: any) => state?.userData?.appLanguage);
  const styles = style(colors);

  const { userData } = route.params || {};
  const { mutate: completeProfileApi, isPending } = usePostApi();

  const [fullName] = useState(userData?.fullName || userData?.name || '');
  const [email] = useState(userData?.email || '');
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    isoCode: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<DobDateParts>({
    month: 'January',
    day: '01',
    year: '2000',
  });
  const [isDobSelected, setIsDobSelected] = useState(false);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    dispatch(setAuth(false));
    dispatch(setUser(null));
    dispatch(setToken(null));
    setLogoutModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: AppRoutes.AccessScreen,
        } as never,
      ],
    });
  };

  const dobDisplay = isDobSelected
    ? `${selectedDate.day} - ${getLocalizedMonthName(
        selectedDate.month,
        localization,
      )} - ${selectedDate.year}`
    : localization.appkeys?.selectBirthDate;

  const handleComplete = () => {
    if (!selectedCountry) {
      AppUtils.showToast(
        localization.appkeys?.selectCountryMsg || 'Please select your country',
      );
      return;
    }
    if (!isDobSelected) {
      AppUtils.showToast(
        localization.appkeys?.selectDobMsg ||
          'Please select your date of birth',
      );
      return;
    }

    const localizedMonths = getLocalizedMonths(localization);
    if (!isAtLeast13YearsOld(selectedDate, localizedMonths)) {
      AppUtils.showToast(
        localization.appkeys?.ageRequirementMsg ||
          'You must be at least 13 years old to use HEAL.',
      );
      return;
    }

    const formattedDob = `${selectedDate.year}-${
      monthToNumber[selectedDate.month]
    }-${selectedDate.day}`;

    const payload = {
      dob: formattedDob,
      country: selectedCountry.name,
    };

    completeProfileApi(
      { endpoint: endpoints.update_profile, data: payload },
      {
        onSuccess: (response: any) => {
          dispatch(setUser(response?.data));
          dispatch(
            setToken(userData?.access_token || response?.data?.access_token),
          );
          dispatch(setAuth(true));
          navigation.reset({
            index: 0,
            routes: [
              {
                name: AppRoutes.NonAuthStack,
                params: { screen: AppRoutes.Offer },
              } as never,
            ],
          });
        },
        onError: error => {
          AppUtils.showToast(error.message || 'Failed to complete profile');
        },
      },
    );
  };

  return (
    <SolidView
      isScrollEnabled={true}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            onBackPress={() => setLogoutModalVisible(true)}
            title={localization.appkeys?.completeProfile || 'Complete Profile'}
          />
          <View style={styles.formContainer}>
            <SolidText style={styles.welcomeTitle}>
              {localization.appkeys?.almostThere || 'Almost There!'}
            </SolidText>
            <SolidText style={styles.welcomeSubtitle}>
              {localization.appkeys?.completeProfileSubtitle ||
                'Please provide a few more details to continue.'}
            </SolidText>

            <SolidInput
              label={localization.appkeys?.fullName}
              value={fullName}
              editable={false}
              mainStyle={{ opacity: 0.7 }}
            />

            <SolidInput
              label={localization.appkeys?.email}
              value={email}
              editable={false}
              mainStyle={{ opacity: 0.7 }}
              rightImg={images.mail}
              rightImgTintColor={colors.primary}
            />

            <CountryDropdown
              label={localization.appkeys?.selectCountry}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setDobModalVisible(true)}
            >
              <SolidInput
                label={localization.appkeys?.whenBorn}
                value={dobDisplay}
                editable={false}
                pointerEvents="none"
                rightImg={images.dob}
                rightImgTintColor={colors.primary}
                textInputStyle={{
                  color: isDobSelected ? colors.brown : '#999',
                }}
              />
            </TouchableOpacity>

            <SolidBtn
              titleTxt={localization.appkeys?.continue || 'Continue'}
              btnStyle={styles.completeBtn}
              onPress={handleComplete}
              isLoading={isPending}
              disabled={isPending}
            />
          </View>

          <DobPickerModal
            visible={dobModalVisible}
            date={selectedDate}
            setDate={setSelectedDate}
            setIsDobSelected={setIsDobSelected}
            onClose={() => setDobModalVisible(false)}
          />
          <LogoutModal
            visible={logoutModalVisible}
            onClose={() => setLogoutModalVisible(false)}
            onConfirm={handleLogout}
          />
        </View>
      }
    />
  );
};

export default CompleteProfile;
