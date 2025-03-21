// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/endpoints/api';
import { User } from '../../types/models/auth';

interface UserState {
  currentUser: User | null;
  userList: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  userList: [],
  isLoading: false,
  error: null,
};

// Get current user profile
export const getCurrentUser = createAsyncThunk(
  'user/getCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to get user profile');
      }
      return rejectWithValue('Failed to get user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update profile');
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);

// Update profile image
export const updateProfileImage = createAsyncThunk(
  'user/updateProfileImage',
  async (imageData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/profile-image', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update profile image');
      }
      return rejectWithValue('Failed to update profile image');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (
    passwordData: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to change password');
      }
      return rejectWithValue('Failed to change password');
    }
  }
);

// Get branch users (for managers)
export const getBranchUsers = createAsyncThunk(
  'user/getBranchUsers',
  async (branchId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/branch/${branchId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to get branch users');
      }
      return rejectWithValue('Failed to get branch users');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUserData: (state) => {
      state.currentUser = null;
      state.userList = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update profile image
    builder.addCase(updateProfileImage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    });
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Change password
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get branch users
    builder.addCase(getBranchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getBranchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.userList = action.payload;
      state.error = null;
    });
    builder.addCase(getBranchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserError, setCurrentUser, clearUserData } = userSlice.actions;
export default userSlice.reducer;