// src/store/slices/sttSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/endpoints/api';
import { STT, STTState, SearchSTTParams, UpdateSTTStatusParams } from '../../types/models/stt';

const initialState: STTState = {
  currentSTT: null,
  sttList: [],
  scannedSTT: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const searchSTT = createAsyncThunk(
  'stt/search',
  async (params: SearchSTTParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/stt', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to search STT. Please try again.');
    }
  }
);

export const getSTTByBarcode = createAsyncThunk(
  'stt/getByBarcode',
  async (barcode: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stt/track/${barcode}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to find STT. Please try again.');
    }
  }
);

export const updateSTTStatus = createAsyncThunk(
  'stt/updateStatus',
  async (params: UpdateSTTStatusParams, { rejectWithValue }) => {
    try {
      const response = await api.put(`/stt/${params.id}/status`, { status: params.status });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update STT status. Please try again.');
    }
  }
);

// STT slice
const sttSlice = createSlice({
  name: 'stt',
  initialState,
  reducers: {
    clearSTTError: (state) => {
      state.error = null;
    },
    clearScannedSTT: (state) => {
      state.scannedSTT = null;
    },
    setCurrentSTT: (state, action: PayloadAction<STT>) => {
      state.currentSTT = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Search STT
    builder.addCase(searchSTT.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(searchSTT.fulfilled, (state, action: PayloadAction<STT[]>) => {
      state.isLoading = false;
      state.sttList = action.payload;
      state.error = null;
    });
    builder.addCase(searchSTT.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get STT by barcode
    builder.addCase(getSTTByBarcode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getSTTByBarcode.fulfilled, (state, action: PayloadAction<STT>) => {
      state.isLoading = false;
      state.scannedSTT = action.payload;
      state.error = null;
    });
    builder.addCase(getSTTByBarcode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update STT status
    builder.addCase(updateSTTStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSTTStatus.fulfilled, (state, action: PayloadAction<STT>) => {
      state.isLoading = false;
      
      // Update in sttList
      const index = state.sttList.findIndex(stt => stt._id === action.payload._id);
      if (index !== -1) {
        state.sttList[index] = action.payload;
      }
      
      // Update currentSTT if it's the same
      if (state.currentSTT && state.currentSTT._id === action.payload._id) {
        state.currentSTT = action.payload;
      }
      
      // Update scannedSTT if it's the same
      if (state.scannedSTT && state.scannedSTT._id === action.payload._id) {
        state.scannedSTT = action.payload;
      }
      
      state.error = null;
    });
    builder.addCase(updateSTTStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSTTError, clearScannedSTT, setCurrentSTT } = sttSlice.actions;
export default sttSlice.reducer;