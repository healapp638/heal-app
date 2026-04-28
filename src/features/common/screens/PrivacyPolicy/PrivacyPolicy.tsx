import React, { useCallback, useContext } from 'react';
import HeaderCommon from '../../../../components/HeaderCommon';
import style from './style';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { LocalizationContext } from '../../../../localization/localization';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import AppUtils from '../../../../utils/appUtils';
import RenderHTML from 'react-native-render-html';
import { useQueryClient } from '@tanstack/react-query';

const PrivacyPolicy = () => {
  const queryClient = useQueryClient();
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const { width } = useWindowDimensions();

  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const { data, isLoading, refetch } = useGetApi(
    endpoints.common_content,
    ['privacy', appLanguage],
    {
      type: 'privacy_policy',
      lang: AppUtils.getLanguageCode(appLanguage),
    },
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const content = data?.data?.content || '';

  const tagsStyles = {
    body: {
      color: colors.brown,
      fontSize: 14,
      lineHeight: 20,
    },
    p: {
      color: colors.brown,
      fontSize: 14,
      marginBottom: 10,
      lineHeight: 20,
    },
    strong: {
      color: colors.brown,
      fontWeight: 'bold' as any,
    },
  };

  const source = {
    html: content,
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.privacyPolicy} />

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 50 }}
            />
          ) : (
            <View style={{ marginTop: 0, flex: 1 }}>
              <RenderHTML
                contentWidth={width}
                source={source}
                tagsStyles={tagsStyles}
              />
            </View>
          )}
        </View>
      }
    />
  );
};

export default PrivacyPolicy;
