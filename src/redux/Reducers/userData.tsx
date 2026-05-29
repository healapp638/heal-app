import { createSlice } from '@reduxjs/toolkit';
import { strings } from '../../constants/variables';

const initialOnboardingState = {
  hasStarted: false,
  isCompleted: false,
  currentScreen: '',
  answers: {
    hearAboutUs: null,
    feelThatWay: null,
    howFellingLately: null,
    likeToFellMore: null,
    timeYouCommit: null,
    goalStartWith: null,
    readyToStart: null,
    fullName: null,
    helpFeelBetter: null,
    stopFeelBetter: null,
    privacyAccepted: false,
  },
};

const getInitialOnboardingState = () => ({
  hasStarted: initialOnboardingState.hasStarted,
  isCompleted: initialOnboardingState.isCompleted,
  currentScreen: initialOnboardingState.currentScreen,
  answers: {
    ...initialOnboardingState.answers,
  },
});

const ensureOnboardingState = (state: any) => {
  if (!state.onboarding) {
    state.onboarding = getInitialOnboardingState();
    return;
  }

  if (typeof state.onboarding.isCompleted !== 'boolean') {
    state.onboarding.isCompleted = false;
  }

  if (!state.onboarding.answers) {
    state.onboarding.answers = {
      ...initialOnboardingState.answers,
    };
    return;
  }

  state.onboarding.answers = {
    ...initialOnboardingState.answers,
    ...state.onboarding.answers,
  };
};

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    auth: false,
    token: '',
    refreshToken: '',
    user: {},
    appLanguage: strings.english,
    fontScaling: 1.0,
    onboarding: initialOnboardingState,
    biometric: false,
    email: '',
    password: '',
    userType: 2,
    lastLoginType: '', // 'manual', 'google', 'apple'
    socialEmail: '',
    rememberMe: false,
  },
  reducers: {
    setBiometric: (state, action) => {
      state.biometric = !!action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setLastLoginType: (state, action) => {
      state.lastLoginType = action.payload;
    },
    setSocialEmail: (state, action) => {
      state.socialEmail = action.payload;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setFontScaling: (state, action) => {
      state.fontScaling = action.payload;
    },
    SetAppLanguage: (state, action) => {
      state.appLanguage = action.payload;
    },
    setOnboardingCurrentScreen: (state, action) => {
      ensureOnboardingState(state);
      state.onboarding.hasStarted = true;
      state.onboarding.currentScreen = action.payload;
    },
    setOnboardingAnswer: (state, action) => {
      ensureOnboardingState(state);
      const { key, value } = action.payload || {};
      if (!key) return;
      state.onboarding.hasStarted = true;
      if (!(key in state.onboarding.answers)) return;
      (state.onboarding.answers as any)[key] = value;
    },
    setOnboardingCompleted: (state, action) => {
      ensureOnboardingState(state);
      state.onboarding.hasStarted = true;
      state.onboarding.isCompleted = action.payload;
    },
    clearOnboardingProgress: state => {
      state.onboarding = getInitialOnboardingState();
    },
    setOnboardingAnswers: (state, action) => {
      ensureOnboardingState(state);
      state.onboarding.answers = {
        ...state.onboarding.answers,
        ...action.payload,
      };
      state.onboarding.hasStarted = true;
    },
  },
});
export const {
  setAuth,
  setUser,
  setToken,
  setRefreshToken,
  SetAppLanguage,
  setFontScaling,
  setOnboardingCurrentScreen,
  setOnboardingAnswer,
  setOnboardingAnswers,
  setOnboardingCompleted,
  clearOnboardingProgress,
  setBiometric,
  setEmail,
  setPassword,
  setUserType,
  setLastLoginType,
  setSocialEmail,
  setRememberMe,
} = userDataSlice.actions;

import api from '../../api/Manager/manager';
import { endpoints } from '../../api/Services/endpoints';
import { setLoader } from './tempData';

export const getUserDetail =
  (showLoader = false) =>
  async (dispatch: any) => {
    try {
      showLoader && dispatch(setLoader(true));
      const response: any = await api.get(endpoints.user_details);
      if (response?.ok) {
        dispatch(setUser(response?.data?.data));
      } else {
        // dispatch(setUser({}));
      }
    } catch (error) {
      console.log('getUserDetail', error);
    } finally {
      dispatch(setLoader(false));
    }
  };

export default userDataSlice.reducer;
