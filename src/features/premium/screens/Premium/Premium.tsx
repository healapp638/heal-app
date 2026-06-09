import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Superwall, {
  PaywallPresentationHandler,
} from '@superwall/react-native-superwall';
import SolidView from '../../../../components/SolidView';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import usePostApi from '../../../../hooks/usePostApi';
import { endpoints } from '../../../../api/Services/endpoints';
import { useSubscription } from '../../../../hooks/useSubscription';

const Premium = () => {
  const navigation = useNavigation();
  const { colors } = useTheme() as any;
  const { mutate: syncPurchaseApi } = usePostApi();
  const { isPremium } = useSubscription();

  useEffect(() => {
    let active = true;

    const presentSuperwallPaywall = async () => {
      try {
        console.log('[Superwall] Registering PremiumScreenOpened placement...');

        const handler = new PaywallPresentationHandler();

        handler.onPresent(info => {
          console.log('[Superwall] Paywall presented:', info);
        });

        handler.onDismiss((info, result) => {
          console.log('[Superwall] Paywall dismissed:', result);
          if (active) {
            if (result.type === 'purchased' || result.type === 'restored') {
              // Sync purchase with server
              syncPurchaseApi({
                endpoint: endpoints.sync_purchase,
                data: {},
              });

              // Navigate into the main app
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.BottomTab as never,
                  },
                ],
              });
            } else {
              // User cancelled or declined, go back to previous screen
              navigation.goBack();
            }
          }
        });

        handler.onSkip(reason => {
          console.log('[Superwall] Paywall skipped. Reason:', reason);
          if (active) {
            if (isPremium) {
              // User is already premium, redirect them to the main app
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: AppRoutes.BottomTab as never,
                  },
                ],
              });
            } else {
              navigation.goBack();
            }
          }
        });

        handler.onError(error => {
          console.error('[Superwall] Paywall presentation error:', error);
          if (active) {
            navigation.goBack();
          }
        });

        await Superwall.shared.register({
          placement: 'PremiumScreenOpened',
          handler: handler,
        });
      } catch (error) {
        console.error('[Superwall] Exception registering placement:', error);
        if (active) {
          navigation.goBack();
        }
      }
    };

    presentSuperwallPaywall();

    return () => {
      active = false;
    };
  }, [navigation]);

  return (
    <SolidView
      view={
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.brown || '#8B4513'} />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Premium;
