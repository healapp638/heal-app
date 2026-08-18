import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import SolidView from '../../../../components/SolidView';
import HeaderCommon from '../../../../components/HeaderCommon';
import SolidText from '../../../../components/SolidText';
import SolidBtn from '../../../../components/SolidBtn';
import SolidInput from '../../../../components/SolidInput';
import { LocalizationContext } from '../../../../localization/localization';
import style from './style';
import useDeleteApi from '../../../../hooks/useDeleteApi';
import { endpoints } from '../../../../api/Services/endpoints';
import AppUtils from '../../../../utils/appUtils';
import AppRoutes from '../../../../routes/RouteKeys/appRoutes';
import { triggerHaptic } from '../../../../hooks/useHaptic';
import {
  clearOnboardingProgress,
  setAuth,
  setToken,
  setRefreshToken,
  setUser,
} from '../../../../redux/Reducers/userData';

const DeleteAccount = () => {
  const { colors } = useTheme() as any;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { localization } = useContext(LocalizationContext) as any;
  const styles = style(colors);

  const [reason, setReason] = useState('');
  const { mutate: deleteAccountApi, isPending } = useDeleteApi();

  const handleDelete = () => {
    if (!reason.trim()) {
      AppUtils.showToast(
        localization.appkeys?.enterReason || 'Please enter a reason for deletion.',
      );
      return;
    }

    Alert.alert(
      localization.appkeys?.deleteAccountTitle || 'Delete Account',
      localization.appkeys?.deleteAccountConfirmMsg ||
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        {
          text: localization.appkeys?.cancelLabel || 'Cancel',
          style: 'cancel',
        },
        {
          text: localization.appkeys?.deleteLabel || 'Delete',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('impactHeavy');
            deleteAccountApi(
              {
                endpoint: endpoints.delete_deactivate,
                data: {
                  reason: reason.trim(),
                  status: 2, // 2 = delete, 3 = deactivate
                },
              },
              {
                onSuccess: () => {
                  triggerHaptic('impactHeavy');
                  AppUtils.showToast(
                    localization.appkeys?.deleteAccountSuccess ||
                    'Your account has been deleted successfully.',
                  );

                  // Perform logout functionality
                  dispatch(clearOnboardingProgress());
                  dispatch(setAuth(false));
                  dispatch(setUser({}));
                  dispatch(setToken(null));
                  dispatch(setRefreshToken(null));

                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: AppRoutes.AuthStack as never,
                        params: {
                          screen: AppRoutes.AccessScreen,
                        },
                      },
                    ],
                  });
                },
                onError: (error: any) => {
                  AppUtils.showToast(
                    error.message ||
                    localization.appkeys?.deleteAccountFailed ||
                    'Failed to delete account. Please try again.',
                  );
                },
              },
            );
          },
        },
      ],
    );
  };

  return (
    <SolidView
      isScrollEnabled
      viewStyle={{
        flex: 1,
      }}
      view={
        <View style={styles.mainContainer}>
          <HeaderCommon
            title={localization.appkeys?.deleteAccountTitle || 'Delete Account'}
            onBackPress={() => navigation.goBack()}
          />

          <SolidText style={styles.warningText}>
            {localization.appkeys?.deleteAccountDescription ||
              'Are you sure you want to delete this Account?'}
          </SolidText>

          <SolidInput
            label={localization.appkeys?.reason || 'Reason'}
            placeholder={localization.appkeys?.reasonPlaceholder || 'Enter reason for deletion'}
            value={reason}
            onChangeText={setReason}
            autoCapitalize="sentences"
          />

          <View style={{ flex: 1 }} />

          <SolidBtn
            titleTxt={localization.appkeys?.deleteLabel || 'Delete'}
            btnStyle={styles.deleteBtn}
            onPress={handleDelete}
            isLoading={isPending}
            disabled={isPending}
          />
        </View>
      }
    />
  );
};

export default DeleteAccount;
