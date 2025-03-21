// src/utils/formatters/statusFormatter.ts
import { Theme } from 'react-native-paper';
import { STT_STATUS } from '../../constants/config';

/**
 * Get human-readable label for STT status
 * @param status STT status code
 * @returns Human-readable status label
 */
export const getSTTStatusLabel = (status: string): string => {
  switch (status) {
    case STT_STATUS.PENDING:
      return 'Menunggu';
    case STT_STATUS.PICKUP:
      return 'Pengambilan';
    case STT_STATUS.MUAT:
      return 'Muat';
    case STT_STATUS.TRANSIT:
      return 'Transit';
    case STT_STATUS.LANSIR:
      return 'Diantar';
    case STT_STATUS.TERKIRIM:
      return 'Terkirim';
    case STT_STATUS.RETURN:
      return 'Retur';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get color for STT status based on theme
 * @param status STT status code
 * @param theme React Native Paper theme
 * @returns Color for the status
 */
export const getSTTStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case STT_STATUS.PENDING:
      return theme.colors.warning;
    case STT_STATUS.PICKUP:
      return theme.colors.primary;
    case STT_STATUS.MUAT:
      return theme.colors.accent;
    case STT_STATUS.TRANSIT:
      return theme.colors.info;
    case STT_STATUS.LANSIR:
      return theme.colors.info;
    case STT_STATUS.TERKIRIM:
      return theme.colors.success;
    case STT_STATUS.RETURN:
      return theme.colors.error;
    default:
      return theme.colors.disabled;
  }
};

/**
 * Get human-readable label for pickup request status
 * @param status Pickup request status
 * @returns Human-readable status label
 */
export const getPickupRequestStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Menunggu';
    case 'FINISH':
      return 'Selesai';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get color for pickup request status based on theme
 * @param status Pickup request status
 * @param theme React Native Paper theme
 * @returns Color for the status
 */
export const getPickupRequestStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'PENDING':
      return theme.colors.warning;
    case 'FINISH':
      return theme.colors.success;
    default:
      return theme.colors.disabled;
  }
};

/**
 * Get human-readable label for truck queue status
 * @param status Truck queue status
 * @returns Human-readable status label
 */
export const getTruckQueueStatusLabel = (status: string): string => {
  switch (status) {
    case 'MENUNGGU':
      return 'Antri';
    case 'MUAT':
      return 'Muat';
    case 'BERANGKAT':
      return 'Berangkat';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get color for truck queue status based on theme
 * @param status Truck queue status
 * @param theme React Native Paper theme
 * @returns Color for the status
 */
export const getTruckQueueStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'MENUNGGU':
      return theme.colors.warning;
    case 'MUAT':
      return theme.colors.accent;
    case 'BERANGKAT':
      return theme.colors.success;
    default:
      return theme.colors.disabled;
  }
};

/**
 * Get human-readable label for loading status
 * @param status Loading status
 * @returns Human-readable status label
 */
export const getLoadingStatusLabel = (status: string): string => {
  switch (status) {
    case 'MUAT':
      return 'Muat';
    case 'BERANGKAT':
      return 'Berangkat';
    case 'SAMPAI':
      return 'Sampai';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get color for loading status based on theme
 * @param status Loading status
 * @param theme React Native Paper theme
 * @returns Color for the status
 */
export const getLoadingStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'MUAT':
      return theme.colors.accent;
    case 'BERANGKAT':
      return theme.colors.info;
    case 'SAMPAI':
      return theme.colors.success;
    default:
      return theme.colors.disabled;
  }
};

/**
 * Get human-readable label for delivery status
 * @param status Delivery status
 * @returns Human-readable status label
 */
export const getDeliveryStatusLabel = (status: string): string => {
  switch (status) {
    case 'LANSIR':
      return 'Diantar';
    case 'TERKIRIM':
      return 'Terkirim';
    case 'BELUM SELESAI':
      return 'Belum Selesai';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get color for delivery status based on theme
 * @param status Delivery status
 * @param theme React Native Paper theme
 * @returns Color for the status
 */
export const getDeliveryStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'LANSIR':
      return theme.colors.info;
    case 'TERKIRIM':
      return theme.colors.success;
    case 'BELUM SELESAI':
      return theme.colors.warning;
    default:
      return theme.colors.disabled;
  }
};

/**
 * Get human-readable label for vehicle queue status
 * @param status Vehicle queue status
 * @returns Human-readable status label
 */
export const getVehicleQueueStatusLabel = (status: string): string => {
  switch (status) {
    case 'MENUNGGU':
      return 'Antri';
    case 'LANSIR':
      return 'Diantar';
    case 'KEMBALI':
      return 'Kembali';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get color for vehicle queue status based on theme
 * @param status Vehicle queue status
 * @param theme React Native Paper theme
 * @returns Color for the status
 */
export const getVehicleQueueStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'MENUNGGU':
      return theme.colors.warning;
    case 'LANSIR':
      return theme.colors.info;
    case 'KEMBALI':
      return theme.colors.success;
    default:
      return theme.colors.disabled;
  }
};