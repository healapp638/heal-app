import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
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
import style from './style';
import HomeHeader from '../../../../components/HomeHeader';

const EditProfile = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  // Form State
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('Johnsmith911@gmail.com');
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    isoCode: string;
  } | null>({ name: 'France', isoCode: 'FR' });
  const [selectedDate, setSelectedDate] = useState<DobDateParts>({
    month: 'August',
    day: '31',
    year: '1995',
  });

  // Modal State
  const [isDobSelected, setIsDobSelected] = useState(true);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [countryInfoVisible, setCountryInfoVisible] = useState(false);

  const getLocalizedMonth = (monthName: string) => {
    const monthMap: { [key: string]: string } = {
      January: localization.appkeys?.monthJan,
      February: localization.appkeys?.monthFeb,
      March: localization.appkeys?.monthMar,
      April: localization.appkeys?.monthApr,
      May: localization.appkeys?.monthMay,
      June: localization.appkeys?.monthJun,
      July: localization.appkeys?.monthJul,
      August: localization.appkeys?.monthAug,
      September: localization.appkeys?.monthSep,
      October: localization.appkeys?.monthOct,
      November: localization.appkeys?.monthNov,
      December: localization.appkeys?.monthDec,
    };
    return monthMap[monthName] || monthName;
  };

  const dobDisplay = isDobSelected
    ? `${selectedDate.day} - ${getLocalizedMonth(selectedDate.month)} - ${
        selectedDate.year
      }`
    : localization.appkeys?.selectBirthDate;

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
              <Image source={images.avatar} style={styles.profileImage} />
              <TouchableOpacity style={styles.editIconContainer}>
                <Image
                  source={images.edit}
                  style={[styles.editIcon, { tintColor: colors.white }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
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
              onPress={() => navigation.goBack()}
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
        </View>
      }
    />
  );
};

export default EditProfile;
