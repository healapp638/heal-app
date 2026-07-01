import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

/* ======================================================
   TYPE AUGMENTATION
====================================================== */
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipLoader?: boolean;
  }
}
import { ApiResponse } from './types';
import { store } from '@/redux/store/store';
import { logout, storeToken } from '@/redux/features/auth/authSlice';
import { getAccessToken } from '@/redux/store/authToken';
import logger from '@/utils/logger';
import { ROUTES } from '@/routerKeys';
import { removeAuthAction, setAuthAction } from '@/actions/authActions';

/* ======================================================
   CONFIG
====================================================== */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

/* ======================================================
   AXIOS INSTANCE
====================================================== */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
  withCredentials: true, // REQUIRED for refresh-token cookies
});

/* ======================================================
   REQUEST INTERCEPTOR (attach access token)
====================================================== */

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  logger.log("token inside api.interceptors.request.use", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/* ======================================================
   REFRESH TOKEN STATE
   ====================================================== */
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const resolveQueue = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const handleUnauthorizedRedirect = async () => {
  store.dispatch(logout());
  try {
    await removeAuthAction();
  } catch (e) {
    logger.error('Error removing auth cookie', e);
  }
  if (typeof window !== 'undefined') {
    window.location.href = ROUTES.WELCOME.WELCOME;
  }
};

/* ======================================================
   REFRESH TOKEN CALL
   ====================================================== */
const refreshAccessToken = async (): Promise<string | null> => {
  const state = store.getState();
  const refreshToken = state.auth.refreshToken;

  if (!refreshToken) return null;

  try {
    const params = new URLSearchParams();
    params.append('refresh_token', refreshToken.replace(/"/g, ''));

    const response = await axios.post<ApiResponse<{ access_token: string }>>(
      `${API_BASE_URL}admin/auth/refresh_token`,
      params,
      { withCredentials: true, skipLoader: true }
    );

    const newToken = response?.data?.data?.access_token;
    if (newToken) {
      store.dispatch(storeToken(newToken));
      try {
        await setAuthAction(newToken);
      } catch (e) {
        logger.error('Error setting auth cookie on refresh', e);
      }
    }

    return newToken || null;
  } catch {
    return null;
  }
};

/* ======================================================
   RESPONSE INTERCEPTOR (401 → refresh → retry + hide loader)
   ====================================================== */
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401) {
      if (!originalRequest?._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push(async (token) => {
              if (!token) {
                await handleUnauthorizedRedirect();
                reject(error);
                return;
              }

              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;

        const newToken = await refreshAccessToken();

        isRefreshing = false;
        resolveQueue(newToken);

        if (!newToken) {
          await handleUnauthorizedRedirect();
          return Promise.reject(error);
        }

        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        // Already retried and still 401
        await handleUnauthorizedRedirect();
      }
    }

    return Promise.reject(error);
  }
);

/* ======================================================
   ERROR NORMALIZER
====================================================== */
export function formatApiError<T>(
  error: AxiosError
): ApiResponse<T> {
  const status = error.response?.status ?? 500;

  const message =
    (error.response?.data as { message?: string })?.message ??
    error.message ??
    'Something went wrong';

  return { status, message };
}

/* ======================================================
   GENERIC API REQUEST (WITH CANCELLATION)
====================================================== */
export async function apiRequest<TResponse, TVariables>(
  config: AxiosRequestConfig<TVariables>
): Promise<ApiResponse<TResponse>> {
  try {
    const response: AxiosResponse<ApiResponse<TResponse>> =
      await api.request(config);

    return {
      status: response.data.status ?? response.status,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err) {
    // Silent abort
    if (
      axios.isAxiosError(err) &&
      err.code === 'ERR_CANCELED'
    ) {
      throw err;
    }

    return formatApiError<TResponse>(err as AxiosError);
  }
}

/* ======================================================
   SHORTCUT HELPERS
====================================================== */
export const apiGet = <T>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
) =>
  apiRequest<T, undefined>({
    url,
    method: 'GET',
    params,
    ...config,
  });

export const apiPost = <T, Body>(
  url: string,
  body?: Body,
  config?: AxiosRequestConfig
) =>
  apiRequest<T, Body>({
    url,
    method: 'POST',
    data: body,
    ...config,
  });

export const apiPut = <T, Body>(
  url: string,
  body?: Body,
  config?: AxiosRequestConfig
) =>
  apiRequest<T, Body>({
    url,
    method: 'PUT',
    data: body,
    ...config,
  });

export const apiDelete = <T>(
  url: string,
  config?: AxiosRequestConfig
) =>
  apiRequest<T, undefined>({
    url,
    method: 'DELETE',
    ...config,
  });
