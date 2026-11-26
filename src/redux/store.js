import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// The ESM build is required: "redux-persist/lib/storage" breaks under Vite.
import storage from 'redux-persist/es/storage';

import { authReducer } from './auth/auth-slice';
import { financeReducer } from './finance/finance-slice';
import { globalReducer } from './global/global-slice';

// Only the token is saved to localStorage (TASK-5).
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    finance: financeReducer,
    global: globalReducer,
    // Agreed keys for the other slices: statistics, currency
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
