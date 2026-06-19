import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import userData from "../Reducers/userData";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import tempData from "../Reducers/tempData";

const reducers = combineReducers({
  userData,tempData
});

const omitTokensTransform = createTransform(
  (inboundState: any, key) => {
    if (key === "userData") {
      const { token, refreshToken, ...rest } = inboundState;
      return rest;
    }
    return inboundState;
  },
  (outboundState: any) => outboundState
);

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userData"],
  transforms: [omitTokensTransform],
};

const persistedReducer = persistReducer(persistConfig, reducers);

import { saveTokensToKeychain, clearTokensFromKeychain } from "../../utils/tokenStorage";

const tokenPersistenceMiddleware = (storeApi: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  if (action.type === 'userData/setToken' || action.type === 'userData/setRefreshToken') {
    const state = storeApi.getState().userData;
    const token = state.token;
    const refreshToken = state.refreshToken;
    
    if (!token && !refreshToken) {
      clearTokensFromKeychain();
    } else if (token && refreshToken) {
      saveTokensToKeychain(token, refreshToken);
    }
  }
  
  return result;
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return middlewares.concat(tokenPersistenceMiddleware);
  },
});
store.subscribe(() => {
});
const persistor = persistStore(store);
export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
