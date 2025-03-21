// src/store/slices/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../../constants/config';

// Create API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: CONFIG.API_URL,
    prepareHeaders: async (headers) => {
      // Get the token from storage
      const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Auth', 'STT', 'Pickup', 'Delivery', 'Warehouse', 'User', 'Branch'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    // User endpoints
    getCurrentUser: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    uploadProfileImage: builder.mutation({
      query: (imageData) => ({
        url: '/users/profile-image',
        method: 'POST',
        body: imageData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // STT endpoints
    getSTTs: builder.query({
      query: (params) => ({
        url: '/stt',
        params,
      }),
      providesTags: ['STT'],
    }),
    getSTTById: builder.query({
      query: (id) => `/stt/${id}`,
      providesTags: (result, error, id) => [{ type: 'STT', id }],
    }),
    getSTTByBarcode: builder.query({
      query: (barcode) => `/stt/track/${barcode}`,
      providesTags: (result) => result ? [{ type: 'STT', id: result._id }] : ['STT'],
    }),
    createSTT: builder.mutation({
      query: (sttData) => ({
        url: '/stt',
        method: 'POST',
        body: sttData,
      }),
      invalidatesTags: ['STT'],
    }),
    updateSTT: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/stt/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'STT', id }],
    }),
    updateSTTStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/stt/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'STT', id }],
    }),
    
    // Pickup endpoints
    getPickupRequests: builder.query({
      query: (params) => ({
        url: '/pickup-requests',
        params,
      }),
      providesTags: ['Pickup'],
    }),
    getPickupRequestById: builder.query({
      query: (id) => `/pickup-requests/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pickup', id }],
    }),
    createPickupRequest: builder.mutation({
      query: (data) => ({
        url: '/pickup-requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pickup'],
    }),
    updatePickupRequestStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pickup-requests/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Pickup', id }],
    }),
    getPickups: builder.query({
      query: (params) => ({
        url: '/pickups',
        params,
      }),
      providesTags: ['Pickup'],
    }),
    getPickupById: builder.query({
      query: (id) => `/pickups/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pickup', id }],
    }),
    createPickup: builder.mutation({
      query: (data) => ({
        url: '/pickups',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pickup', 'STT'],
    }),
    completePickup: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pickups/${id}/complete`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Pickup', id },
        'STT',
      ],
    }),
    
    // Warehouse endpoints
    getTruckQueues: builder.query({
      query: (params) => ({
        url: '/truck-queues',
        params,
      }),
      providesTags: ['Warehouse'],
    }),
    createTruckQueue: builder.mutation({
      query: (data) => ({
        url: '/truck-queues',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    updateTruckQueueStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/truck-queues/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Warehouse', id }],
    }),
    getLoadings: builder.query({
      query: (params) => ({
        url: '/loadings',
        params,
      }),
      providesTags: ['Warehouse'],
    }),
    getLoadingById: builder.query({
      query: (id) => `/loadings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Warehouse', id }],
    }),
    createLoading: builder.mutation({
      query: (data) => ({
        url: '/loadings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Warehouse', 'STT'],
    }),
    updateLoadingStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/loadings/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Warehouse', id },
        'STT',
      ],
    }),
    
    // Delivery endpoints
    getVehicleQueues: builder.query({
      query: (params) => ({
        url: '/vehicle-queues',
        params,
      }),
      providesTags: ['Delivery'],
    }),
    createVehicleQueue: builder.mutation({
      query: (data) => ({
        url: '/vehicle-queues',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Delivery'],
    }),
    getDeliveries: builder.query({
      query: (params) => ({
        url: '/deliveries',
        params,
      }),
      providesTags: ['Delivery'],
    }),
    getDeliveryById: builder.query({
      query: (id) => `/deliveries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Delivery', id }],
    }),
    createDelivery: builder.mutation({
      query: (data) => ({
        url: '/deliveries',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Delivery', 'STT'],
    }),
    updateDeliveryStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/deliveries/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Delivery', id },
        'STT',
      ],
    }),
    completeDelivery: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/deliveries/${id}/complete`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Delivery', id },
        'STT',
      ],
    }),
    
    // Branch endpoints
    getBranches: builder.query({
      query: (params) => ({
        url: '/branches',
        params,
      }),
      providesTags: ['Branch'],
    }),
    getBranchById: builder.query({
      query: (id) => `/branches/${id}`,
      providesTags: (result, error, id) => [{ type: 'Branch', id }],
    }),
    
    // Dashboard endpoints
    getDashboardData: builder.query({
      query: () => '/dashboard/mobile',
      providesTags: ['STT', 'Pickup', 'Delivery', 'Warehouse'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  
  // User hooks
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useUploadProfileImageMutation,
  
  // STT hooks
  useGetSTTsQuery,
  useGetSTTByIdQuery,
  useGetSTTByBarcodeQuery,
  useCreateSTTMutation,
  useUpdateSTTMutation,
  useUpdateSTTStatusMutation,
  
  // Pickup hooks
  useGetPickupRequestsQuery,
  useGetPickupRequestByIdQuery,
  useCreatePickupRequestMutation,
  useUpdatePickupRequestStatusMutation,
  useGetPickupsQuery,
  useGetPickupByIdQuery,
  useCreatePickupMutation,
  useCompletePickupMutation,
  
  // Warehouse hooks
  useGetTruckQueuesQuery,
  useCreateTruckQueueMutation,
  useUpdateTruckQueueStatusMutation,
  useGetLoadingsQuery,
  useGetLoadingByIdQuery,
  useCreateLoadingMutation,
  useUpdateLoadingStatusMutation,
  
  // Delivery hooks
  useGetVehicleQueuesQuery,
  useCreateVehicleQueueMutation,
  useGetDeliveriesQuery,
  useGetDeliveryByIdQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryStatusMutation,
  useCompleteDeliveryMutation,
  
  // Branch hooks
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  
  // Dashboard hooks
  useGetDashboardDataQuery,
} = apiSlice;