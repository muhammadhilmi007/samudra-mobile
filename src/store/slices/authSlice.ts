// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../../constants/config';
import { api } from '../../api/endpoints/api';
import { User, AuthState, LoginCredentials } from '../../types/models/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      // Save to async storage
      await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      return { token, user };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // Clear async storage
    await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
    return true;
  } catch (error) {
    return rejectWithValue('Failed to logout. Please try again.');
  }
});

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return { token: null, user: null };

      const userDataStr = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
      const user = userDataStr ? JSON.parse(userDataStr) : null;

      return { token, user };
    } catch (error) {
      return rejectWithValue('Failed to retrieve auth status.');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Check auth status
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      checkAuthStatus.fulfilled,
      (state, action: PayloadAction<{ token: string | null; user: User | null }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      }
    );
    builder.addCase(checkAuthStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;