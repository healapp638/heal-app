import React, { useContext, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useTheme, useRoute } from '@react-navigation/native';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import { LocalizationContext } from '../../../../localization/localization';
import { useDispatch } from 'react-redux';
import {
  SetAppLanguage,
  getUserDetail,
} from '../../../../redux/Reducers/userData';
import style from './style';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import { triggerHaptic } from '../../../../hooks/useHaptic';
const SelectLanguage = () => {
  const { colors, images } = useTheme() as any;
  const navigation = useNavigation();
  const { appLanguage, setAppLanguage, localization } = useContext(
    LocalizationContext,
  ) as any;
  const dispatch = useDispatch();
  const route = useRoute() as any;
  const styles = style(colors);
  const { mutate: updateProfileApi } = usePostApi();
  const [selectedLang, setSelectedLang] = useState(appLanguage);
  const languages = [
    {
      id: '1',
      name: 'English',
      flag: images.eng,
      key: 'English',
    },
    {
      id: '2',
      name: 'Español',
      flag: images.spain,
      key: 'Spanish',
    },
    {
      id: '3',
      name: 'Français',
      flag: images.france,
      key: 'French',
    },
    {
      id: '4',
      name: 'Deutsch',
      flag: images.germany,
      key: 'German',
    },
    {
      id: '5',
      name: 'Русский',
      flag: images.russia,
      key: 'Russian',
    },
    {
      id: '6',
      name: 'Português',
      flag: images.portugal,
      key: 'Portuguese',
    },
    {
      id: '7',
      name: 'Italiano',
      flag: images.italy,
      key: 'Italian',
    },
  ];
  const handleSelect = () => {
    dispatch(SetAppLanguage(selectedLang));
    setAppLanguage(selectedLang);
    if (route?.params?.from === 'Settings') {
      updateProfileApi(
        {
          endpoint: endpoints.update_profile,
          data: {
            language: AppUtils.getLanguageCode(selectedLang),
          },
        },
        {
          onSuccess: () => {
            dispatch(getUserDetail() as any);
          },
        },
      );
    }
    navigation.goBack();
  };
  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedLang === item.key;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => {
          triggerHaptic('impactHeavy');
          return setSelectedLang(item.key);
        }}
        activeOpacity={0.7}
      >
        <Image source={item.flag} style={styles.flag} resizeMode="contain" />
        <SolidText style={styles.langName}>{item.name}</SolidText>
        {isSelected && (
          <Image
            source={images.tick}
            style={styles.checkIcon}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <SolidView
      viewStyle={{
        flex: 1,
      }}
      isScrollEnabled
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.selectLanguage}
            onBackPress={() => navigation.goBack()}
          />

          <SolidText style={styles.subtitle}>
            {localization.appkeys?.choosePreferredLang}
          </SolidText>

          <FlatList
            data={languages}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 4,
            }}
          />

          <SolidBtn
            titleTxt={localization.appkeys?.selectLanguage}
            btnStyle={styles.footerBtn}
            onPress={(...args: any) => {
              return (handleSelect as any)(...args);
            }}
          />
        </View>
      }
    />
  );
};
export default SelectLanguage;
