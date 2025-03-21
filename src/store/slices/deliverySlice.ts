// src/store/slices/deliverySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/endpoints/api';
import { Delivery, DeliveryState, SearchDeliveryParams } from '../../types/models/delivery';

const initialState: DeliveryState = {
  deliveries: [],
  currentDelivery: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getDeliveries = createAsyncThunk(
  'delivery/getAll',
  async (params: SearchDeliveryParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/deliveries', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to get deliveries. Please try again.');
    }
  }
);

export const getDeliveryById = createAsyncThunk(
  'delivery/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/deliveries/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to get delivery. Please try again.');
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'delivery/updateStatus',
  async ({ id, status, namaPenerima = null, keterangan = null }: 
    { id: string; status: string; namaPenerima?: string | null; keterangan?: string | null }, 
    { rejectWithValue }
  ) => {
    try {
      const payload: any = { status };
      if (namaPenerima) payload.namaPenerima = namaPenerima;
      if (keterangan) payload.keterangan = keterangan;
      
      const response = await api.put(`/deliveries/${id}/status`, payload);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update delivery status. Please try again.');
    }
  }
);

export const createDelivery = createAsyncThunk(
  'delivery/create',
  async (deliveryData: Partial<Delivery>, { rejectWithValue }) => {
    try {
      const response = await api.post('/deliveries', deliveryData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to create delivery. Please try again.');
    }
  }
);

// Delivery slice
const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    clearDeliveryError: (state) => {
      state.error = null;
    },
    setCurrentDelivery: (state, action: PayloadAction<Delivery>) => {
      state.currentDelivery = action.payload;
    },
    clearCurrentDelivery: (state) => {
      state.currentDelivery = null;
    },
  },
  extraReducers: (builder) => {
    // Get deliveries
    builder.addCase(getDeliveries.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDeliveries.fulfilled, (state, action: PayloadAction<Delivery[]>) => {
      state.isLoading = false;
      state.deliveries = action.payload;
      state.error = null;
    });
    builder.addCase(getDeliveries.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get delivery by id
    builder.addCase(getDeliveryById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getDeliveryById.fulfilled, (state, action: PayloadAction<Delivery>) => {
      state.isLoading = false;
      state.currentDelivery = action.payload;
      state.error = null;
    });
    builder.addCase(getDeliveryById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update delivery status
    builder.addCase(updateDeliveryStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateDeliveryStatus.fulfilled, (state, action: PayloadAction<Delivery>) => {
      state.isLoading = false;
      
      // Update in deliveries array
      const index = state.deliveries.findIndex(delivery => delivery._id === action.payload._id);
      if (index !== -1) {
        state.deliveries[index] = action.payload;
      }
      
      // Update currentDelivery if it's the same
      if (state.currentDelivery && state.currentDelivery._id === action.payload._id) {
        state.currentDelivery = action.payload;
      }
      
      state.error = null;
    });
    builder.addCase(updateDeliveryStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create delivery
    builder.addCase(createDelivery.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createDelivery.fulfilled, (state, action: PayloadAction<Delivery>) => {
      state.isLoading = false;
      state.deliveries.push(action.payload);
      state.currentDelivery = action.payload;
      state.error = null;
    });
    builder.addCase(createDelivery.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearDeliveryError, setCurrentDelivery, clearCurrentDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;