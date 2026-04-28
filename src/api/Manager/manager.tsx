import { create, ApiResponse } from 'apisauce';
import { config, Mode } from '../../../config';
import getEnvVars from '../../../env';
import AppUtils from '../../utils/appUtils';
import { store } from '../../redux/Store/store';
import {
  setToken,
  setAuth,
  setUser,
  setRefreshToken,
} from '../../redux/Reducers/userData';
import { endpoints } from '../Services/endpoints';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from '../../utils/navigationRef';
import { CommonActions } from '@react-navigation/native';
import AppRoutes from '../../routes/RouteKeys/appRoutes';
import { Alert } from 'react-native';

// Define the type for the API response
type ResponseType = ApiResponse<any, any>;

const api = create({
  baseURL: getEnvVars().apiUrl,
  timeout: 30000,
});

api.addRequestTransform((request: any) => {
  const token = store.getState().userData.token;
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
});

// ---------- Refresh Token Logic ----------

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = store.getState().userData.refreshToken;

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response: any = await api.post(endpoints.refresh_token, {
    refresh_token: refreshToken,
  });

  if (response?.data?.data?.access_token) {
    const newToken = response?.data?.data?.access_token;
    const newRefreshToken = response?.data?.data?.refresh_token;
    store.dispatch(setToken(newToken));
    if (newRefreshToken) {
      store.dispatch(setRefreshToken(newRefreshToken));
    }
    return newToken;
  }

  throw new Error(response.data?.message || 'Token refresh failed');
};

const logoutUser = async (showToast = true) => {
  const user = store.getState().userData.user as any;
  try {
    if (user?._id) {
      await messaging().unsubscribeFromTopic(user._id);
    }
  } catch (error) {
    console.log('Error unsubscribing from FCM topic', error);
  }
  store.dispatch(setUser({}));
  store.dispatch(setAuth(false));
  store.dispatch(setToken(null));
  store.dispatch(setRefreshToken(null));
  showToast && AppUtils.showToast('Session expired. Please log in again.');
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: AppRoutes.AuthStack,
            state: {
              index: 0,
              routes: [{ name: AppRoutes.Welcome }],
            },
          },
        ],
      }),
    );
  }
};

api.addResponseTransform(async (response: any) => {
  // console.log('response.status', response.status);
  if (response.status === 401) {
    const originalRequest = response.config;

    // Skip refresh for the refresh_token endpoint itself to avoid infinite loop
    if (originalRequest?.url?.includes(endpoints.refresh_token)) {
      logoutUser();
      return;
    }

    if (isRefreshing) {
      // Queue this request until the token is refreshed
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        // Retry the original request with the new token
        const retryResponse = await api.any({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        Object.assign(response, retryResponse);
      } catch (error) {
        logoutUser();
      }
      return;
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      processQueue(null, newToken);

      // Retry the original request with the new token
      const retryResponse = await api.any({
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
      Object.assign(response, retryResponse);
    } catch (error) {
      processQueue(error, null);
      logoutUser();
    } finally {
      isRefreshing = false;
    }
  } else if (response.status === 409) {
    AppUtils.showToast('Your account is deactivated by admin!!');
    logoutUser(false);
  } else if (response.status === 410) {
    AppUtils.showToast('Your account is deleted by admin!!');
    logoutUser(false);
  }
});

// Define the type for the monitor function
type MonitorFunction = (response: ResponseType) => void;
const naviMonitor: MonitorFunction = response => {};

if (config.mode === Mode.DEV) {
  api.addMonitor(naviMonitor);
}

export default api;
