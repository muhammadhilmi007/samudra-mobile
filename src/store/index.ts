// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sttReducer from './slices/sttSlice';
import pickupReducer from './slices/pickupSlice';
import deliveryReducer from './slices/deliverySlice';
import warehouseReducer from './slices/warehouseSlice';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import { apiSlice } from './slices/apiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  stt: sttReducer,
  pickup: pickupReducer,
  delivery: deliveryReducer,
  warehouse: warehouseReducer,
  user: userReducer,
  settings: settingsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;