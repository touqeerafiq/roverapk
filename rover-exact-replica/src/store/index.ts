import {configureStore, combineReducers} from '@reduxjs/toolkit';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import authReducer from './slices/authSlice';
import petsReducer from './slices/petsSlice';
import bookingsReducer from './slices/bookingsSlice';
import messagesReducer from './slices/messagesSlice';
import providersReducer from './slices/providersSlice';
import notificationsReducer from './slices/notificationsSlice';
import paymentsReducer from './slices/paymentsSlice';
import appReducer from './slices/appSlice';
import locationReducer from './slices/locationSlice';

// Configure persistence
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'pets', 'app'], // Only persist these reducers
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  pets: petsReducer,
  bookings: bookingsReducer,
  messages: messagesReducer,
  providers: providersReducer,
  notifications: notificationsReducer,
  payments: paymentsReducer,
  app: appReducer,
  location: locationReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;