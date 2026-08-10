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

// Define the type for the API response
type ResponseType = ApiResponse<any, any>;

const api = create({
  baseURL: getEnvVars().apiUrl,
  timeout: 30000,
});

api.addRequestTransform((request: any) => {
  // console.log(`[API Request] ${request.method?.toUpperCase()} ${request.url}`);
  const token = store.getState().userData.token;
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
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

let isLoggingOut = false;

// Deferred to a microtask: this module is reached via a circular import
// (redux/Store/store.tsx -> Reducers/userData.tsx -> this file -> redux/Store/store.tsx),
// so `store` is still undefined if subscribed to synchronously here. By the time this
// microtask runs, the whole synchronous require chain -- including store.tsx itself --
// has finished, so `store` is safely defined.
Promise.resolve().then(() => {
  store.subscribe(() => {
    const currentToken = store.getState().userData.token;
    if (currentToken) {
      isLoggingOut = false;
    }
  });
});

const logoutUser = async (
  toastMessage:
    | string
    | boolean
    | null = 'Session expired. Please log in again.',
) => {
  if (isLoggingOut) {
    return;
  }
  const token = store.getState().userData.token;
  if (!token) {
    return;
  }
  isLoggingOut = true;
  const user = store.getState().userData.user as any;

  // Clear auth state synchronously to prevent concurrent API response triggers from proceeding
  store.dispatch(setAuth(false));
  store.dispatch(setToken(null));
  store.dispatch(setRefreshToken(null));
  store.dispatch(setUser({}));

  try {
    if (user?._id) {
      await messaging().unsubscribeFromTopic(user._id);
    }
  } catch (error) {
    console.log('Error unsubscribing from FCM topic', error);
  }

  if (toastMessage && typeof toastMessage === 'string') {
    AppUtils.showToast(toastMessage);
  } else if (toastMessage === true) {
    AppUtils.showToast('Session expired. Please log in again.');
  }

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

api.axiosInstance.interceptors.response.use(
  response => {
    // console.log(
    //   `[API Success] ${response.config?.method?.toUpperCase()} ${
    //     response.config?.url
    //   } - Status: ${response.status}`,
    // );
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    const response = error.response;

    if (response) {
      // console.log(
      //   `[API Error] ${originalRequest?.method?.toUpperCase()} ${
      //     originalRequest?.url
      //   } - Status: ${response.status}`,
      // );
      if (response.status === 401) {
        // Skip refresh for the refresh_token endpoint itself to avoid infinite loop
        if (originalRequest?.url?.includes(endpoints.refresh_token)) {
          logoutUser();
          return Promise.reject(error);
        }

        // If we have already retried this request once and it still fails, log out to prevent infinite loops
        if (originalRequest?._retry) {
          logoutUser();
          return Promise.reject(error);
        }
        if (originalRequest) {
          originalRequest._retry = true;
        }

        if (isRefreshing) {
          try {
            const newToken = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            // Update auth header and retry with the underlying axiosInstance
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api.axiosInstance(originalRequest);
          } catch (queueError) {
            logoutUser();
            return Promise.reject(queueError);
          }
        }

        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);

          // Retry the original request with the new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api.axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          logoutUser();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (response.status === 409) {
        logoutUser('Your account is deactivated by admin!!');
      } else if (response.status === 410) {
        logoutUser('Your account is deleted by admin!!');
      }
    } else {
      console.log(
        `[API Network/Server Error] ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        } - Error: ${error.message}`,
      );
    }

    return Promise.reject(error);
  },
);

// Define the type for the monitor function
type MonitorFunction = (response: ResponseType) => void;
const naviMonitor: MonitorFunction = _response => {};

if (config.mode === Mode.DEV) {
  api.addMonitor(naviMonitor);
}

export default api;
