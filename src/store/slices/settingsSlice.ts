// src/store/slices/settingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../../constants/config';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  pushNotifications: boolean;
  emailNotifications: boolean;
  locationTracking: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: 'system',
  pushNotifications: true,
  emailNotifications: true,
  locationTracking: true,
  autoRefresh: true,
  refreshInterval: 60, // 1 minute
  isLoading: false,
  error: null,
};

// Load settings from AsyncStorage
export const loadSettings = createAsyncThunk(
  'settings/load',
  async (_, { rejectWithValue }) => {
    try {
      const settingsData = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
      
      if (settingsData) {
        return JSON.parse(settingsData);
      }
      
      return initialState;
    } catch (error) {
      console.error('Error loading settings:', error);
      return rejectWithValue('Failed to load settings');
    }
  }
);

// Save settings to AsyncStorage
export const saveSettings = createAsyncThunk(
  'settings/save',
  async (settings: Partial<SettingsState>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { settings: SettingsState };
      const updatedSettings = { ...state.settings, ...settings };
      
      // Remove loading and error state before saving
      const { isLoading, error, ...settingsToSave } = updatedSettings;
      
      await AsyncStorage.setItem(
        CONFIG.STORAGE_KEYS.SETTINGS,
        JSON.stringify(settingsToSave)
      );
      
      return settings;
    } catch (error) {
      console.error('Error saving settings:', error);
      return rejectWithValue('Failed to save settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Update theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    // Update push notifications
    setPushNotifications: (state, action: PayloadAction<boolean>) => {
      state.pushNotifications = action.payload;
    },
    
    // Update email notifications
    setEmailNotifications: (state, action: PayloadAction<boolean>) => {
      state.emailNotifications = action.payload;
    },
    
    // Update location tracking
    setLocationTracking: (state, action: PayloadAction<boolean>) => {
      state.locationTracking = action.payload;
    },
    
    // Update auto refresh
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    
    // Update refresh interval
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    
    // Clear error
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load settings
    builder.addCase(loadSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loadSettings.fulfilled, (state, action: PayloadAction<Partial<SettingsState>>) => {
      state.isLoading = false;
      
      // Update state with loaded settings
      Object.assign(state, action.payload);
      
      state.error = null;
    });
    builder.addCase(loadSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Save settings
    builder.addCase(saveSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(saveSettings.fulfilled, (state, action: PayloadAction<Partial<SettingsState>>) => {
      state.isLoading = false;
      
      // Update state with saved settings
      Object.assign(state, action.payload);
      
      state.error = null;
    });
    builder.addCase(saveSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setTheme,
  setPushNotifications,
  setEmailNotifications,
  setLocationTracking,
  setAutoRefresh,
  setRefreshInterval,
  clearSettingsError,
} = settingsSlice.actions;

export default settingsSlice.reducer;