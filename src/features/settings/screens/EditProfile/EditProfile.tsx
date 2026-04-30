import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image, Platform, Alert } from 'react-native';
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
import AgeRestrictionModal from '../../../../modals/AgeRestrictionModal';
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';
import CustomImagePickerModal from '../../../../modals/CustomImagePickerModal';
import { useDispatch, useSelector } from 'react-redux';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import {
  getLocalizedMonthName,
  getLocalizedMonths,
  monthToNumber,
} from '../../../auth/utils/SignUp/signUpHelpers';
import { isAtLeast13YearsOld } from '../../../auth/utils/SignUp/signUpValidation';
import { getUserDetail, setUser } from '../../../../redux/Reducers/userData';
import getEnvVars from '../../../../../env';

const EditProfile = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const user = useSelector((state: any) => state.userData?.user);
  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const { mutate: updateProfileApi, isPending } = usePostApi();
  const { mutate: uploadFileApi, isPending: isUploading } = usePostApi();

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    isoCode: string;
  } | null>(user?.country ? { name: user.country, isoCode: '' } : null);

  // Initialize DOB from user data
  const initialDob = user?.dob
    ? (() => {
        const [year, month, dayWithTime] = user.dob.split('-');
        const day = dayWithTime ? dayWithTime.split('T')[0] : '01';
        const monthName = Object.keys(monthToNumber).find(
          key => monthToNumber[key] === month,
        );
        return {
          year: year || '2000',
          day: day.padStart(2, '0'),
          month: monthName || 'January',
        };
      })()
    : {
        month: 'January',
        day: '01',
        year: '2000',
      };

  const [selectedDate, setSelectedDate] = useState<DobDateParts>(initialDob);

  // Modal State
  const [isDobSelected, setIsDobSelected] = useState(!!user?.dob);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [countryInfoVisible, setCountryInfoVisible] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);

  const dobDisplay = isDobSelected
    ? `${selectedDate.day} - ${getLocalizedMonthName(
        selectedDate.month,
        localization,
      )} - ${selectedDate.year}`
    : localization.appkeys?.selectBirthDate;

  const handleImageSelect = (image: any) => {
    setProfilePic(image.path); // Set local preview immediately
    const formData = new FormData();
    const filePath =
      Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;
    formData.append('file', {
      uri: Platform.OS === 'ios' ? `file://${filePath}` : filePath,
      type: image.mime,
      name: image.filename || `profile_${Date.now()}.jpg`,
    } as any);

    uploadFileApi(
      {
        endpoint: endpoints.upload_file,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      {
        onSuccess: (response: any) => {
          console.log('response', response);

          if (response?.data[0]) {
            setProfilePicUrl(response?.data[0]);
          }
        },
        onError: error => {
          console.log('upload error', error);
          AppUtils.showToast(error.message || 'Failed to upload image');
        },
      },
    );
  };

  const handleSave = () => {
    if (!fullName?.trim()) {
      AppUtils.showToast(
        localization.appkeys?.enterNamePlaceholder || 'Please enter full name',
      );
      return;
    }
    if (!selectedCountry) {
      AppUtils.showToast(
        localization.appkeys?.selectCountryMsg || 'Please select your country',
      );
      return;
    }
    if (!isDobSelected) {
      AppUtils.showToast(
        localization.appkeys?.selectDobMsg || 'Please select date of birth',
      );
      return;
    }

    const localizedMonths = getLocalizedMonths(localization);
    if (!isAtLeast13YearsOld(selectedDate, localizedMonths)) {
      setAgeModalVisible(true);
      return;
    }

    const formattedDob = `${selectedDate.year}-${
      monthToNumber[selectedDate.month]
    }-${selectedDate.day}`;

    const payload = {
      language: appLanguage,
      profilePic: profilePicUrl,
      dob: formattedDob,
      country: selectedCountry.name,
      fullName: fullName,
    };

    updateProfileApi(
      { endpoint: endpoints.update_profile, data: payload },
      {
        onSuccess: (response: any) => {
          dispatch(getUserDetail());
          AppUtils.showToast(
            localization.appkeys?.profileUpdated ||
              'Profile updated successfully',
          );
          dispatch(setUser(response?.data));
          navigation.goBack();
        },
        onError: error => {
          AppUtils.showToast(error.message || 'Failed to update profile');
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
            title={localization.appkeys?.editProfile || 'Edit Profile'}
            rightIcon={images.crown}
          />

          <HomeHeader
            viewStyle={{ marginTop: -8, marginBottom: 26 }}
            showCrown={false}
            showStreak={false}
            onCrownPress={() => {}}
            userName={
              localization.appkeys?.personalInfo || 'Personal Information'
            }
            safeSpaceLabel={
              localization.appkeys?.manageYourInfo || 'Manage your information'
            }
            subStyle={{ marginTop: 5 }}
          />

          {/* Profile Picture */}
          <View style={styles.profilePicContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : {
                        uri: getEnvVars()?.fileUrl + user?.profilePic,
                      }
                }
                style={styles.profileImage}
              />
              <TouchableOpacity
                hitSlop={50}
                style={styles.editIconContainer}
                onPress={() => setImagePickerVisible(true)}
              >
                <Image
                  source={images.edit}
                  style={[styles.editIcon, { tintColor: colors.white }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setImagePickerVisible(true)}
            >
              <SolidText style={styles.changePictureText}>
                {localization.appkeys?.changePicture || 'Change Picture'}
              </SolidText>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
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
              editable={false}
              mainStyle={{ opacity: 0.7 }}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setDobModalVisible(true)}
            >
              <SolidInput
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

            <SolidBtn
              titleTxt={localization.appkeys?.saveChanges || 'Save changes'}
              btnStyle={styles.saveBtn}
              onPress={handleSave}
              isLoading={isPending || isUploading}
              disabled={isPending || isUploading}
            />
          </View>

          {/* Modals */}
          <DobPickerModal
            visible={dobModalVisible}
            date={selectedDate}
            setDate={setSelectedDate}
            setIsDobSelected={setIsDobSelected}
            onClose={() => setDobModalVisible(false)}
          />

          <CustomImagePickerModal
            visible={imagePickerVisible}
            attachments={handleImageSelect}
            pressHandler={() => setImagePickerVisible(false)}
          />

          <AgeRestrictionModal
            visible={ageModalVisible}
            onClose={() => setAgeModalVisible(false)}
            title={localization.appkeys?.sorryTitle || "We're sorry!"}
            message={
              localization.appkeys?.ageRequirementMsg ||
              'You must be at least 13 years old to use HEAL.'
            }
          />
        </View>
      }
    />
  );
};

export default EditProfile;
