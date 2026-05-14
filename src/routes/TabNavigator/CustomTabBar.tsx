import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SolidText from '../../components/SolidText';
import AppFonts from '../../constants/fonts';
import AppUtils from '../../utils/appUtils';
import AppRoutes from '../RouteKeys/appRoutes';
import { triggerHaptic } from '../../hooks/useHaptic';
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors, images } = useTheme() as any;
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['bottom']} style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const getIcon = (name: string) => {
            switch (name) {
              case AppRoutes.Home:
                return images.home;
              case AppRoutes.Challenges:
                return images.challenge;
              case AppRoutes.Modules:
                return images.module;
              case AppRoutes.Journal:
                return images.journal;
              case AppRoutes.Settings:
                return images.setting;
              default:
                return images.home;
            }
          };
          return (
            <TouchableOpacity
              key={route.key}
              onPress={(...args: any) => {
                return (onPress as any)(...args);
              }}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && {
                    backgroundColor: `${colors.primary}1A`,
                  },
                  // Light pink background
                  route.name === AppRoutes.Challenges
                    ? {
                        width: 74,
                      }
                    : {
                        width: 62,
                      },
                ]}
              >
                <Image
                  source={getIcon(route.name)}
                  style={[
                    styles.icon,
                    {
                      tintColor: isFocused ? colors.primary : '#A19489',
                    },
                  ]}
                  resizeMode="contain"
                />
                <SolidText
                  maxFontScale={1}
                  numberOfLines={1}
                  style={[
                    styles.label,
                    {
                      color: isFocused ? colors.primary : '#A19489',
                    },
                  ]}
                >
                  {label}
                </SolidText>
              </View>
            </TouchableOpacity>
          );
        })}
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? -20 : 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 4,
    overflow: 'hidden', // Fix for Android borderRadius
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    borderRadius: 16,
    marginBottom: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // Explicit default background
    overflow: 'hidden', // Ensure clipping on Android
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: AppUtils.fontSize(11),
    fontFamily: AppFonts.regular,
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: 4,
  },
});
export default CustomTabBar;
