// src/store/slices/pickupSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/endpoints/api';
import { PickupRequest, Pickup, PickupState, PickupRequestParams } from '../../types/models/pickup';

const initialState: PickupState = {
  pickupRequests: [],
  pickups: [],
  currentPickup: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getPickupRequests = createAsyncThunk(
  'pickup/getRequests',
  async (params: PickupRequestParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/pickup-requests', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to get pickup requests. Please try again.');
    }
  }
);

export const getPickups = createAsyncThunk(
  'pickup/getPickups',
  async (params: PickupRequestParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/pickups', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to get pickups. Please try again.');
    }
  }
);

export const updatePickupRequestStatus = createAsyncThunk(
  'pickup/updateRequestStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pickup-requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update request status. Please try again.');
    }
  }
);

export const createPickup = createAsyncThunk(
  'pickup/create',
  async (pickupData: Partial<Pickup>, { rejectWithValue }) => {
    try {
      const response = await api.post('/pickups', pickupData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to create pickup. Please try again.');
    }
  }
);

export const updatePickup = createAsyncThunk(
  'pickup/update',
  async ({ id, data }: { id: string; data: Partial<Pickup> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pickups/${id}`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update pickup. Please try again.');
    }
  }
);

export const completePickup = createAsyncThunk(
  'pickup/complete',
  async ({ id, waktuPulang }: { id: string; waktuPulang: Date }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pickups/${id}/complete`, { waktuPulang });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to complete pickup. Please try again.');
    }
  }
);

// Pickup slice
const pickupSlice = createSlice({
  name: 'pickup',
  initialState,
  reducers: {
    clearPickupError: (state) => {
      state.error = null;
    },
    setCurrentPickup: (state, action: PayloadAction<Pickup>) => {
      state.currentPickup = action.payload;
    },
    clearCurrentPickup: (state) => {
      state.currentPickup = null;
    },
  },
  extraReducers: (builder) => {
    // Get pickup requests
    builder.addCase(getPickupRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getPickupRequests.fulfilled, (state, action: PayloadAction<PickupRequest[]>) => {
      state.isLoading = false;
      state.pickupRequests = action.payload;
      state.error = null;
    });
    builder.addCase(getPickupRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get pickups
    builder.addCase(getPickups.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getPickups.fulfilled, (state, action: PayloadAction<Pickup[]>) => {
      state.isLoading = false;
      state.pickups = action.payload;
      state.error = null;
    });
    builder.addCase(getPickups.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update pickup request status
    builder.addCase(updatePickupRequestStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePickupRequestStatus.fulfilled, (state, action: PayloadAction<PickupRequest>) => {
      state.isLoading = false;
      const index = state.pickupRequests.findIndex(req => req._id === action.payload._id);
      if (index !== -1) {
        state.pickupRequests[index] = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updatePickupRequestStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create pickup
    builder.addCase(createPickup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createPickup.fulfilled, (state, action: PayloadAction<Pickup>) => {
      state.isLoading = false;
      state.pickups.push(action.payload);
      state.currentPickup = action.payload;
      state.error = null;
    });
    builder.addCase(createPickup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update pickup
    builder.addCase(updatePickup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePickup.fulfilled, (state, action: PayloadAction<Pickup>) => {
      state.isLoading = false;
      const index = state.pickups.findIndex(pickup => pickup._id === action.payload._id);
      if (index !== -1) {
        state.pickups[index] = action.payload;
      }
      if (state.currentPickup && state.currentPickup._id === action.payload._id) {
        state.currentPickup = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updatePickup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Complete pickup
    builder.addCase(completePickup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(completePickup.fulfilled, (state, action: PayloadAction<Pickup>) => {
      state.isLoading = false;
      const index = state.pickups.findIndex(pickup => pickup._id === action.payload._id);
      if (index !== -1) {
        state.pickups[index] = action.payload;
      }
      if (state.currentPickup && state.currentPickup._id === action.payload._id) {
        state.currentPickup = action.payload;
      }
      state.error = null;
    });
    builder.addCase(completePickup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearPickupError, setCurrentPickup, clearCurrentPickup } = pickupSlice.actions;
export default pickupSlice.reducer;