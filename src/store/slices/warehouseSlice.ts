// src/store/slices/warehouseSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/endpoints/api';
import { 
  TruckQueue, 
  Loading, 
  WarehouseState, 
  SearchTruckQueueParams,
  SearchLoadingParams
} from '../../types/models/warehouse';

const initialState: WarehouseState = {
  truckQueues: [],
  loadings: [],
  currentTruckQueue: null,
  currentLoading: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getTruckQueues = createAsyncThunk(
  'warehouse/getTruckQueues',
  async (params: SearchTruckQueueParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/truck-queues', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to get truck queues. Please try again.');
    }
  }
);

export const createTruckQueue = createAsyncThunk(
  'warehouse/createTruckQueue',
  async (queueData: Partial<TruckQueue>, { rejectWithValue }) => {
    try {
      const response = await api.post('/truck-queues', queueData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to create truck queue. Please try again.');
    }
  }
);

export const updateTruckQueueStatus = createAsyncThunk(
  'warehouse/updateTruckQueueStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/truck-queues/${id}`, { status });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update truck queue status. Please try again.');
    }
  }
);

export const getLoadings = createAsyncThunk(
  'warehouse/getLoadings',
  async (params: SearchLoadingParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/loadings', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to get loadings. Please try again.');
    }
  }
);

export const createLoading = createAsyncThunk(
  'warehouse/createLoading',
  async (loadingData: Partial<Loading>, { rejectWithValue }) => {
    try {
      const response = await api.post('/loadings', loadingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to create loading. Please try again.');
    }
  }
);

export const updateLoadingStatus = createAsyncThunk(
  'warehouse/updateLoadingStatus',
  async ({ id, status, waktuBerangkat = null, waktuSampai = null }: 
    { id: string; status: string; waktuBerangkat?: Date | null; waktuSampai?: Date | null }, 
    { rejectWithValue }
  ) => {
    try {
      const payload: any = { status };
      if (waktuBerangkat) payload.waktuBerangkat = waktuBerangkat;
      if (waktuSampai) payload.waktuSampai = waktuSampai;
      
      const response = await api.put(`/loadings/${id}/status`, payload);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update loading status. Please try again.');
    }
  }
);

// Warehouse slice
const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    clearWarehouseError: (state) => {
      state.error = null;
    },
    setCurrentTruckQueue: (state, action: PayloadAction<TruckQueue>) => {
      state.currentTruckQueue = action.payload;
    },
    clearCurrentTruckQueue: (state) => {
      state.currentTruckQueue = null;
    },
    setCurrentLoading: (state, action: PayloadAction<Loading>) => {
      state.currentLoading = action.payload;
    },
    clearCurrentLoading: (state) => {
      state.currentLoading = null;
    },
  },
  extraReducers: (builder) => {
    // Get truck queues
    builder.addCase(getTruckQueues.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getTruckQueues.fulfilled, (state, action: PayloadAction<TruckQueue[]>) => {
      state.isLoading = false;
      state.truckQueues = action.payload;
      state.error = null;
    });
    builder.addCase(getTruckQueues.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create truck queue
    builder.addCase(createTruckQueue.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTruckQueue.fulfilled, (state, action: PayloadAction<TruckQueue>) => {
      state.isLoading = false;
      state.truckQueues.push(action.payload);
      state.currentTruckQueue = action.payload;
      state.error = null;
    });
    builder.addCase(createTruckQueue.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update truck queue status
    builder.addCase(updateTruckQueueStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTruckQueueStatus.fulfilled, (state, action: PayloadAction<TruckQueue>) => {
      state.isLoading = false;
      
      // Update in truckQueues array
      const index = state.truckQueues.findIndex(queue => queue._id === action.payload._id);
      if (index !== -1) {
        state.truckQueues[index] = action.payload;
      }
      
      // Update currentTruckQueue if it's the same
      if (state.currentTruckQueue && state.currentTruckQueue._id === action.payload._id) {
        state.currentTruckQueue = action.payload;
      }
      
      state.error = null;
    });
    builder.addCase(updateTruckQueueStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get loadings
    builder.addCase(getLoadings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getLoadings.fulfilled, (state, action: PayloadAction<Loading[]>) => {
      state.isLoading = false;
      state.loadings = action.payload;
      state.error = null;
    });
    builder.addCase(getLoadings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create loading
    builder.addCase(createLoading.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createLoading.fulfilled, (state, action: PayloadAction<Loading>) => {
      state.isLoading = false;
      state.loadings.push(action.payload);
      state.currentLoading = action.payload;
      state.error = null;
    });
    builder.addCase(createLoading.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update loading status
    builder.addCase(updateLoadingStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateLoadingStatus.fulfilled, (state, action: PayloadAction<Loading>) => {
      state.isLoading = false;
      
      // Update in loadings array
      const index = state.loadings.findIndex(loading => loading._id === action.payload._id);
      if (index !== -1) {
        state.loadings[index] = action.payload;
      }
      
      // Update currentLoading if it's the same
      if (state.currentLoading && state.currentLoading._id === action.payload._id) {
        state.currentLoading = action.payload;
      }
      
      state.error = null;
    });
    builder.addCase(updateLoadingStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  clearWarehouseError, 
  setCurrentTruckQueue, 
  clearCurrentTruckQueue,
  setCurrentLoading,
  clearCurrentLoading 
} = warehouseSlice.actions;

export default warehouseSlice.reducer;