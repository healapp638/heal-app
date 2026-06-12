import React, { useContext } from 'react';
import {
  ScrollView,
  View,
  ActivityIndicator,
  useWindowDimensions,
  Linking,
} from 'react-native';
import SolidView from '../../../../components/SolidView';
import SolidText from '../../../../components/SolidText';
import HeaderCommon from '../../../../components/HeaderCommon';
import { useTheme } from '@react-navigation/native';
import style from './style';
import { LocalizationContext } from '../../../../localization/localization';
import useGetApi from '../../../../hooks/useGetApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { useSelector } from 'react-redux';
import AppUtils from '../../../../utils/appUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import RenderHTML from 'react-native-render-html';

const linkify = (text: string) => {
  const regex = /(<a[^>]*>[\s\S]*?<\/a>|<[^>]+>)|(https?:\/\/[^\s<>\"]+)/gi;
  return text.replace(regex, (match, tag, url) => {
    if (tag) {
      return match;
    }
    let cleanUrl = url;
    let trailing = '';
    const entityMatch = cleanUrl.match(/(&[a-zA-Z0-9#]+;)$/);
    if (entityMatch) {
      cleanUrl = cleanUrl.slice(0, -entityMatch[0].length);
      trailing = entityMatch[0] + trailing;
    }
    const punctuation = /[.,;:!?]$/;
    const m = cleanUrl.match(punctuation);
    if (m) {
      cleanUrl = cleanUrl.slice(0, -1);
      trailing = m[0] + trailing;
    }
    return `<a href="${cleanUrl}">${cleanUrl}</a>` + trailing;
  });
};

const Terms = () => {
  const { colors } = useTheme() as any;
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);
  const { width } = useWindowDimensions();

  const appLanguage = useSelector((state: any) => state.userData?.appLanguage);
  const { data, isLoading, refetch } = useGetApi(
    endpoints.common_content,
    ['terms', appLanguage],
    {
      type: 'terms_conditions',
      lang: AppUtils.getLanguageCode(appLanguage),
    },
  );
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const content = data?.data?.content || '';
  const parsedContent = linkify(content);

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
    a: {
      color: colors.primary,
      textDecorationLine: 'underline' as any,
    },
  };

  const source = {
    html: parsedContent,
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{ flex: 1 }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon title={localization.appkeys?.termsOfService} />

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
                renderersProps={{
                  a: {
                    onPress: (event: any, href: string) => {
                      if (href) {
                        Linking.openURL(href).catch(err =>
                          console.error('Failed to open link:', err),
                        );
                      }
                    },
                  },
                }}
              />
            </View>
          )}
        </View>
      }
    />
  );
};

export default Terms;
