// src/utils/formatters/paymentFormatter.ts
import { Theme } from 'react-native-paper';
import { PAYMENT_TYPES, FORWARDING_CODES } from '../../constants/config';

/**
 * Get human-readable label for payment type
 * @param paymentType Payment type code
 * @returns Human-readable payment type label
 */
export const getPaymentTypeLabel = (paymentType: string): string => {
  switch (paymentType) {
    case PAYMENT_TYPES.CASH:
      return 'Cash (Tunai)';
    case PAYMENT_TYPES.COD:
      return 'COD (Bayar di Tempat)';
    case PAYMENT_TYPES.CAD:
      return 'CAD (Bayar Setelah Kirim)';
    default:
      return paymentType || 'Unknown';
  }
};

/**
 * Get short label for payment type
 * @param paymentType Payment type code
 * @returns Short payment type label
 */
export const getPaymentTypeShortLabel = (paymentType: string): string => {
  switch (paymentType) {
    case PAYMENT_TYPES.CASH:
      return 'Cash';
    case PAYMENT_TYPES.COD:
      return 'COD';
    case PAYMENT_TYPES.CAD:
      return 'CAD';
    default:
      return paymentType || 'Unknown';
  }
};

/**
 * Get color for payment type based on theme
 * @param paymentType Payment type code
 * @param theme React Native Paper theme
 * @returns Color for the payment type
 */
export const getPaymentTypeColor = (paymentType: string, theme: Theme): string => {
  switch (paymentType) {
    case PAYMENT_TYPES.CASH:
      return theme.colors.success;
    case PAYMENT_TYPES.COD:
      return theme.colors.primary;
    case PAYMENT_TYPES.CAD:
      return theme.colors.accent;
    default:
      return theme.colors.disabled;
  }
};

/**
 * Get description for payment type
 * @param paymentType Payment type code
 * @returns Description of the payment type
 */
export const getPaymentTypeDescription = (paymentType: string): string => {
  switch (paymentType) {
    case PAYMENT_TYPES.CASH:
      return 'Pembayaran tunai di awal pengiriman';
    case PAYMENT_TYPES.COD:
      return 'Pembayaran tunai saat barang diterima';
    case PAYMENT_TYPES.CAD:
      return 'Pembayaran setelah pengiriman selesai';
    default:
      return 'Metode pembayaran tidak dikenal';
  }
};

/**
 * Get payment status label for STT
 * @param paymentType Payment type code
 * @param isPaid Whether the payment has been made
 * @returns Payment status label
 */
export const getPaymentStatusLabel = (paymentType: string, isPaid: boolean): string => {
  if (paymentType === PAYMENT_TYPES.CASH) {
    return 'Terbayar';
  }
  
  if (isPaid) {
    return 'Terbayar';
  }
  
  return 'Belum Dibayar';
};

/**
 * Get color for payment status based on theme
 * @param paymentType Payment type code
 * @param isPaid Whether the payment has been made
 * @param theme React Native Paper theme
 * @returns Color for the payment status
 */
export const getPaymentStatusColor = (
  paymentType: string,
  isPaid: boolean,
  theme: Theme
): string => {
  if (paymentType === PAYMENT_TYPES.CASH || isPaid) {
    return theme.colors.success;
  }
  
  return theme.colors.warning;
};

/**
 * Get forwarding code label
 * @param code Forwarding code
 * @returns Human-readable forwarding code label
 */
export const getForwardingLabel = (code: string): string => {
  switch (code) {
    case FORWARDING_CODES.NO_FORWARDING:
      return 'Tanpa Forwarding';
    case FORWARDING_CODES.PAID_BY_SENDER:
      return 'Forwarding Dibayar Pengirim';
    case FORWARDING_CODES.PAID_BY_RECEIVER:
      return 'Forwarding Dibayar Penerima';
    case FORWARDING_CODES.ADVANCED_BY_RECEIVER_BRANCH:
      return 'Forwarding Dimajukan Cabang Penerima';
    default:
      return code || 'Unknown';
  }
};

/**
 * Get short forwarding code label
 * @param code Forwarding code
 * @returns Short human-readable forwarding code label
 */
export const getForwardingShortLabel = (code: string): string => {
  switch (code) {
    case FORWARDING_CODES.NO_FORWARDING:
      return 'Tanpa Fwd';
    case FORWARDING_CODES.PAID_BY_SENDER:
      return 'Fwd Pengirim';
    case FORWARDING_CODES.PAID_BY_RECEIVER:
      return 'Fwd Penerima';
    case FORWARDING_CODES.ADVANCED_BY_RECEIVER_BRANCH:
      return 'Fwd Cabang';
    default:
      return code || 'Unknown';
  }
};